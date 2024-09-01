import Image from "next/image";
import Wordmark from "@/assets/branding/wordmark.svg";

export default function Header() {
  return (
    <header className="py-4 text-center bg-gradient-logo-glow">
      <Image src={Wordmark} alt="Logo" className="h-7 block mx-auto w-auto" />
    </header>
  );
}
