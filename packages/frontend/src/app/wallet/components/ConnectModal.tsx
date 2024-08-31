"use client";

import { web3auth } from "@/utils/store/web3auth.store";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useWeb3AuthContext } from "@/utils/context/web3auth.context";

export const ConnectModal: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const { provider, setProvider: setProviderContext } = useWeb3AuthContext();

  const login = async () => {
    const web3authProvider = await web3auth.connect();

    setProviderContext(web3authProvider);
    if (web3auth.connected) {
      setLoggedIn(true);
      //   const signProtocolClient = new SignProtocolClient(SpMode.OnChain, {
      //     chain: EvmChains.arbitrumSepolia,
      //     walletClient: web3auth
      //   });
      //   const createSchemaRes = await signProtocolClient.createSchema({
      //     name: "xxx",
      //     data: [{ name: "name", type: "string" }],
      //   });
      //   console.log(createSchemaRes);
    }
  };

  const getUserInfo = async () => {
    const user = await web3auth.getUserInfo();
    if (provider) {
      const wallet_address = new ethers.BrowserProvider(provider);
      const wallet = (await wallet_address.getSigner()).address;

      console.log(wallet);
    }
    console.log(user);
  };

  const logout = async () => {
    await web3auth.logout();
    setProviderContext(null);
    setLoggedIn(false);
  };

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.initModal();
        setProviderContext(web3auth.provider);

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
