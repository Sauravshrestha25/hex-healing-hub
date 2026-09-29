"use client";

import Link from "next/link";
import { ChevronDown, ExternalLink, KeyRound, LogOut } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { logout } from "@/features/auth/server/actions";
import { InitialsAvatar, Pill } from "./kit";

export function AdminTopbar({ user }: { user: { name: string; email: string; isVerified: boolean } }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur-md sm:px-6">
      <SidebarTrigger className="-ml-1" />
      <div className="ml-auto flex items-center gap-2">
        <Link href="/" target="_blank" className={buttonVariants({ variant: "outline", size: "sm", className: "hidden sm:inline-flex" })}>
          <ExternalLink />
          View website
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-full py-1 pr-2 pl-1 transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50">
            <InitialsAvatar name={user.name} className="size-8" />
            <span className="hidden max-w-40 truncate text-sm font-medium md:block">{user.name}</span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex flex-col gap-1.5 py-2 font-normal">
                <span className="truncate font-medium text-foreground">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                {!user.isVerified && (
                  <span>
                    <Pill tone="gold">View only</Pill>
                  </span>
                )}
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href="/admin/account" />}>
              <KeyRound />
              Account &amp; password
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/" target="_blank" />} className="sm:hidden">
              <ExternalLink />
              View website
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => logout()}>
              <LogOut />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
