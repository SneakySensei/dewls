"use client";

import { web3auth } from "@/utils/store/web3auth.store";
import { IProvider } from "@web3auth/base";
import { useEffect, useState } from "react";

export const ConnectModal: React.FC = () => {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const login = async () => {
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
    if (web3auth.connected) {
      setLoggedIn(true);
    }
  };

  const getUserInfo = async () => {
    const user = await web3auth.getUserInfo();
    console.log(user);
  };

  const logout = async () => {
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
  };

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.initModal();
        setProvider(web3auth.provider);

        if (web3auth.connected) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  return (
    <div>
      <button onClick={login}>Connect</button>
      <button onClick={getUserInfo}>Get User Info</button>
      <button onClick={logout}>Logout</button>
      <div>
        {provider && <p>Provider: {provider?.chainId}</p>}
        {loggedIn && <p>Logged In</p>}
      </div>
    </div>
  );
};
