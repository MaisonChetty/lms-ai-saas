"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Layers,
  PlayCircle,
  Tag,
  LayoutDashboard,
  Code2,
  Menu,
  ExternalLink,
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import AdminLogOutButton from "./AdminLogOutButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/modules", label: "Modules", icon: Layers },
  { href: "/admin/lessons", label: "Lessons", icon: PlayCircle },
  { href: "/admin/categories", label: "Categories", icon: Tag },
];

function AdminHeader() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-xl transition-colors">
      <div className="flex h-14 items-center px-4 lg:px-6">
        {/* Logo */}
        <Link
          href="/admin"
          className="flex items-center gap-2.5 font-semibold lg:mr-8"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-br from-violet-500 to-fuchsia-600 shadow-lg shadow-violet-500/20">
            <Code2 className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg text-foreground hidden sm:inline">
            Admin
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  active
                    ? "bg-violet-500/20 text-violet-300"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/70",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/studio"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Open Studio
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="text-muted-foreground hover:text-foreground hover:bg-secondary/70"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          <AdminLogOutButton />
        </div>

        {/* Mobile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-secondary/70"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-card border-border"
          >
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href, item.exact);
              return (
                <DropdownMenuItem key={item.href} asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 cursor-pointer",
                      active
                        ? "text-violet-300 bg-violet-500/10"
                        : "text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem asChild>
              <Link
                href="/studio"
                className="flex items-center gap-2 cursor-pointer text-foreground"
              >
                <ExternalLink className="h-4 w-4" />
                Open Studio
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <div className="flex items-center justify-between px-2 py-2 gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                className="text-muted-foreground hover:text-foreground hover:bg-secondary/70"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
              <AdminLogOutButton />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default AdminHeader;
