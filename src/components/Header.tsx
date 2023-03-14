import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface HeaderProps {
  title?: string;
}

export default function Header({ title }: HeaderProps) {
  const router = useRouter();
  return (
    <header className="fixed top-0 z-10 flex w-full max-w-lg items-center border-b-white/50 justify-between border-b px-4 pt-5 pb-3 sm:px-4">
      <Link href="/" className="flex space-x-2">
        <Image
          alt="header text"
          src="/logo.svg"
          className="h-10 w-10 sm:h-10 sm:w-10"
          width={36}
          height={36}
        />
        <p className="mt-0 self-center font-semibold tracking-tight">
          Chatting with {title}
        </p>
      </Link>
      <Button onClick={() => router.push("/")} variant="subtle" size="sm">
        <Plus />
      </Button>
    </header>
  );
}
