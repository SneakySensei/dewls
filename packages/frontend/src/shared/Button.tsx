import { cn } from "@/utils/cn";
import { ComponentPropsWithoutRef } from "react";

type Props = Omit<ComponentPropsWithoutRef<"button">, "className">;

export default function Button({ children, ...props }: Props) {
  return (
    <button
      {...props}
      className={cn(
        "text-body-3 inline-block px-3 py-2 rounded transition-all hover:brightness-105 active:brightness-95 active:transition-none text-neutral-100 overflow-hidden bg-graident-button",
        props.disabled
          ? "text-brand-900 bg-brand-950"
          : "rounded-gradient-border"
      )}
    >
      {children}
    </button>
  );
}
