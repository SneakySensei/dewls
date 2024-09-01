"use client";

import { web3auth } from "@/utils/service/web3auth.service";
import { useEffect, useState } from "react";
import { useWeb3AuthContext } from "@/utils/context/web3auth.context";
import { API_BASE_URL } from "@/utils/constants/api.constant";
import { getWalletAddress } from "@/utils/functions/ethers";
import { UserInfo } from "@web3auth/base";
import { MappedUser, ResponseWithData } from "@/utils/types";

export const ConnectModal: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const {
    provider,
    user,
    setProvider: setProviderContext,
    setUser,
  } = useWeb3AuthContext();

  const login = async () => {
    const web3authProvider = await web3auth.connect();
    setProviderContext(web3authProvider);
    if (web3auth.connected) {
      await handleWeb3Auth();
    }
  };

  const logout = async () => {
    await web3auth.logout();
    setProviderContext(null);
    setLoggedIn(false);
    setUser(null);
  };

  const handleUserAuth = async (
    user: Partial<UserInfo> & { wallet_address: string }
  ) => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/auth`, {
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
        user: MappedUser;
        token: string;
      }>;
      if (userResponse.success) return userResponse.data;
    } catch (error) {
      console.error(error);
    }
  };

  const handleWeb3Auth = async () => {
    try {
      if (web3auth.connected && web3auth.provider) {
        const [userInfo, walletAddress] = await Promise.all([
          web3auth.getUserInfo(),
          getWalletAddress(web3auth.provider),
        ]);

        const authResponse = await handleUserAuth({
          ...userInfo,
          wallet_address: walletAddress,
        });

        if (!authResponse) return;

        setLoggedIn(true);
        localStorage.setItem("token", authResponse.token);
        setUser({ data: authResponse.user, token: authResponse.token });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.initModal();
        setProviderContext(web3auth.provider);

        await handleWeb3Auth();
      } catch (error) {
        console.error(error);
      }
    };
    init();
  }, []);

  console.log(user, localStorage.getItem("token"));

  return (
    <div>
      <button onClick={login}>Connect</button>
      <button onClick={logout}>Logout</button>
      <div>
        {provider && <p>Provider: {provider?.chainId}</p>}
        {loggedIn && <p>Logged In</p>}
      </div>
    </div>
  );
};
