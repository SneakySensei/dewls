import RockImage from "@/assets/rock.png";
import PaperImage from "@/assets/paper.png";
import ScissorsImage from "@/assets/scissors.png";
import { RockPaperScissors } from "common";
import clsx from "clsx";
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
        state === "lose" && "grayscale"
      )}
    >
      <Image
        src={MOVE_IMAGE_MAP[move]}
        alt={move}
        className={clsx("h-[30vh] max-h-[80%] w-auto", isEnemy && "rotate-180")}
      />
    </div>
  );
}

export const MOVE_IMAGE_MAP = {
  rock: RockImage,
  paper: PaperImage,
  scissors: ScissorsImage,
};
