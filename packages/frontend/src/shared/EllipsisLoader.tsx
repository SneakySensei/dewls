"use client";

import clsx from "clsx";
import { ComponentPropsWithoutRef, useEffect, useState } from "react";

type Props = Omit<ComponentPropsWithoutRef<"span">, "children">;
export default function EllipsisLoader(props: Props) {
  const [count, setCount] = useState<number>(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((count) => (count = (count + 1) % 4));
    }, 200);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <span {...props}>
      <span className={clsx(count < 1 && "invisible")}>.</span>
      <span className={clsx(count < 2 && "invisible")}>.</span>
      <span className={clsx(count < 3 && "invisible")}>.</span>
    </span>
  );
}
