import { XmtpClientService } from "../../services";
import {
    base64ToBytes,
    addBroadcast,
    startBroadcast,
} from "../../utils/functions";
import { broadcastEntities } from "../../utils/functions/start-broadcast";
import { invitation } from "@xmtp/proto";
import { broadCastConfigEntities } from "common/xmtp/brodcaster-config";

export const lookupAddress = async (
    address: string,
    broadcastAddress: string,
) => {
    if (typeof address !== "string") {
        throw new Error("Address must be a string");
    }
    if (typeof broadcastAddress !== "string") {
        throw new Error("Broadcast address must be a string");
    }
    const client = await XmtpClientService.getXmtpClient(broadcastAddress);
    if (!client) {
        console.log("Client not initialized " + broadcastAddress);
        throw new Error("Client not initialized");
    }
    const canMessage = await client.canMessage(address);
    return {
        onNetwork: canMessage,
    };
};

export const subscribeBroadcast = async (
    address: string,
    broadcastAddress: string,
    consentProofString: string,
) => {
    if (typeof address !== "string") {
        throw new Error("Address must be a string");
    }

    if (typeof broadcastAddress !== "string") {
        throw new Error("Broadcast address must be a string");
    }

    if (typeof consentProofString !== "string") {
        throw new Error("Consent proof must be a string");
    }

    const consentProofUint8Array = base64ToBytes(consentProof);

    const client = await XmtpClientService.getXmtpClient(broadcastAddress);
    const { greeting } = broadCastConfigEntities.map[broadcastAddress];
    if (!client) {
        console.log("Client not initialized " + broadcastAddress);
        throw new Error("Client not initialized");
    }
    const consentProof = invitation.ConsentProofPayload.decode(
        consentProofUint8Array,
    );
    console.log("Creating conversation with: ", {
        consentProof,
    });
    const conversation = await client.conversations.newConversation(
        address,
        undefined,
        consentProof,
    );
    console.log("Conversation created: ", conversation.topic);
    await conversation.send(greeting);
    return {
        success: true,
        topic: conversation.topic,
    };
};

export const sendBroadcast = async (text: string, address: string) => {
    if (typeof text !== "string") {
        throw new Error("Text must be a string");
    }
    if (typeof address !== "string") {
        throw new Error("Address must be a string");
    }
    const client = await XmtpClientService.getXmtpClient(address);
    if (!client) {
        throw new Error("Client not initialized");
    }

    const subscribers = getDevWalletAddresses();
    const broadcastId = addBroadcast(client.address, subscribers, text);
    startBroadcast(client, subscribers, text, broadcastId);

    return {
        success: true,
        broadcastId,
    };
};

export const getBroadcastLink = (broadcastId: string) => {
    if (broadcastEntities.entities[broadcastId] === undefined) {
        console.log(broadcastEntities.ids);
        throw new Error("Broadcast not found");
    }
    const broadcast = broadcastEntities.entities[broadcastId];
    return {
        success: true,
        broadcastId,
        broadcast,
    };
};
