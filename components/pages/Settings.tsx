"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Settings,
  Users,
  Palette,
  Bell,
  Plug,
  Shield,
  Save,
  Plus,
  Trash2,
  X,
  Search,
  MoreHorizontal,
  User,
  Mail,
  ShieldCheck,
  Clock,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUsersStore } from "@/store/useUsersStore";
import AddMemberModal from "../sections/AddMemberModal";
import { useAuthStore } from "@/store/useAuthStore";

const CONTENT_BRAND = "#430062";

/* ───────── STATUS CONFIG ───────── */
const STATUS_CONFIG = {
  active: {
    label: "Active",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  deactivated: {
    label: "Deactivated",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500",
  },
} as const;

const ROLE_CONFIG: Record<string, { label: string; color: string }> = {
  admin: { label: "Admin", color: "#430062" },
  "marketing lead": { label: "Marketing Lead", color: "#7c3aed" },
  creative: { label: "Creative", color: "#0ea5e9" },
  "client view": { label: "Client View", color: "#71717a" },
};

/* ───────── SIDEBAR ITEMS ───────── */
const sidebarItems = [
  { id: "users", label: "Team Members", icon: Users },
];

/* ───────── MAIN COMPONENT ───────── */
export default function SettingsModule() {
  const [activeTab, setActiveTab] = useState("users");
  const [workspaceName, setWorkspaceName] = useState("AMOS Agency");
  const [brandColor, setBrandColor] = useState(CONTENT_BRAND);
  const [notificationSettings, setNotificationSettings] = useState({
    approvals: true,
    campaigns: true,
    mentions: true,
    weeklyReport: true,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  const { users, fetchUsers, loading } = useUsersStore();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  /* ───────── FILTERING ───────── */
  const filteredUsers = useMemo(() => {
    const searchValue = String(searchTerm ?? "").toLowerCase().trim();
    return users.filter((u) => {
      const name = String(u?.fullname ?? "").toLowerCase();
      const email = String(u?.email ?? "").toLowerCase();
      return !searchValue || name.includes(searchValue) || email.includes(searchValue);
    });
  }, [users, searchTerm]);

  const counts = useMemo(() => {
    return {
      total: users.length,
      active: users.filter((u) => u.status === "active").length,
      deactivated: users.filter((u) => u.status === "deactivated").length,
    };
  }, [users]);

  /* ───────── HELPERS ───────── */
  const getStatusBadge = (status: keyof typeof STATUS_CONFIG) => {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.active;
    return (
      <Badge
        variant="outline"
        className={`${cfg.bg} ${cfg.text} ${cfg.border} text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5`}
      >
        <span className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
        {cfg.label}
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const cfg = ROLE_CONFIG[role.toLowerCase()] || { label: role, color: "#71717a" };
    return (
      <Badge
        variant="outline"
        className="text-[11px] font-medium capitalize"
        style={{ borderColor: `${cfg.color}30`, color: cfg.color, backgroundColor: `${cfg.color}10` }}
      >
        {cfg.label}
      </Badge>
    );
  };

  const getInitials = (name?: string | null): string => {
    if (!name) return "U";
    return name
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  /* ───────── HANDLERS ───────── */
  const handleAddMember = async (member: {
    name: string;
    email: string;
    role: string;
    password: string;
  }) => {
    try {
      const response = await fetch("/api/auth/register-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: member.name,
          email: member.email,
          role: member.role,
          password: member.password,
          actor: user?.fullname || "Admin",
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.error || "Failed to create user");
        return;
      }

      fetchUsers({ force: true });
      alert("Member added successfully!");
      setIsAddMemberOpen(false);
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  const handleDeactivateUser = async (id: string) => {
    try {
      const response = await fetch("/api/accounts/deactivate-user", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, actor: user?.fullname || "Admin" }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.error || "Failed to deactivate user");
        return;
      }

      fetchUsers({ force: true });
      alert("User deactivated successfully");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  /* ───────── RENDER ───────── */
  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      {/* ═══════ MAIN LAYOUT: SIDEBAR + CONTENT ═══════ */}
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        {/* Sidebar */}
        <div className="lg:w-64 lg:shrink-0">
          <div className="sticky top-6 space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition-all ${
                    isActive
                      ? "bg-[#430062]/10 font-medium text-[#430062] shadow-sm"
                      : "text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-900"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="min-w-0 flex-1">
          {activeTab === "users" && (
            <div className="space-y-6">
              {/* KPI Strip */}
              <div className="grid grid-cols-3 gap-4 sm:gap-6">
                {([
                  { label: "Total Members", count: counts.total, icon: Users, color: "#430062" },
                  { label: "Active", count: counts.active, icon: ShieldCheck, color: "#10b981" },
                  { label: "Deactivated", count: counts.deactivated, icon: AlertCircle, color: "#ef4444" },
                ] as const).map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-zinc-200/80 bg-white/90 p-4 shadow-sm ring-1 ring-black/[0.03] sm:p-5"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${stat.color}15` }}
                      >
                        <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
                      </div>
                      <span className="text-xs font-medium text-zinc-600 sm:text-sm">{stat.label}</span>
                    </div>
                    <div className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 tabular-nums sm:text-3xl">
                      {stat.count}
                    </div>
                  </div>
                ))}
              </div>

              {/* Table Container */}
              <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm ring-1 ring-black/[0.03]">
                <div className="flex flex-col gap-3 border-b border-zinc-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
                  <div>
                    <h2 className="text-base font-semibold text-zinc-900 sm:text-lg">Team Members</h2>
                    <p className="text-sm text-zinc-500">Manage who has access to this workspace</p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative sm:w-56">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 shrink-0 text-zinc-400" />
                      <Input
                        placeholder="Search members..."
                        className="h-10 w-full rounded-xl border-zinc-200/80 bg-zinc-50/50 pl-10 shadow-sm focus-visible:ring-[#430062]/15 text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button
                      className="h-10 w-full rounded-xl bg-[#430062] text-white shadow-md shadow-[#430062]/20 hover:bg-[#5a0080] sm:w-auto"
                      onClick={() => setIsAddMemberOpen(true)}
                    >
                      <Plus className="mr-2 h-4 w-4 shrink-0" />
                      Add Member
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-zinc-100 bg-zinc-50 hover:bg-zinc-50">
                        <TableHead className="py-3 px-3 sm:py-4 sm:px-6 text-xs sm:text-sm font-medium text-zinc-500 whitespace-nowrap">
                          Member
                        </TableHead>
                        <TableHead className="py-3 px-3 sm:py-4 sm:px-6 text-xs sm:text-sm font-medium text-zinc-500 whitespace-nowrap">
                          Role
                        </TableHead>
                        <TableHead className="py-3 px-3 sm:py-4 sm:px-6 text-xs sm:text-sm font-medium text-zinc-500 whitespace-nowrap">
                          Status
                        </TableHead>
                        <TableHead className="w-10 sm:w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((u) => (
                        <TableRow
                          key={u.id}
                          className="border-b border-zinc-100 transition-colors hover:bg-zinc-50"
                        >
                          <TableCell className="py-3 px-3 sm:py-5 sm:px-6">
                            <div className="flex items-center gap-3 sm:gap-4">
                              <Avatar className="h-9 w-9 shrink-0 border shadow-sm sm:h-10 sm:w-10">
                                <AvatarFallback className="bg-zinc-100 text-[10px] font-semibold text-zinc-600">
                                  {getInitials(u.fullname)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <div className="text-sm font-medium text-zinc-900 sm:text-base truncate">
                                  {u.fullname}
                                </div>
                                <div className="text-[11px] text-zinc-500 sm:text-xs truncate">
                                  {u.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-3 px-3 sm:py-5 sm:px-6">
                            {getRoleBadge(u.role)}
                          </TableCell>
                          <TableCell className="py-3 px-3 sm:py-5 sm:px-6">
                            {getStatusBadge(u.status as keyof typeof STATUS_CONFIG)}
                          </TableCell>
                          <TableCell className="py-3 px-3 sm:py-5 sm:px-6">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full text-zinc-400 hover:bg-red-50 hover:text-red-600"
                              onClick={() => handleDeactivateUser(u.id)}
                              aria-label="Deactivate user"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {filteredUsers.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100">
                      <Users className="h-8 w-8 text-zinc-300" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-zinc-800">No members found</h3>
                    <p className="mt-1 text-sm text-zinc-400">Try adjusting your search</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Placeholder for other tabs - styled consistently */}
          {activeTab !== "users" && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-200/80 bg-white/90 py-24 shadow-sm ring-1 ring-black/[0.03]">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100">
                <Settings className="h-8 w-8 text-zinc-300" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-zinc-800">Coming Soon</h3>
              <p className="mt-1 text-sm text-zinc-400">This section is under development</p>
            </div>
          )}
        </div>
      </div>

      {/* ═══════ ADD MEMBER MODAL ═══════ */}
      <AddMemberModal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        onAdd={handleAddMember}
        brandColor={CONTENT_BRAND}
      />
    </div>
  );
}