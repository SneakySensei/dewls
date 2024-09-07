import { Broadcast as BroadcastService } from "../../services/broadcast.service";
import type { Client } from "@xmtp/xmtp-js";
import { broadCastConfigEntities } from "common";

const XMTP_RATE_LIMIT = 1000;
const XMTP_RATE_LIMIT_TIME = 60 * 1000; // 1 minute
const XMTP_RATE_LIMIT_TIME_INCREASE = XMTP_RATE_LIMIT_TIME * 5; // 5 minutes

let sendCount = 0;
let errorCount = 0;
let startTime: number;

interface Broadcast {
    id: string;
    address: string;
    message: string;
    recipients: number;
    sent: number;
    startTime: string;
    endTime?: string;
    status: "sending" | "waiting" | "completed" | "failed";
}

interface BroadcastEntities {
    ids: string[];
    entities: { [id: string]: Broadcast };
}

export const broadcastEntities: BroadcastEntities = {
    ids: [],
    entities: {},
};

function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
        (
            +c ^
            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
        ).toString(16),
    );
}

export const addBroadcast = (
    broadcastAddress: string,
    recipients: string[],
    message: string,
): string => {
    const id = uuidv4();

    const broadcast: Broadcast = {
        id,
        address: broadcastAddress,
        message,
        recipients: recipients.length,
        sent: 0,
        startTime: new Date().toISOString(),
        status: "sending",
    };
    broadcastEntities.ids.push(id);
    broadcastEntities.entities[id] = broadcast;

    return id;
};

export const incrementBroadcastSent = (id: string): void => {
    const broadcast = broadcastEntities.entities[id];
    const count = broadcast.sent + 1;
    const total = broadcast.recipients;
    broadcastEntities.entities[id].sent = broadcast.sent + 1;
    console.log(`Message sent for broadcast ${id} ${count}/${total}`);
};

export const updateBroadcastStatus = (
    id: string,
    status: Broadcast["status"],
): void => {
    broadcastEntities.entities[id].status = status;
};

export const finishBroadcast = (id: string): void => {
    broadcastEntities.entities[id].endTime = new Date().toISOString();
    broadcastEntities.entities[id].status = "completed";
};

export const startBroadcast = async (
    client: Client,
    broadcastAddresses: string[],
    message: string,
    broadcastId: string,
): Promise<void> => {
    const onBroadcastComplete = () => {
        let endTime = Date.now();
        console.log(
            `Broadcast ${broadcastId} completed Total time ${endTime - startTime}ms`,
        );
        finishBroadcast(broadcastId);
    };
    const onMessageSending = (address: string) => {
        console.log(`Sending message to address ${address}`);
    };
    const onMessageFailed = (address: string) => {
        errorCount++;
        console.log(`Message failed for address ${errorCount} : ${address}`);
    };
    const onMessageSent = () => {
        sendCount++;
        incrementBroadcastSent(broadcastId);
    };
    const onCanMessageAddressesUpdate = (addresses: string[]) => {
        console.log(`Can message addresses updated to ${addresses.length}`);
    };
    const onBatchComplete = (addresses: string[]) => {
        console.log(`Batch complete for ${addresses.length} addresses`);
    };
    const onCantMessageAddress = (address: string) => {
        console.log(`Can't message address ${address}`);
    };
    const onCanMessageAddreses = (addresses: string[]) => {
        console.log(`Can message addresses ${addresses.length}`);
    };
    const onDelay = (ms: number) => {
        console.log(`Delaying for ${ms}ms`);
        updateBroadcastStatus(broadcastId, "waiting");
    };
    const onBatchStart = (addresses: string[]) => {
        console.log(`Batch start for ${addresses.length} addresses`);
        updateBroadcastStatus(broadcastId, "sending");
    };
    errorCount = 0;
    sendCount = 0;
    startTime = Date.now();
    const broadcastConfigId = broadCastConfigEntities.map[client.address].id;
    const broadcast = new BroadcastService({
        client,
        addresses: broadcastAddresses,
        cachedCanMessageAddresses: [],
        messages: [message],
        rateLimitAmount: Number(
            process.env[`${broadcastConfigId}_RATE_LIMIT_AMOUNT`] ??
                XMTP_RATE_LIMIT,
        ),
        rateLimitTime: Number(
            process.env[`${broadcastConfigId}_RATE_LIMIT_DURATION`] ??
                XMTP_RATE_LIMIT_TIME_INCREASE,
        ),
        onBatchStart,
        onBatchComplete,
        onBroadcastComplete,
        onMessageSending,
        onCantMessageAddress,
        onCanMessageAddreses,
        onMessageFailed,
        onMessageSent,
        onCanMessageAddressesUpdate,
        onDelay,
    });
    try {
        await broadcast.broadcast();
    } catch (err) {
        console.error(`Error broadcasting: ${err}`);
        updateBroadcastStatus(broadcastId, "failed");
    }
};
