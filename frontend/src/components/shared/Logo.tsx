"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";

export function Logo() {
  return (
    <Link href="/" className="flex items-center">
      <Image
        src="/assets/images/logos/logo-small.png"
        alt="Rento"
        width={120}
        height={36}
        priority
        className="h-8 w-auto object-contain dark:brightness-110"
      />
    </Link>
  );
}
