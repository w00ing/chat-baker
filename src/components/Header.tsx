import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 z-10 flex w-full max-w-lg items-center justify-between border-b-2 bg-white px-4 pt-5 pb-3 sm:px-4">
      <Link href="/" className="flex space-x-2">
        <Image
          alt="header text"
          src="/gear.png"
          className="h-7 w-7 sm:h-10 sm:w-10"
          width={36}
          height={36}
        />
        <h1 className="ml-4 mt-0 self-center text-2xl font-bold tracking-tight sm:mt-1.5 sm:text-3xl">
          Chat Baker
        </h1>
      </Link>
    </header>
  );
}
