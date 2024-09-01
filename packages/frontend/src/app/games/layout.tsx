"use client";

import { useWeb3AuthContext } from "@/utils/context/web3auth.context";
import { redirect, RedirectType } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoutesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useWeb3AuthContext();

  useEffect(() => {
    if (!user) redirect("/", RedirectType.replace);
  }, []);
  return children;
}
