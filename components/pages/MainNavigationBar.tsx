"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FileText,
  CheckCircle2,
  Users,
  Settings,
  Menu,
  ChevronLeft,
  LogOut,
  ClipboardList,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ChangePasswordModal from "@/components/sections/ChangePasswordModal";
import { useUsersStore } from "@/store/useUsersStore";
import { useContentStore } from "@/store/useContentStore";
import { useClientStore } from "@/store/clientStore";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";

import GlobalHeader from "./Header";

const BRAND_LIGHT = "#c4b5fd";

interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string;
  badge?: number;
}

const mainNav: NavItem[] = [
  { label: "Content", icon: FileText, href: "/content" },
  { label: "Approvals", icon: CheckCircle2, href: "/approvals" },
];

const managementNav: NavItem[] = [
  { label: "Clients", icon: Users, href: "/clients" },
  { label: "Logs", icon: ClipboardList, href: "/logs" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

function isNavActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function BrandMark({
  collapsed,
  variant = "sidebar",
}: {
  collapsed?: boolean;
  variant?: "sidebar" | "light";
}) {
  const isSidebar = variant === "sidebar";

  return (
    <div className="flex min-w-0 items-center gap-3">
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
          isSidebar
            ? "bg-white/10 ring-1 ring-white/15"
            : "bg-[#430062]/8 ring-1 ring-[#430062]/15",
        )}
      >
        <Avatar className="h-7 w-7 rounded-lg border-0 bg-transparent">
          <AvatarImage
            src="/logos/axis_logo.png"
            alt="Axis"
            className="object-contain"
          />
          <AvatarFallback
            className={cn(
              "rounded-lg text-xs",
              isSidebar ? "bg-[#430062] text-white" : "bg-[#430062] text-white",
            )}
          >
            A
          </AvatarFallback>
        </Avatar>
      </div>
      {!collapsed && (
        <div className="min-w-0">
          <p
            className={cn(
              "truncate text-[15px] font-semibold leading-tight tracking-tight",
              isSidebar ? "text-white" : "text-zinc-900",
            )}
          >
            <span style={{ color: isSidebar ? BRAND_LIGHT : "#430062" }}>
              Axis
            </span>{" "}
            <span className={isSidebar ? "text-white/95" : "text-zinc-900"}>
              Command
            </span>
          </p>
          <p
            className={cn(
              "truncate text-[11px] font-medium",
              isSidebar ? "text-zinc-500" : "text-zinc-500",
            )}
          >
            Marketing OS
          </p>
        </div>
      )}
    </div>
  );
}

function NavLink({
  item,
  active,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      className={cn(
        "group relative flex min-w-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
        active
          ? "bg-white/10 font-medium text-white shadow-sm ring-1 ring-white/10"
          : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100",
        collapsed && "justify-center px-2",
      )}
    >
      {active && (
        <span
          className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full"
          style={{ backgroundColor: BRAND_LIGHT }}
        />
      )}
      <Icon
        className={cn(
          "h-[18px] w-[18px] shrink-0 transition-colors",
          active ? "text-[#c4b5fd]" : "text-zinc-500 group-hover:text-zinc-300",
        )}
      />
      {!collapsed && (
        <>
          <span className="truncate">{item.label}</span>
          {item.badge != null && (
            <Badge className="ml-auto shrink-0 border-0 bg-rose-500/20 text-[11px] text-rose-200 hover:bg-rose-500/20">
              {item.badge}
            </Badge>
          )}
        </>
      )}
      {collapsed && item.badge != null && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-semibold text-white">
          {item.badge > 9 ? "9+" : item.badge}
        </span>
      )}
    </Link>
  );
}

