"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Images, Inbox, LayoutDashboard, Newspaper, Sparkles, Users, type LucideIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { WebxLogo } from "@/features/shared/components/webx-logo";

type NavItem = { href: string; label: string; icon: LucideIcon };

const GROUPS: { label?: string; items: NavItem[] }[] = [
  {
    items: [
      { href: "/admin", label: "Overview", icon: LayoutDashboard },
      { href: "/admin/inquiries", label: "Inquiries", icon: Inbox },
    ],
  },
  {
    label: "Website content",
    items: [
      { href: "/admin/blogs", label: "Blogs", icon: Newspaper },
      { href: "/admin/services", label: "Services", icon: Sparkles },
      { href: "/admin/portfolio", label: "Portfolio", icon: Images },
    ],
  },
  { label: "Team", items: [{ href: "/admin/users", label: "Users", icon: Users }] },
];

export function AdminSidebar({ newInquiries }: { newInquiries: number }) {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/admin" ? pathname === href : pathname.startsWith(href));

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 pt-4 pb-2">
        <Link href="/admin" className="flex items-center gap-2.5 rounded-lg px-1 py-1">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/[0.07] ring-1 ring-white/10">
            <Image src="/white_logo.png" alt="" width={24} height={24} className="rounded-full" />
          </span>
          <span className="grid leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-semibold text-white">HEX Healing Hub</span>
            <span className="truncate text-[11px] tracking-wide text-sidebar-primary/90 uppercase">Admin</span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-1">
        {GROUPS.map((group, index) => (
          <SidebarGroup key={group.label ?? index}>
            {group.label && (
              <SidebarGroupLabel className="text-[11px] tracking-wider text-sidebar-foreground/45 uppercase">
                {group.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map(({ href, label, icon: Icon }) => {
                  const active = isActive(href);
                  return (
                    <SidebarMenuItem key={href}>
                      <SidebarMenuButton
                        isActive={active}
                        tooltip={label}
                        render={<Link href={href} />}
                        className="relative h-9 text-sidebar-foreground/80 hover:text-white data-active:bg-sidebar-accent data-active:font-medium data-active:text-white"
                      >
                        {active && (
                          <span
                            aria-hidden="true"
                            className="absolute top-1.5 bottom-1.5 left-0 w-[3px] rounded-full bg-sidebar-primary group-data-[collapsible=icon]:hidden"
                          />
                        )}
                        <Icon className={active ? "text-sidebar-primary" : undefined} />
                        <span>{label}</span>
                      </SidebarMenuButton>
                      {href === "/admin/inquiries" && newInquiries > 0 && (
                        <SidebarMenuBadge className="rounded-full bg-sidebar-primary px-1.5 text-[11px] font-semibold text-sidebar-primary-foreground">
                          {newInquiries}
                        </SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="px-4 pb-4 group-data-[collapsible=icon]:hidden">
        <div className="flex items-center gap-2 border-t border-white/10 pt-4 text-xs text-sidebar-foreground/55">
          <span>Powered by:</span>
          <WebxLogo width={52} height={16} />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
