"use client";

import { web3auth } from "@/utils/service/web3auth.service";
import { useEffect, useState } from "react";
import { useWeb3AuthContext } from "@/utils/context/web3auth.context";
import { API_BASE_URL } from "@/utils/constants/api.constant";
import { getWalletAddress } from "@/utils/functions/ethers";

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

  const handleUserAuth = async (user: any) => {
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

      const data = await res.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const handleWeb3Auth = async () => {
    try {
      if (web3auth.connected && web3auth.provider) {
        const promises = await Promise.all([
          web3auth.getUserInfo(),
          getWalletAddress(web3auth.provider),
        ]);

        const authResponse = await handleUserAuth({
          ...promises[0],
          wallet_address: promises[1],
        });

        setLoggedIn(true);
        localStorage.setItem("token", authResponse.data.token);
        setUser({
          email_id: promises[0].email!,
          name: promises[0].name ? promises[0].name : promises[1],
          profile_photo: promises[0].profileImage
            ? promises[0].profileImage
            : "",
          wallet_address: promises[1],
        });
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
