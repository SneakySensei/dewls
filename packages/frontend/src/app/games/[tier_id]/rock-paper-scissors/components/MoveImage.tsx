import PaperImage from "@/assets/paper.png";
import RockImage from "@/assets/rock.png";
import ScissorsImage from "@/assets/scissors.png";
import clsx from "clsx";
import { RockPaperScissors } from "common";
import Image from "next/image";

type MoveProps = {
    deciding?: boolean;
    move: RockPaperScissors.Move;
    isEnemy?: boolean;
    state: "win" | "lose" | "idle";
};
export default function MoveImage({
    move,
    isEnemy,
    state,
    deciding,
}: MoveProps) {
    return (
        <div
            className={clsx(
                "transition-all",
                deciding && "animate-shake",
                isEnemy ? "origin-top" : "origin-bottom",
                state === "lose" && "grayscale",
            )}
        >
            {move === "skipped" ? (
                <h2 className="my-10 text-display-1">Skipped!</h2>
            ) : (
                <Image
                    src={MOVE_IMAGE_MAP[move]}
                    alt={move}
                    className={clsx(
                        "h-[30vh] max-h-[80%] w-auto",
                        isEnemy && "rotate-180",
                    )}
                />
            )}
        </div>
    );
}

export const MOVE_IMAGE_MAP = {
    rock: RockImage,
    paper: PaperImage,
    scissors: ScissorsImage,
};
