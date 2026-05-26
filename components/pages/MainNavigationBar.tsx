"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  CheckCircle2,
  Image as ImageIcon,
  BarChart3,
  PieChart,
  Users,
  Settings,
  Menu,
  Bell,
  ChevronLeft,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import ChangePasswordModal from "@/components/sections/ChangePasswordModal";
import { Separator } from "@/components/ui/separator";
import { useUsersStore } from "@/store/useUsersStore";
import { useContentStore } from "@/store/useContentStore";
import { useClientStore } from "@/store/clientStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

import GlobalHeader from "./Header";

const brandColor = "#430062";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
}

const mainNav: NavItem[] = [
  // {
  //   label: "Overview",
  //   icon: <LayoutDashboard className="h-5 w-5" />,
  //   href: "/dashboard",
  // },
  {
    label: "Content",
    icon: <FileText className="h-5 w-5" />,
    href: "/content",
  },
  {
    label: "Approvals",
    icon: <CheckCircle2 className="h-5 w-5" />,
    href: "/approvals",
    //badge: 7,
  },
  // {
  //   label: "Media Library",
  //   icon: <ImageIcon className="h-5 w-5" />,
  //   href: "/media",
  // },
  // {
  //   label: "Analytics",
  //   icon: <BarChart3 className="h-5 w-5" />,
  //   href: "/analytics",
  // },
  // {
  //   label: "Reports",
  //   icon: <PieChart className="h-5 w-5" />,
  //   href: "/reports",
  // },
];

const managementNav: NavItem[] = [
  {
    label: "Clients",
    icon: <Users className="h-5 w-5" />,
    href: "/clients",
  },
  {
    label: "Settings",
    icon: <Settings className="h-5 w-5" />,
    href: "/settings",
  },
];

