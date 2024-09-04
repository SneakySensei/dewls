"use client";

import { cn } from "@/utils/cn";
import { ComponentPropsWithoutRef } from "react";

type Props = Omit<ComponentPropsWithoutRef<"button">, "className"> & {
    variant?: "solid" | "text";
};

export default function Button({
    children,
    variant = "solid",
    ...props
}: Props) {
    if (variant === "text")
        return (
            <button className="text-center text-body-2 font-medium text-brand-400 transition-all will-change-transform hover:scale-105 active:scale-95 active:transition-none">
                {children}
            </button>
        );
    return (
        <button
            {...props}
            className={cn(
                "inline-block overflow-hidden rounded bg-graident-button px-3 py-2 text-center !text-body-2 font-medium text-neutral-100 transition-all will-change-auto hover:brightness-110 active:brightness-95 active:transition-none",
                props.disabled
                    ? "bg-brand-950 text-brand-900"
                    : "rounded-gradient-border",
            )}
        >
            {children}
        </button>
    );
}
