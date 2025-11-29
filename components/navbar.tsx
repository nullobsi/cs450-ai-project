'use client';

import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { ModeToggle } from "./mode-toggle"
import Link from "next/link"

export function Navbar() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Menubar className="border-none">
          <MenubarMenu>
            <MenubarTrigger className="font-bold text-lg cursor-pointer">
              <Link href="/">CS450 AI Quiz</Link>
            </MenubarTrigger>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger className="cursor-pointer">
              <Link href="/">Create Quiz</Link>
            </MenubarTrigger>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger className="cursor-pointer">
              <Link href="/my-quizzes">My Quizzes</Link>
            </MenubarTrigger>
          </MenubarMenu>
        </Menubar>
        <div className="ml-auto">
          <ModeToggle />
        </div>
      </div>
    </div>
  )
}
