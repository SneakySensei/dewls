import { useEffect, useState } from "react";

export default function Countdown({ timeSeconds }: { timeSeconds: number }) {
    const [number, setNumber] = useState(timeSeconds);

    useEffect(() => {
        setNumber(timeSeconds);
        const interval = setInterval(() => {
            setNumber((num) => {
                const newNum = num - 1;
                if (newNum === 0) clearInterval(interval);

                return newNum;
            });
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [timeSeconds]);

    return number;
}