function NavSection({
  title,
  items,
  pathname,
  collapsed,
  onNavigate,
}: {
  title: string;
  items: NavItem[];
  pathname: string;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <div>
      {!collapsed && (
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          {title}
        </p>
      )}
      <nav className="space-y-0.5">
        {items.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={isNavActive(pathname, item.href)}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </nav>
    </div>
  );
}

function SidebarUser({
  collapsed,
  name,
  avatar,
  roleLabel,
  onLogout,
}: {
  collapsed?: boolean;
  name?: string | null;
  avatar: string;
  roleLabel: string;
  onLogout: () => void;
}) {
  const nameStr = typeof name === "string" ? name : "";
  const initials =
    nameStr
      .trim()
      .split(/\s+/)
      .map((w) => w[0] || "")
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-2",
        collapsed && "justify-center p-2",
      )}
    >
      <Avatar className="h-9 w-9 shrink-0 ring-2 ring-white/10">
        {avatar ? <AvatarImage src={avatar} alt="" /> : null}
        <AvatarFallback className="bg-[#430062] text-xs text-white">
          {initials}
        </AvatarFallback>
      </Avatar>
      {!collapsed && (
        <>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{nameStr}</p>
            <p className="truncate text-[11px] text-zinc-500">{roleLabel}</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-zinc-400 hover:bg-white/10 hover:text-white"
            onClick={onLogout}
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
}

function SidebarContent({
  collapsed,
  pathname,
  role,
  userDisplay,
  onNavigate,
  onLogout,
}: {
  collapsed?: boolean;
  pathname: string;
  role: string;
  userDisplay: { name?: string | null; avatar: string; roleLabel: string };
  onNavigate?: () => void;
  onLogout: () => void;
}) {
  return (
    <>
      <div className="flex h-[60px] shrink-0 items-center border-b border-white/10 px-4">
        <BrandMark collapsed={collapsed} />
      </div>
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-5">
        <div className="space-y-6">
          <NavSection
            title="Operations"
            items={mainNav}
            pathname={pathname}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
          {role === "admin" && (
            <>
              <div className="mx-3 border-t border-white/10" />
              <NavSection
                title="Management"
                items={managementNav}
                pathname={pathname}
                collapsed={collapsed}
                onNavigate={onNavigate}
              />
            </>
          )}
        </div>
      </div>
      <div className="shrink-0 border-t border-white/10 p-3">
        <SidebarUser
          collapsed={collapsed}
          name={userDisplay.name}
          avatar={userDisplay.avatar}
          roleLabel={userDisplay.roleLabel}
          onLogout={onLogout}
        />
      </div>
    </>
  );
}

export default function AMOSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAuthStore((state) => state.user);
  const role = user?.role || "";
  const pathname = usePathname();
  const router = useRouter();

  const userDisplay = {
  name:
    role === "client"
      ? typeof user?.primary_contact_name === "string"
        ? user.primary_contact_name
        : null
      : typeof user?.fullname === "string"
        ? user.fullname
        : "Unknown User",

  avatar:
    role === "client" && typeof user?.company_logo === "string"
      ? user.company_logo
      : "",

  roleLabel:
    role === "client" && typeof user?.company_name === "string"
      ? user.company_name
      : "Admin",
};

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  useEffect(() => {
  console.log("AMOSLayout User:", {
    id: user?.id,
    role,
    email: user?.email,
    first_login: user?.first_login,
    user,
  });
}, [user, role]);

  useEffect(() => {
    if (user?.first_login) {
      setIsChangePasswordOpen(true);
    }
  }, [user?.first_login]);

  const logout = useUsersStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });

      logout();
      useClientStore.getState().logout();
      useContentStore.getState().clearContents();
      useAuthStore.getState().clearUser();

      localStorage.removeItem("auth-storage");

      router.push("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="flex h-dvh max-h-dvh overflow-hidden overscroll-none bg-[#ebe9f0]">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "relative hidden shrink-0 flex-col border-r border-[#2a1038] bg-[#14061c] transition-[width] duration-300 ease-out lg:flex",
          isCollapsed ? "w-[72px]" : "w-[260px]",
        )}
      >
        <SidebarContent
          collapsed={isCollapsed}
          pathname={pathname}
          role={role}
          userDisplay={userDisplay}
          onLogout={handleLogout}
        />
        <button
          type="button"
          onClick={() => setIsCollapsed((c) => !c)}
          className="absolute -right-3 top-[72px] z-10 hidden h-7 w-7 items-center justify-center rounded-full border border-zinc-200/80 bg-white text-zinc-600 shadow-md transition hover:shadow-lg lg:flex"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform",
              isCollapsed && "rotate-180",
            )}
          />
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Mobile top bar */}
        <header className="fixed inset-x-0 top-0 z-50 flex h-14 items-center gap-3 border-b border-zinc-200/80 bg-white/90 px-4 backdrop-blur-md lg:hidden">
          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[280px] border-[#2a1038] bg-[#14061c] p-0 text-white"
            >
              <div className="flex h-full flex-col">
                <SidebarContent
                  pathname={pathname}
                  role={role}
                  userDisplay={userDisplay}
                  onNavigate={() => setIsMobileOpen(false)}
                  onLogout={handleLogout}
                />
              </div>
            </SheetContent>
          </Sheet>
          <BrandMark variant="light" />
        </header>

        <GlobalHeader />

        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain pt-14 lg:pt-0">
          {children}
        </main>
      </div>

      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        userId={user?.id || ""}
        userEmail={user?.email}
        userType={role}
      />
    </div>
  );
}
