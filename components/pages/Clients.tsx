"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Client, useClientStore } from "@/store/clientStore";
import {
  Search,
  Plus,
  MoreHorizontal,
  Users,
  Building2,
  X,
  Mail,
  Lock,
  Calendar,
  Shield,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import AddClientModal from "../sections/AddClientModal";
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
  onboarding: {
    label: "Onboarding",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  paused: {
    label: "Paused",
    bg: "bg-zinc-100",
    text: "text-zinc-600",
    border: "border-zinc-200",
    dot: "bg-zinc-400",
  },
} as const;

/* ───────── MAIN COMPONENT ───────── */
export default function Clients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const { clients, loading, fetchClients, addClient } = useClientStore();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  /* ───────── FILTERING ───────── */
  const filteredClients = useMemo(() => {
  const searchValue = String(searchTerm ?? "").toLowerCase().trim();
  const statusValue = String(statusFilter ?? "").toLowerCase().trim();

  return clients.filter((client) => {
    const company = String(client?.company_name ?? "").toLowerCase();
    const industry = String(client?.industry ?? "").toLowerCase();
    const status = String(client?.status ?? "").toLowerCase();
    const clientName = String(client?.primary_contact_name ?? "").toLowerCase();
    const email = String(client?.email ?? "").toLowerCase();

    const matchesSearch =
      !searchValue ||
      company.includes(searchValue) ||
      industry.includes(searchValue) ||
      clientName.includes(searchValue) ||   // ✅ added
      email.includes(searchValue);          // (optional but useful)

    const matchesStatus =
      statusValue === "all" || status === statusValue;

    return matchesSearch && matchesStatus;
  });
}, [clients, searchTerm, statusFilter]);

  const counts = useMemo(() => {
    return {
      total: clients.length,
      active: clients.filter((c) => c.status === "active").length,
      onboarding: clients.filter((c) => c.status === "onboarding").length,
      paused: clients.filter((c) => c.status === "paused").length,
    };
  }, [clients]);

  /* ───────── HELPERS ───────── */
  const getStatusBadge = (status: keyof typeof STATUS_CONFIG) => {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.paused;
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

  const getInitials = (name?: string | null): string => {
    if (!name) return "CL";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateStr?: string | null): string => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return String(dateStr);
    }
  };

  /* ───────── HANDLERS ───────── */
  const handleUpdatePassword = async () => {
    if (!selectedClient) return;
    if (!newPassword || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setIsUpdatingPassword(true);
      const res = await fetch("/api/accounts/update-password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedClient.id,
          newPassword,
          confirmPassword,
          actor: user?.fullname || "Admin",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to update password");
        return;
      }

      alert("Password updated successfully");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  /* ───────── RENDER ───────── */
  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      {/* ═══════ HEADER ═══════ */}
      <div className="rounded-2xl border border-zinc-200/80 bg-white/90 p-4 shadow-sm ring-1 ring-black/[0.03] backdrop-blur-sm sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64 md:w-182">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 shrink-0 text-zinc-400" />
              <Input
                placeholder="Search clients..."
                className="h-10 w-full rounded-xl border-zinc-200/80 bg-zinc-50/50 pl-10 shadow-sm focus-visible:ring-[#430062]/15"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-10 w-full rounded-xl border-zinc-200/80 bg-white sm:w-44">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="onboarding">Onboarding</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
              </SelectContent>
            </Select>

            <Button
              className="h-10 w-full rounded-xl bg-[#430062] text-white shadow-md shadow-[#430062]/20 hover:bg-[#5a0080] sm:w-auto"
              onClick={() => setIsAddClientOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4 shrink-0" />
              New Client
            </Button>
          </div>
        </div>
      </div>

      {/* ═══════ KPI STRIP ═══════ */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
        {([
          { key: "total", label: "Total Clients", count: counts.total, icon: Building2, color: "#430062" },
          { key: "active", label: "Active", count: counts.active, icon: Shield, color: "#10b981" },
          { key: "onboarding", label: "Onboarding", count: counts.onboarding, icon: Calendar, color: "#f59e0b" },
          { key: "paused", label: "Paused", count: counts.paused, icon: Lock, color: "#71717a" },
        ] as const).map((stat) => (
          <div
            key={stat.key}
            className="rounded-2xl border border-zinc-200/80 bg-white/90 p-4 shadow-sm ring-1 ring-black/[0.03] sm:p-5"
          >
            <div className="flex items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
              </div>
              <span className="text-sm font-medium text-zinc-600">{stat.label}</span>
            </div>
            <div className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 tabular-nums sm:text-4xl">
              {stat.count}
            </div>
          </div>
        ))}
      </div>

      {/* ═══════ CLIENTS TABLE ═══════ */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm ring-1 ring-black/[0.03]">
        <div className="border-b border-zinc-100 px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-zinc-900 sm:text-lg">All Clients</h2>
              <p className="text-sm text-zinc-500">Manage workspaces and performance</p>
            </div>
            <Badge variant="secondary" className="text-xs bg-zinc-100 text-zinc-600">
              {filteredClients.length} result{filteredClients.length !== 1 ? "s" : ""}
            </Badge>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-zinc-100 bg-zinc-50 hover:bg-zinc-50">
                <TableHead className="py-3 px-3 sm:py-4 sm:px-6 text-xs sm:text-sm font-medium text-zinc-500 whitespace-nowrap">
                  Client
                </TableHead>
                <TableHead className="py-3 px-3 sm:py-4 sm:px-6 text-xs sm:text-sm font-medium text-zinc-500 whitespace-nowrap">
                  Company
                </TableHead>
                <TableHead className="py-3 px-3 sm:py-4 sm:px-6 text-xs sm:text-sm font-medium text-zinc-500 whitespace-nowrap">
                  Industry
                </TableHead>
                <TableHead className="py-3 px-3 sm:py-4 sm:px-6 text-xs sm:text-sm font-medium text-zinc-500 whitespace-nowrap">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow
                  key={client.id}
                  className="cursor-pointer border-b border-zinc-100 transition-colors hover:bg-zinc-50"
                  onClick={() => setSelectedClient(client)}
                >
                  <TableCell className="py-3 px-3 sm:py-5 sm:px-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <Avatar className="h-9 w-9 shrink-0 border shadow-sm sm:h-10 sm:w-10">
                        <AvatarImage src={client.company_logo} />
                        <AvatarFallback className="bg-zinc-100 text-[10px] font-semibold text-zinc-600">
                          {getInitials(client.primary_contact_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-zinc-900 sm:text-base truncate">
                          {client.primary_contact_name}
                        </div>
                        <div className="text-[11px] text-zinc-500 sm:text-xs">
                          Since {formatDate(client.created_at)}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 px-3 sm:py-5 sm:px-6">
                    <div className="text-sm font-medium text-zinc-900">{client.company_name}</div>
                  </TableCell>
                  <TableCell className="py-3 px-3 sm:py-5 sm:px-6">
                    <div className="text-xs text-zinc-600 sm:text-sm">{client.industry}</div>
                  </TableCell>
                  <TableCell className="py-3 px-3 sm:py-5 sm:px-6">
                    {getStatusBadge(client.status as keyof typeof STATUS_CONFIG)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredClients.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100">
              <Building2 className="h-8 w-8 text-zinc-300" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-zinc-800">No clients found</h3>
            <p className="mt-1 text-sm text-zinc-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* ═══════ CLIENT DETAIL DIALOG ═══════ */}
      <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
        <DialogContent
          className="flex h-[100dvh] w-full max-w-[95vw] flex-col overflow-hidden rounded-2xl border-zinc-200/80 p-0 shadow-2xl sm:h-[94vh] sm:max-w-[90vw] md:max-w-xl lg:max-w-2xl"
          showCloseButton={false}
        >
          {selectedClient && (
            <div className="flex h-full min-h-0 flex-col">
              {/* Header */}
              <DialogHeader className="relative z-10 shrink-0 border-b border-zinc-200/80 bg-gradient-to-b from-[#430062]/[0.06] to-white px-4 pb-4 pt-5 sm:px-6 sm:pb-5 sm:pt-6">
                <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#430062] via-[#6b1a8f] to-[#a855f7]" />
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <Avatar className="h-12 w-12 shrink-0 border-2 border-white shadow-md sm:h-14 sm:w-14">
                      <AvatarImage src={selectedClient.company_logo} />
                      <AvatarFallback className="bg-zinc-100 text-lg font-semibold text-zinc-600 sm:text-xl">
                        {getInitials(selectedClient.company_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <DialogTitle className="text-xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-2xl">
                        {selectedClient.company_name}
                      </DialogTitle>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        {getStatusBadge(selectedClient.status as keyof typeof STATUS_CONFIG)}
                        <span className="text-xs text-zinc-500">{selectedClient.industry}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 sm:h-9 sm:w-9"
                    onClick={() => setSelectedClient(null)}
                  >
                    <X className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </div>
              </DialogHeader>

              {/* Tabs */}
              <Tabs defaultValue="profile" className="flex min-h-0 flex-1 flex-col">
                <div className="shrink-0 border-b border-zinc-100 px-4 pt-4 sm:px-6 sm:pt-5">
                  <TabsList className="flex h-auto w-full gap-1 rounded-xl border border-zinc-200/80 bg-white/90 p-1 shadow-sm ring-1 ring-black/[0.03] md:w-fit">
                    <TabsTrigger
                      value="profile"
                      className="flex-1 justify-center rounded-lg px-4 py-2 text-xs data-[state=active]:bg-[#430062]/10 data-[state=active]:text-[#430062] data-[state=active]:shadow-sm sm:flex-none sm:px-5 sm:text-sm"
                    >
                      <Building2 className="mr-1.5 h-3.5 w-3.5 flex-shrink-0 sm:mr-2 sm:h-4 sm:w-4" />
                      Profile
                    </TabsTrigger>
                    <TabsTrigger
                      value="account"
                      className="flex-1 justify-center rounded-lg px-4 py-2 text-xs data-[state=active]:bg-[#430062]/10 data-[state=active]:text-[#430062] data-[state=active]:shadow-sm sm:flex-none sm:px-5 sm:text-sm"
                    >
                      <Shield className="mr-1.5 h-3.5 w-3.5 flex-shrink-0 sm:mr-2 sm:h-4 sm:w-4" />
                      Account
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Profile Tab */}
                <TabsContent
                  value="profile"
                  className="mt-0 min-h-0 flex-1 overflow-y-auto overscroll-y-contain bg-zinc-50/40 px-4 pb-4 pt-4 sm:px-6 sm:pb-8 sm:pt-6"
                >
                  <div className="space-y-6 sm:space-y-8">
                    <section>
                      <h4 className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-400 sm:mb-4">
                        Company Information
                      </h4>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                        {[
                          { label: "Company Name", value: selectedClient.company_name, icon: Building2 },
                          { label: "Industry", value: selectedClient.industry, icon: Building2 },
                          { label: "Primary Contact", value: selectedClient.primary_contact_name, icon: Users },
                          { label: "Member Since", value: formatDate(selectedClient.created_at), icon: Calendar },
                        ].map((field) => (
                          <div
                            key={field.label}
                            className="space-y-1.5 rounded-xl border border-zinc-200/80 bg-white p-4 shadow-sm ring-1 ring-black/[0.02] sm:space-y-2"
                          >
                            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                              <field.icon className="h-3 w-3" />
                              {field.label}
                            </div>
                            <p className="text-sm font-medium text-zinc-900 sm:text-base">
                              {field.value || "—"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section>
                      <h4 className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-400 sm:mb-4">
                        Contact Details
                      </h4>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                        <div className="space-y-1.5 rounded-xl border border-zinc-200/80 bg-white p-4 shadow-sm ring-1 ring-black/[0.02] sm:space-y-2">
                          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                            <Mail className="h-3 w-3" />
                            Email Address
                          </div>
                          <p className="text-sm font-medium text-zinc-900 sm:text-base">
                            {selectedClient.email || "—"}
                          </p>
                        </div>
                        <div className="space-y-1.5 rounded-xl border border-zinc-200/80 bg-white p-4 shadow-sm ring-1 ring-black/[0.02] sm:space-y-2">
                          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                            <Shield className="h-3 w-3" />
                            Account Status
                          </div>
                          <div className="mt-1">
                            {getStatusBadge(selectedClient.status as keyof typeof STATUS_CONFIG)}
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </TabsContent>

                {/* Account Tab */}
                <TabsContent
                  value="account"
                  className="mt-0 min-h-0 flex-1 overflow-y-auto overscroll-y-contain bg-zinc-50/40 px-4 pb-4 pt-4 sm:px-6 sm:pb-8 sm:pt-6"
                >
                  <div className="mx-auto max-w-lg space-y-6 sm:space-y-8">
                    {/* Email Section */}
                    <div className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm ring-1 ring-black/[0.02] sm:p-6">
                      <h4 className="mb-1 text-sm font-semibold text-zinc-900">Email Address</h4>
                      <p className="mb-4 text-xs text-zinc-500">Contact support to change email</p>
                      <Input
                        value={selectedClient.email || "admin@company.com"}
                        className="h-10 rounded-xl border-zinc-200/80 bg-zinc-50/50 text-sm shadow-sm"
                        disabled
                      />
                    </div>

                    {/* Password Section */}
                    <div className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm ring-1 ring-black/[0.02] sm:p-6">
                      <h4 className="mb-1 text-sm font-semibold text-zinc-900">Change Password</h4>
                      <p className="mb-5 text-xs text-zinc-500">Update login credentials for this client</p>

                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-zinc-600">New Password</label>
                          <Input
                            type="password"
                            placeholder="Enter new password"
                            className="h-10 rounded-xl border-zinc-200/80 bg-zinc-50/50 text-sm shadow-sm focus-visible:ring-[#430062]/15"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-zinc-600">Confirm New Password</label>
                          <Input
                            type="password"
                            placeholder="Confirm new password"
                            className="h-10 rounded-xl border-zinc-200/80 bg-zinc-50/50 text-sm shadow-sm focus-visible:ring-[#430062]/15"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                        </div>

                        <Button
                          onClick={handleUpdatePassword}
                          disabled={isUpdatingPassword}
                          className="h-11 w-full rounded-xl bg-[#430062] text-sm font-semibold text-white shadow-md shadow-[#430062]/20 transition-all hover:bg-[#5a0080] active:scale-[0.99] sm:h-12"
                        >
                          {isUpdatingPassword ? "Updating..." : "Update Password"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Footer */}
              <div className="z-10 shrink-0 border-t border-zinc-200/80 bg-white/95 p-4 backdrop-blur-sm sm:p-6">
                <Button
                  variant="outline"
                  onClick={() => setSelectedClient(null)}
                  className="h-11 w-full rounded-xl border-zinc-200/80 text-sm font-medium hover:bg-zinc-50 hover:border-zinc-300 sm:w-auto sm:px-8"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ═══════ ADD CLIENT MODAL ═══════ */}
      <AddClientModal
        isOpen={isAddClientOpen}
        onClose={() => setIsAddClientOpen(false)}
        onAdd={async (client) => {
          try {
            const formData = new FormData();
            formData.append("company_name", client.company_name);
            formData.append("industry", client.industry);
            formData.append("primary_contact_name", client.primary_contact_name);
            formData.append("email", client.email);
            formData.append("password", client.password);
            if (client.logoFile) {
              formData.append("company_logo", client.logoFile);
            }
            formData.append("actor", user?.fullname?.toString() || "Admin");

            const res = await fetch("/api/auth/register-client", {
              method: "POST",
              body: formData,
            });

            const data = await res.json();
            if (!res.ok) {
              alert(data.error || "Failed to create client");
              return;
            }

            const createdClient = data.client[0];
            addClient({
              id: createdClient.id,
              created_at: createdClient.created_at,
              company_logo: createdClient.company_logo,
              company_name: createdClient.company_name,
              industry: createdClient.industry,
              primary_contact_name: createdClient.primary_contact_name,
              role: "client",
              email: createdClient.email,
              status: createdClient.status,
              first_login: createdClient.first_login,
            });

            setIsAddClientOpen(false);
          } catch (err) {
            console.error(err);
            alert("Something went wrong");
          }
        }}
      />
    </div>
  );
}