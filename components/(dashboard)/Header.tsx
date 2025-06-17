// components/(dashboard)/Header.tsx
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Search, UserCircle } from "lucide-react"; // Added icons for a polished look
import Link from 'next/link';
import { Input } from "../ui/input";

// The navigation links for the mobile sidebar (Sheet)
const mobileNavLinks = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Users", href: "/dashboard/users" },
  { name: "Leads", href: "/dashboard/leads" },
  { name: "Contacts", href: "/dashboard/contacts" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-white px-6">
      
      {/* Mobile Navigation (Sheet component) */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 ml-5 text-lg font-medium">
            <Link href="#" className="flex items-center gap-2 text-lg font-semibold mb-4">
              GrowUp Inc.
            </Link>
            {mobileNavLinks.map(link => (
              <Link key={link.name} href={link.href} className="text-muted-foreground hover:text-foreground">
                {link.name}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Main Header Content */}
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        
        {/* Search Bar (optional, but looks professional) */}
        {/* <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form> */}

        {/* User Profile Dropdown (Placeholder) */}

      </div>
    </header>
  );
}