export default function AMOSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAuthStore((state) => state.user);
  const role = user?.role || "";

  const pathname = usePathname();

  const userDisplay = {
    name:
      role === "client"
        ? user?.primary_contact_name
        : user?.fullname || "Unknown User",

    avatar: role === "client" ? user?.company_logo || "" : "", // admins have no image

    roleLabel: role === "client" ? user?.company_name || "Client" : "Admin",
  };

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  useEffect(() => {
    if (user?.first_login) {
      setIsChangePasswordOpen(true);
    }
  }, [user?.first_login]);

  const logout = useUsersStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

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
    <div className="h-[100dvh] overflow-hidden bg-zinc-50">
      <div className="flex h-full">
        {/* =========================================
            DESKTOP SIDEBAR
        ========================================= */}
        <aside
          className={`
            hidden lg:flex
            relative
            flex-col
            border-r border-zinc-200
            bg-white
            transition-all duration-300
            shrink-0
            ${isCollapsed ? "w-20" : "w-72"}
          `}
        >
          {/* Brand */}
          <div className="h-16 shrink-0 border-b border-zinc-200 flex items-center px-6">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="h-9 w-9 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shrink-0"
                style={{ backgroundColor: brandColor }}
              >
                A
              </div>

              {!isCollapsed && (
                <div className="min-w-0">
                  <div className="font-semibold text-xl tracking-tight truncate">
                    AMOS
                  </div>

                  <div className="text-xs text-zinc-500 -mt-1 truncate">
                    Marketing OS
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Scroll Area */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="py-8 px-3 space-y-8">
              {/* Operations */}
              <div>
                {!isCollapsed && (
                  <div className="px-3 mb-3 text-xs font-semibold tracking-wide text-zinc-500">
                    OPERATIONS
                  </div>
                )}

                <nav className="space-y-1">
                  {mainNav.map((item) => {
                    const active = pathname === item.href;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`
                          group
                          flex items-center gap-3
                          rounded-2xl
                          px-4 py-3
                          transition-all
                          min-w-0
                          ${
                            active
                              ? "bg-zinc-100 text-zinc-950 font-medium"
                              : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                          }
                        `}
                      >
                        <div className="shrink-0">{item.icon}</div>

                        {!isCollapsed && (
                          <span className="truncate">{item.label}</span>
                        )}

                        {item.badge && !isCollapsed && (
                          <Badge className="ml-auto bg-rose-100 text-rose-700 hover:bg-rose-100 shrink-0">
                            {item.badge}
                          </Badge>
                        )}

                        {item.badge && isCollapsed && (
                          <div className="ml-auto h-5 w-5 rounded-full bg-rose-500 text-white text-[10px] font-medium flex items-center justify-center shrink-0">
                            {item.badge}
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Management */}
              {role === "admin" && (
                <>
                  <Separator />
                  <div>
                    {!isCollapsed && (
                      <div className="px-3 mb-3 text-xs font-semibold tracking-wide text-zinc-500">
                        MANAGEMENT
                      </div>
                    )}

                    <nav className="space-y-1">
                      {managementNav.map((item) => {
                        const active = pathname === item.href;

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`
                          group
                          flex items-center gap-3
                          rounded-2xl
                          px-4 py-3
                          transition-all
                          min-w-0
                          ${
                            active
                              ? "bg-zinc-100 text-zinc-950 font-medium"
                              : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                          }
                        `}
                          >
                            <div className="shrink-0">{item.icon}</div>

                            {!isCollapsed && (
                              <span className="truncate">{item.label}</span>
                            )}
                          </Link>
                        );
                      })}
                    </nav>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Footer */}
          {/* <div className="shrink-0 border-t border-zinc-200 p-4">
            <div className="flex items-center gap-3 rounded-2xl p-2 hover:bg-zinc-100 transition-colors cursor-pointer min-w-0">
              <Avatar className="h-9 w-9 border border-zinc-100 shrink-0">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>AR</AvatarFallback>
              </Avatar>

              {!isCollapsed && (
                <>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      Alex Rivera
                    </div>

                    <div className="text-xs text-emerald-600 truncate">
                      Admin • Marketing
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                  >
                    <LogOut className="h-4 w-4 text-zinc-400" />
                  </Button>
                </>
              )}
            </div>
          </div> */}

          {/* Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="
              absolute
              -right-3
              top-20
              hidden lg:flex
              h-7 w-7
              items-center justify-center
              rounded-full
              border border-zinc-200
              bg-white
              shadow-sm
              transition-all
              hover:shadow-md
            "
          >
            <ChevronLeft
              className={`h-4 w-4 transition-transform ${
                isCollapsed ? "rotate-180" : ""
              }`}
            />
          </button>
        </aside>

        {/* =========================================
            MAIN APPLICATION AREA
        ========================================= */}
        <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
          {/* =========================================
              MOBILE HEADER
          ========================================= */}
          <header
            className="
              lg:hidden
              fixed top-0 left-0 right-0 z-50
              h-16
              border-b border-zinc-200
              bg-white/95
              backdrop-blur
            "
          >
            <div className="flex h-full items-center px-6">
              <div className="flex items-center gap-3">
                <div
                  className="h-8 w-8 rounded-xl flex items-center justify-center text-white font-bold text-xl"
                  style={{ backgroundColor: brandColor }}
                >
                  A
                </div>

                <span className="font-semibold tracking-tight">AMOS</span>
              </div>

              <div className="ml-auto flex items-center gap-2">
                {/* <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button> */}

                <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>

                  <SheetContent side="left" className="w-72 p-0">
                    <div className="flex h-full flex-col bg-white">
                      <div className="shrink-0 p-6 border-b border-zinc-100">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-9 w-9 rounded-2xl flex items-center justify-center text-white font-bold text-2xl"
                            style={{ backgroundColor: brandColor }}
                          >
                            A
                          </div>

                          <div>
                            <div className="font-semibold text-xl">AMOS</div>

                            <div className="text-xs text-zinc-500">
                              Marketing OS
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
                        <nav className="space-y-1">
                          {[
                            ...mainNav,
                            ...(role === "client" ? [] : managementNav),
                          ].map((item) => {
                            const active = pathname === item.href;

                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileOpen(false)}
                                className={`
            flex items-center gap-3
            rounded-2xl
            px-4 py-3
            transition-all
            ${active ? "bg-zinc-100 font-medium" : "hover:bg-zinc-100"}
          `}
                              >
                                {item.icon}
                                <span>{item.label}</span>
                                {item.badge && (
                                  <Badge className="ml-auto">
                                    {item.badge}
                                  </Badge>
                                )}
                              </Link>
                            );
                          })}
                        </nav>
                      </div>
                    </div>
                    <SheetFooter>
                      {/* Footer */}
                      <div className="shrink-0 border-t border-zinc-200 p-4">
                        <div className="flex items-center gap-3 rounded-2xl p-2 hover:bg-zinc-100 transition-colors cursor-pointer min-w-0">
                          <Avatar className="h-9 w-9 border border-zinc-100 shrink-0">
                            {userDisplay.avatar && (
                              <AvatarImage src={userDisplay.avatar} />
                            )}

                            <AvatarFallback>
                              {userDisplay.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>

                          {!isCollapsed && (
                            <>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">
                                  {userDisplay.name}
                                </div>

                                <div className="text-xs text-emerald-600 truncate">
                                  {userDisplay.roleLabel}
                                </div>
                              </div>

                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 shrink-0"
                                onClick={handleLogout}
                              >
                                <LogOut className="h-4 w-4 text-zinc-400" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </header>

          {/* =========================================
              MAIN SCROLL CONTAINER
          ========================================= */}
          <main
            className="
              flex-1
              overflow-y-auto
              overflow-x-hidden
              min-w-0
              pt-16 lg:pt-0
            "
          >
            <GlobalHeader />

            <div className="min-h-full">{children}</div>
          </main>
        </div>
      </div>
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        userId={user?.id} // Required: pass the user's ID
        userEmail={user?.email}
      />
    </div>
  );
}
