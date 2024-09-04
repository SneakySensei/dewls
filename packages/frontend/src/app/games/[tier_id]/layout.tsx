"use client";

import { useWeb3AuthContext } from "@/utils/context/web3auth.context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoutesLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    const { user } = useWeb3AuthContext();

    useEffect(() => {
        if (!user) router.replace("/");
    }, []);

    if (!user) return null;
    return children;
}
