"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Users,
  FileText,
  Contact,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  // { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { name: "Users", href: "/dashboard/users", icon: Users },
  { name: "Leads", href: "/dashboard/leads", icon: FileText },
  { name: "Contacts", href: "/dashboard/contacts", icon: Contact },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-col border-r bg-white lg:flex">
      {/* Sidebar Header */}
      <div className="flex flex-col items-center gap-2 border-b px-6 py-5">
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight text-slate-900"
        >
          Admin Dashboard
        </Link>
        <div className="h-1 w-2/3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600" />
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="grid items-start gap-1 px-4 text-sm font-medium">
          {navigation.map((item) => {
            // Check if the link is active.
            // A special check for the dashboard to prevent it from being active on all sub-routes.
            const isActive =
              item.href === "/dashboard"
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3 rounded-lg px-4 py-3 text-slate-600 transition-colors duration-200",
                  // Style for hovering over a NON-ACTIVE link
                  !isActive && "hover:bg-purple-500/10 hover:text-purple-600",
                  // Style for an ACTIVE link
                  isActive && "bg-white text-purple-600 font-semibold"
                )}
              >
                {/* Red indicator bar for active links */}
                {isActive && (
                  <div className="absolute left-0 h-6 w-1 rounded-r-full bg-purple-600" />
                )}

                <item.icon
                  className={cn("h-5 w-5", isActive && "text-purple-600")}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}