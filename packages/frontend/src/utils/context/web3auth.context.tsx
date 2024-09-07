"use client";

import { API_REST_BASE_URL } from "../constants/api.constant";
import { getWalletAddress } from "../functions/ethers";
import { MappedPlayer, ResponseWithData } from "../types";
import { web3auth } from "@/utils/service/web3auth.service";
import { IProvider, UserInfo } from "@web3auth/base";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { toast } from "sonner";

export type AuthUser = { data: MappedPlayer; token: string };

interface Web3AuthContext {
    provider: IProvider | null;
    user: AuthUser | null;
    isAuthenticating: boolean;
    login: () => Promise<void>;
    logout: () => Promise<void>;
}

const Web3AuthContext = createContext({} as Web3AuthContext);

export const Web3AuthContextProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [provider, setProvider] = useState<IProvider | null>(null);
    const [user, setUser] = useState<AuthUser | null>(null);

    const login = async () => {
        setIsAuthenticating(true);
        const web3authProvider = await web3auth.connect();
        setProvider(web3authProvider);
        if (web3auth.connected) {
            await handleWeb3Auth();
        }
        setIsAuthenticating(false);
    };

    const logout = async () => {
        await web3auth.logout();
        setProvider(null);
        setUser(null);
    };

    const handleUserAuth = async (
        user: Partial<UserInfo> & { wallet_address: string },
    ) => {
        try {
            const res = await fetch(`${API_REST_BASE_URL}/players/auth`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email_id: user.email,
                    name: user.name,
                    profile_photo: user.profileImage,
                    wallet_address: user.wallet_address,
                }),
                cache: "no-cache",
            });

            const userResponse = (await res.json()) as ResponseWithData<{
                user: MappedPlayer;
                token: string;
            }>;
            if (userResponse.success) return userResponse.data;
        } catch (error) {
            console.error(error);
            setIsAuthenticating(false);
        }
    };

    const handleWeb3Auth = async () => {
        setIsAuthenticating(true);
        try {
            if (web3auth.connected && web3auth.provider) {
                const [userInfo, wallet_address] = await Promise.all([
                    web3auth.getUserInfo(),
                    getWalletAddress(web3auth.provider),
                ]);

                const authResponse = await handleUserAuth({
                    ...userInfo,
                    wallet_address,
                });

                if (!authResponse) return;
                setUser({ data: authResponse.user, token: authResponse.token });
                toast.success("Logged in!");
            }
        } catch (error) {
            console.error(error);
        }
        setIsAuthenticating(false);
    };

    useEffect(() => {
        const init = async () => {
            try {
                await web3auth.initModal();
                setProvider(web3auth.provider);

                await handleWeb3Auth();
            } catch (error) {
                console.error(error);
            }
        };
        init();
    }, []);

    return (
        <Web3AuthContext.Provider
            value={{
                provider,
                user,
                isAuthenticating,
                login,
                logout,
            }}
        >
            {children}
        </Web3AuthContext.Provider>
    );
};

export const useWeb3AuthContext = () => useContext(Web3AuthContext);
