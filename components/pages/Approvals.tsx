"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Plus,
  X,
  FolderOpen,
  ExternalLink,
  Inbox,
  CheckCircle2,
  PartyPopper,
  FileText,
  Trash2,
  MoreHorizontal,
  Calendar,
  User,
  Layers,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import AddContentModal from "../sections/AddContentModal";
import RequestRevisionModal from "../sections/RequestRevisionModal";
import SubmitRevisionModal from "../sections/SubmitRevisionModal";
import ApproveConfirmDialog from "../sections/ApproveConfirmDialog";

import { useContentStore } from "@/store/useContentStore";
import { useAuthStore } from "@/store/useAuthStore";
import EditContentModal from "../sections/EditContentModal";
import { useClientStore } from "@/store/clientStore";
import { useUsersStore } from "@/store/useUsersStore";
import DeleteContentModal from "../sections/DeleteContentModal";

const CONTENT_BRAND = "#430062";

/* ───────── STATUS CONFIG ───────── */
const STATUS_CONFIG = {
  review: {
    label: "Pending Review",
    icon: Clock,
    color: "amber",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    ring: "ring-amber-500/20",
  },
  revise: {
    label: "Needs Revision",
    icon: AlertCircle,
    color: "rose",
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    ring: "ring-rose-500/20",
  },
  approved: {
    label: "Approved",
    icon: CheckCircle,
    color: "emerald",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    ring: "ring-emerald-500/20",
  },
  scheduled: {
    label: "Scheduled",
    icon: Calendar,
    color: "violet",
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
    ring: "ring-violet-500/20",
  },
  posted: {
    label: "Posted",
    icon: CheckCircle2,
    color: "zinc",
    bg: "bg-zinc-100",
    text: "text-zinc-600",
    border: "border-zinc-200",
    ring: "ring-zinc-500/20",
  },
} as const;

/* ───────── TYPES ───────── */
interface ApprovalItem {
  id: string;
  title: string;
  caption: string;
  platforms: string[];
  contentTypes: string[];
  status: "review" | "revise" | "approved" | "scheduled" | "posted";
  publishDate: string;
  client: string;
  assignedTo: string;
  driveLinks: string[];
  pillar: string;
  priority?: string | null;
  revisionDueDate?: string | null;
  revisionCount?: number;
  revisionNotes?: {
    commenter: string;
    comment: string;
    created_at: string;
  }[];
}

/* ───────── MAIN COMPONENT ───────── */
export default function ApprovalsModule() {
  const user = useAuthStore((state) => state.user);
  const role = user?.role || "";

  const { clients, fetchClients } = useClientStore();
  const { users, fetchUsers } = useUsersStore();

  /* Local State */
  const [activeTab, setActiveTab] = useState<"review" | "revise" | "approved">(
    "review",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [clientFilter, setClientFilter] = useState("all");
  const [selectedApproval, setSelectedApproval] = useState<ApprovalItem | null>(
    null,
  );

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddContentOpen, setIsAddContentOpen] = useState(false);
  const [isRevisionOpen, setIsRevisionOpen] = useState(false);
  const [isSubmitRevisionOpen, setIsSubmitRevisionOpen] = useState(false);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [contentToDelete, setContentToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  /* Store */
  const { contents, loading, error, fetchContents, addContent, updateStatus } =
    useContentStore();

  useEffect(() => {
    fetchContents();
    fetchClients();
    fetchUsers();
  }, [fetchContents, fetchClients, fetchUsers]);

  /* ───────── HELPERS ───────── */
  const clientLookup = useMemo(
    () => Object.fromEntries(clients.map((c) => [c.id, c.company_name])),
    [clients],
  );
  const userLookup = useMemo(
    () => Object.fromEntries(users.map((u) => [u.id, u.fullname])),
    [users],
  );

  /* ───────── FILTERING ───────── */
  const filteredApprovals = useMemo(() => {
    return contents.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.client.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesClient =
        clientFilter === "all" || item.client === clientFilter;
      const matchesTab = item.status === activeTab;
      return matchesSearch && matchesClient && matchesTab;
    });
  }, [contents, searchTerm, clientFilter, activeTab]);

  const uniqueClients = useMemo(
    () => [...new Set(contents.map((item) => item.client).filter(Boolean))],
    [contents],
  );

  const counts = useMemo(() => {
    const base =
      clientFilter === "all"
        ? contents
        : contents.filter((a) => a.client === clientFilter);
    return {
      review: base.filter((a) => a.status === "review").length,
      revise: base.filter((a) => a.status === "revise").length,
      approved: base.filter((a) => a.status === "approved").length,
    };
  }, [contents, clientFilter]);

  /* ───────── DATE UTILITIES ───────── */
  const formatDueDate = (dateStr?: string | null): string => {
    if (!dateStr) return "No due date";
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0)
      return `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? "s" : ""}`;
    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "Due tomorrow";
    if (diffDays <= 7) return `Due in ${diffDays} days`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const isOverdue = (dateStr?: string | null): boolean => {
    if (!dateStr) return false;
    const due = new Date(dateStr);
    due.setHours(23, 59, 59, 999);
    return due < new Date();
  };

  /* ───────── HANDLERS ───────── */
  const openDetail = (approval: ApprovalItem) => {
    setSelectedApproval(approval);
    setIsDetailOpen(true);
  };

  const handleApprove = () => {
    setIsDetailOpen(false);
    setIsApproveOpen(true);
  };

  const handleRequestRevision = () => {
    setIsRevisionOpen(true);
    setIsDetailOpen(false);
  };

  const handleSubmitRevision = () => {
    setIsSubmitRevisionOpen(true);
    setIsDetailOpen(false);
  };

  const openEdit = () => {
    setIsDetailOpen(false);
    setIsEditOpen(true);
  };

  const getInitials = (name?: string | null): string => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
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
                placeholder="Search by title or client..."
                className="h-10 w-full rounded-xl border-zinc-200/80 bg-zinc-50/50 pl-10 shadow-sm focus-visible:ring-[#430062]/15"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {role === "admin" && (
              <>
                <Select value={clientFilter} onValueChange={setClientFilter}>
                  <SelectTrigger className="h-10 w-full rounded-xl border-zinc-200/80 bg-white sm:w-48">
                    <SelectValue placeholder="All Clients" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Clients</SelectItem>
                    {uniqueClients.map((client) => (
                      <SelectItem key={client} value={client}>
                        {clientLookup[client] || client}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  className="h-10 w-full rounded-xl bg-[#430062] text-white shadow-md shadow-[#430062]/20 hover:bg-[#5a0080] sm:w-auto"
                  onClick={() => setIsAddContentOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4 shrink-0" />
                  New Content
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ═══════ KPI STRIP ═══════ */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
        {(
          [
            {
              key: "review",
              title: "Pending Review",
              count: counts.review,
              icon: Clock,
            },
            {
              key: "revise",
              title: "Needs Revision",
              count: counts.revise,
              icon: AlertCircle,
            },
            {
              key: "approved",
              title: "Approved",
              count: counts.approved,
              icon: CheckCircle,
            },
          ] as const
        ).map((stat) => {
          const cfg = STATUS_CONFIG[stat.key];
          const isActive = activeTab === stat.key;
          return (
            <button
              key={stat.key}
              onClick={() => setActiveTab(stat.key)}
              className={`group relative rounded-2xl border p-4 text-left shadow-sm ring-1 ring-black/[0.03] transition-all duration-200 sm:p-5 ${
                isActive
                  ? "border-[#430062]/30 bg-white ring-[#430062]/10"
                  : "border-zinc-200/80 bg-white/90 hover:border-zinc-300 hover:shadow-md"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className={`rounded-lg p-1.5 ${cfg.bg}`}>
                      <stat.icon className={`h-4 w-4 ${cfg.text}`} />
                    </div>
                    <span className="text-sm font-medium text-zinc-600">
                      {stat.title}
                    </span>
                  </div>
                  <div className="text-4xl font-bold tracking-tight text-zinc-900 tabular-nums">
                    {stat.count}
                  </div>
                </div>
                {isActive && (
                  <div className="h-2 w-2 rounded-full bg-[#430062]" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* ═══════ TABS + CONTENT ═══════ */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as typeof activeTab)}
        className="w-full"
      >
        <TabsList className="flex h-auto w-full flex-wrap gap-1 rounded-xl border border-zinc-200/80 bg-white/90 p-1 shadow-sm ring-1 ring-black/[0.03] md:w-fit">
          {(
            [
              {
                value: "review",
                label: "Pending Review",
                icon: Clock,
                count: counts.review,
              },
              {
                value: "revise",
                label: "Needs Revision",
                icon: AlertCircle,
                count: counts.revise,
              },
              {
                value: "approved",
                label: "Approved",
                icon: CheckCircle,
                count: counts.approved,
              },
            ] as const
          ).map(({ value, label, icon: Icon, count }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="flex-1 justify-center rounded-lg px-3 py-2 text-xs data-[state=active]:bg-[#430062]/10 data-[state=active]:text-[#430062] data-[state=active]:shadow-sm sm:flex-none sm:px-4 sm:py-2.5 sm:text-sm"
            >
              <Icon className="mr-1.5 h-3.5 w-3.5 flex-shrink-0 sm:mr-2 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">{label}</span>
              {count > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1.5 text-[10px] bg-zinc-100 text-zinc-600 hover:bg-zinc-100"
                >
                  {count}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {(["review", "revise", "approved"] as const).map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-4 sm:mt-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-3 border-zinc-200 border-t-[#430062]" />
                <p className="text-sm text-zinc-400">Loading approvals…</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
                  <AlertCircle className="h-8 w-8 text-red-400" />
                </div>
                <p className="mt-4 font-medium text-red-600">{error}</p>
              </div>
            ) : filteredApprovals.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredApprovals.map((item) => {
                  const overdue = isOverdue(item.revisionDueDate);
                  const statusCfg = STATUS_CONFIG[item.status];
                  const clientName =
                    clientLookup[item.client] || item.client || "Unknown";

                  return (
                    <Card
                      key={item.id}
                      className="group cursor-pointer rounded-2xl border border-zinc-200/80 bg-white/95 shadow-sm ring-1 ring-black/[0.03] transition-all hover:border-[#430062]/20 hover:shadow-md hover:ring-[#430062]/10"
                      onClick={() => openDetail(item)}
                    >
                      <CardContent className="p-0">
                        {/* Top accent bar */}
                        <div className="h-1 w-full bg-gradient-to-r from-[#430062] via-[#6b1a8f] to-[#a855f7] opacity-60 transition-opacity group-hover:opacity-100" />

                        <div className="space-y-4 p-5">
                          {/* Title + Status */}
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-3">
                              <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-zinc-900 transition-colors group-hover:text-[#430062]">
                                {item.title}
                              </h3>
                              <Badge
                                variant="outline"
                                className={`shrink-0 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}
                              >
                                {statusCfg.label}
                              </Badge>
                            </div>
                          </div>

                          {/* Meta tags */}
                          <div className="flex flex-wrap gap-1.5">
                            {item.platforms?.slice(0, 3).map((p) => (
                              <Badge
                                key={p}
                                variant="outline"
                                className="border-zinc-200 bg-zinc-50/50 px-2 py-0.5 text-[11px] font-normal text-zinc-600"
                              >
                                {p}
                              </Badge>
                            ))}
                            {item.platforms && item.platforms.length > 3 && (
                              <Badge
                                variant="outline"
                                className="border-zinc-200 bg-zinc-50/50 px-2 py-0.5 text-[11px] font-normal text-zinc-400"
                              >
                                +{item.platforms.length - 3}
                              </Badge>
                            )}
                            {item.contentTypes?.slice(0, 2).map((t) => (
                              <Badge
                                key={t}
                                variant="secondary"
                                className="bg-zinc-100/80 px-2 py-0.5 text-[11px] font-normal text-zinc-500"
                              >
                                {t}
                              </Badge>
                            ))}
                          </div>

                          {/* Drive files preview */}
                          {item.driveLinks && item.driveLinks.length > 0 && (
                            <div className="flex items-center gap-2">
                              <div className="flex -space-x-1.5">
                                {item.driveLinks.slice(0, 3).map((_, i) => (
                                  <div
                                    key={i}
                                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-amber-200/60 bg-amber-50"
                                  >
                                    <FolderOpen className="h-3.5 w-3.5 text-amber-600" />
                                  </div>
                                ))}
                              </div>
                              <span className="text-[11px] text-zinc-400">
                                {item.driveLinks.length} file
                                {item.driveLinks.length > 1 ? "s" : ""}
                              </span>
                            </div>
                          )}

                          {/* Footer */}
                          <div className="flex items-center justify-between border-t border-zinc-100 pt-3">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <Avatar className="h-8 w-8 shrink-0 shadow-sm ring-2 ring-white">
                                <AvatarFallback className="bg-zinc-100 text-[10px] font-semibold text-zinc-600">
                                  {getInitials(clientName)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="truncate text-[13px] font-medium text-zinc-700">
                                  {clientName}
                                </p>
                                <p
                                  className={`text-[11px] ${overdue ? "font-medium text-rose-600" : "text-zinc-400"}`}
                                >
                                  {formatDueDate(item.revisionDueDate)}
                                </p>
                              </div>
                            </div>

                            {item.revisionCount && item.revisionCount > 0 && (
                              <Badge
                                variant="outline"
                                className="border-zinc-200 bg-zinc-50/50 text-[10px] text-zinc-400"
                              >
                                {item.revisionCount} rev
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-200/80 bg-white/90 py-24 shadow-sm ring-1 ring-black/[0.03]">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-zinc-100">
                  {tab === "review" && (
                    <Inbox className="h-10 w-10 text-zinc-300" />
                  )}
                  {tab === "revise" && (
                    <CheckCircle2 className="h-10 w-10 text-zinc-300" />
                  )}
                  {tab === "approved" && (
                    <PartyPopper className="h-10 w-10 text-zinc-300" />
                  )}
                </div>
                <h3 className="mt-5 text-lg font-semibold text-zinc-800">
                  No items found
                </h3>
                <p className="mt-1 text-sm text-zinc-400">
                  Try changing the filter or search term
                </p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* ═══════ DETAIL DIALOG ═══════ */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent
          className="flex h-[100dvh] w-full max-w-[95vw] flex-col overflow-hidden rounded-2xl border-zinc-200/80 p-0 shadow-2xl sm:h-[94vh] sm:max-w-[90vw] md:max-w-2xl lg:max-w-3xl"
          showCloseButton={false}
        >
          {selectedApproval && (
            <div className="flex h-full min-h-0 flex-col">
              {/* Header */}
              <DialogHeader className="relative z-10 shrink-0 border-b border-zinc-200/80 bg-gradient-to-b from-[#430062]/[0.06] to-white px-4 pb-4 pt-5 sm:px-6 sm:pb-5 sm:pt-6 lg:px-8">
                <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#430062] via-[#6b1a8f] to-[#a855f7]" />
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 ${STATUS_CONFIG[selectedApproval.status].bg} ${STATUS_CONFIG[selectedApproval.status].text} ${STATUS_CONFIG[selectedApproval.status].border}`}
                      >
                        {STATUS_CONFIG[selectedApproval.status].label}
                      </Badge>
                      {selectedApproval.priority && (
                        <Badge
                          variant="outline"
                          className="border-red-200 bg-red-50 text-[10px] text-red-700"
                        >
                          {selectedApproval.priority}
                        </Badge>
                      )}
                    </div>
                    <DialogTitle className="text-xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-2xl lg:text-3xl">
                      {selectedApproval.title}
                    </DialogTitle>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {user?.role === "admin" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="hidden items-center gap-1.5 rounded-xl border-zinc-200/80 hover:bg-zinc-900/5 hover:border-zinc-300 sm:flex h-9"
                          onClick={openEdit}
                        >
                          <FileText className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="hidden items-center gap-1.5 rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 sm:flex h-9"
                          onClick={() => {
                            setContentToDelete({
                              id: selectedApproval.id,
                              title: selectedApproval.title,
                            });
                            setIsDeleteOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild className="sm:hidden">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 rounded-full"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={openEdit}>
                              <FileText className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() => {
                                setContentToDelete({
                                  id: selectedApproval.id,
                                  title: selectedApproval.title,
                                });
                                setIsDeleteOpen(true);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                      onClick={() => setIsDetailOpen(false)}
                    >
                      <X className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </div>
                </div>

                {/* Tags row */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {selectedApproval.platforms?.map((p) => (
                    <Badge
                      key={p}
                      variant="outline"
                      className="border-zinc-200 bg-zinc-50/50 text-[11px] text-zinc-600"
                    >
                      {p}
                    </Badge>
                  ))}
                  {selectedApproval.contentTypes?.map((t) => (
                    <Badge
                      key={t}
                      variant="secondary"
                      className="bg-zinc-100/80 text-[11px] text-zinc-500"
                    >
                      {t}
                    </Badge>
                  ))}
                </div>
              </DialogHeader>

              {/* Scrollable Body */}
              <div className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-y-contain bg-zinc-50/40 px-4 pb-4 pt-4 sm:space-y-8 sm:px-6 sm:pb-8 sm:pt-6 lg:px-8">
                {/* Drive Files */}
                {selectedApproval.driveLinks &&
                  selectedApproval.driveLinks.length > 0 && (
                    <div>
                      <h4 className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-400 sm:mb-3">
                        <FolderOpen className="h-3.5 w-3.5" />
                        Google Drive Files
                      </h4>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {selectedApproval.driveLinks.map((link, idx) => (
                          <a
                            key={idx}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-3.5 rounded-xl border border-zinc-200/80 bg-white p-4 shadow-sm ring-1 ring-black/[0.02] transition-all hover:border-[#430062]/25 hover:shadow-md"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                              <FolderOpen className="h-5 w-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-zinc-800 transition-colors group-hover:text-[#430062]">
                                Asset File {idx + 1}
                              </p>
                              <p className="truncate text-[11px] text-zinc-400">
                                Google Drive Link
                              </p>
                            </div>
                            <ExternalLink className="h-4 w-4 shrink-0 text-zinc-300 transition-colors group-hover:text-[#430062]" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Caption */}
                <div>
                  <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-400 sm:mb-3">
                    Caption
                  </h4>
                  {selectedApproval.caption ? (
                    <div className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-sm ring-1 ring-black/[0.02] sm:p-5">
                      <div
                        className="prose prose-zinc max-w-none text-sm leading-relaxed text-zinc-700 prose-headings:text-zinc-800 prose-strong:text-zinc-800 prose-a:text-[#430062] sm:text-[15px]"
                        dangerouslySetInnerHTML={{
                          __html: selectedApproval.caption,
                        }}
                      />
                    </div>
                  ) : (
                    <div className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-sm ring-1 ring-black/[0.02] sm:p-5">
                      <p className="text-sm text-zinc-400 italic">
                        No caption provided
                      </p>
                    </div>
                  )}
                </div>

                {/* Meta Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-y-6 sm:gap-x-6 lg:gap-x-8">
                  <div className="space-y-1.5 rounded-xl border border-zinc-200/80 bg-white p-4 shadow-sm ring-1 ring-black/[0.02] sm:space-y-2">
                    <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                      <User className="h-3 w-3" />
                      Client
                    </div>
                    <p className="text-sm font-medium text-zinc-900 sm:text-base">
                      {clientLookup[selectedApproval.client] ||
                        selectedApproval.client ||
                        "—"}
                    </p>
                  </div>
                  <div className="space-y-1.5 rounded-xl border border-zinc-200/80 bg-white p-4 shadow-sm ring-1 ring-black/[0.02] sm:space-y-2">
                    <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                      <Calendar className="h-3 w-3" />
                      Publish Date
                    </div>
                    <p className="text-sm font-medium text-zinc-900 sm:text-base">
                      {selectedApproval.publishDate
                        ? new Date(
                            selectedApproval.publishDate,
                          ).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                    </p>
                  </div>
                  <div className="space-y-1.5 rounded-xl border border-zinc-200/80 bg-white p-4 shadow-sm ring-1 ring-black/[0.02] sm:space-y-2">
                    <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                      <Layers className="h-3 w-3" />
                      Content Pillar
                    </div>
                    <p className="text-sm font-medium text-zinc-900 sm:text-base">
                      {selectedApproval.pillar || "—"}
                    </p>
                  </div>
                  <div className="space-y-1.5 rounded-xl border border-zinc-200/80 bg-white p-4 shadow-sm ring-1 ring-black/[0.02] sm:space-y-2">
                    <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                      <User className="h-3 w-3" />
                      Assigned To
                    </div>
                    <p className="text-sm font-medium text-zinc-900 sm:text-base">
                      {userLookup[selectedApproval.assignedTo] ||
                        selectedApproval.assignedTo ||
                        "—"}
                    </p>
                  </div>
                </div>

                {/* Revision Details */}
                {((selectedApproval.revisionNotes?.length ?? 0) > 0 ||
                  selectedApproval.revisionDueDate ||
                  selectedApproval.priority ||
                  typeof selectedApproval.revisionCount === "number") && (
                  <div className="space-y-5 rounded-xl border border-amber-200/80 bg-amber-50/60 p-4 ring-1 ring-amber-100 sm:p-6">
                    <div className="flex items-center justify-between">
                      <h4 className="flex items-center gap-2 text-sm font-semibold text-amber-900 sm:text-base">
                        <AlertCircle className="h-4 w-4" />
                        Revision Details
                      </h4>

                      {selectedApproval.priority && (
                        <Badge className="border border-amber-200 bg-amber-100 text-amber-700">
                          {selectedApproval.priority} Priority
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {selectedApproval.revisionDueDate && (
                        <div className="space-y-1">
                          <p className="text-[11px] uppercase tracking-widest text-zinc-500">
                            Due Date
                          </p>
                          <p className="text-sm font-medium text-zinc-900">
                            {new Date(
                              selectedApproval.revisionDueDate,
                            ).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      )}

                      {typeof selectedApproval.revisionCount === "number" && (
                        <div className="space-y-1">
                          <p className="text-[11px] uppercase tracking-widest text-zinc-500">
                            Revision Count
                          </p>
                          <p className="text-sm font-medium text-zinc-900">
                            {selectedApproval.revisionCount}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Revision Notes — Actually displayed */}
                    {(selectedApproval.revisionNotes?.length ?? 0) > 0 && (
                      <div>
                        <p className="mb-3 text-[11px] uppercase tracking-widest text-zinc-500">
                          Revision Notes
                        </p>

                        <div className="space-y-3">
                          {selectedApproval.revisionNotes?.map((note, idx) => (
                            <div
                              key={idx}
                              className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm ring-1 ring-black/[0.02] sm:p-5"
                            >
                              <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm font-medium text-zinc-900">
                                  {note.commenter}
                                </span>
                                <span className="text-xs text-zinc-400">
                                  {new Date(note.created_at).toLocaleString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                      hour: "numeric",
                                      minute: "2-digit",
                                    },
                                  )}
                                </span>
                              </div>
                              <p className="text-sm leading-relaxed text-zinc-700">
                                {note.comment}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="z-10 flex shrink-0 flex-col gap-2.5 border-t border-zinc-200/80 bg-white/95 p-4 backdrop-blur-sm sm:flex-row sm:gap-3 sm:p-6 lg:px-8 lg:pb-8">
                {role === "admin" && selectedApproval.status === "revise" && (
                  <Button
                    onClick={handleSubmitRevision}
                    className="h-11 w-full rounded-xl bg-[#430062] text-sm font-semibold text-white shadow-lg shadow-[#430062]/25 transition-all hover:bg-[#5a0080] active:scale-[0.99] sm:h-12 sm:flex-1 sm:text-base"
                  >
                    Submit Revision
                  </Button>
                )}

                {role === "client" && selectedApproval.status === "review" && (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleRequestRevision}
                      className="h-11 w-full rounded-xl border-zinc-200/80 text-sm font-medium hover:bg-zinc-50 hover:border-zinc-300 sm:h-12 sm:flex-1 sm:text-base"
                    >
                      Request Revision
                    </Button>
                    <Button
                      onClick={handleApprove}
                      className="h-11 w-full rounded-xl bg-[#430062] text-sm font-semibold text-white shadow-lg shadow-[#430062]/25 transition-all hover:bg-[#5a0080] active:scale-[0.99] sm:h-12 sm:flex-1 sm:text-base"
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Approve Content
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ═══════ MODALS (unchanged logic) ═══════ */}
      <AddContentModal
        isOpen={isAddContentOpen}
        onClose={() => setIsAddContentOpen(false)}
        onAdd={async (content) => {
          try {
            const res = await fetch("/api/contents/create", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                content_title: content.title,
                caption: content.caption,
                platforms: content.platforms,
                content_types: content.contentTypes,
                client: content.client,
                assigned_to: content.assignedTo,
                content_pillar: content.pillar,
                publish_date: content.publishDate,
                gdrive_links: content.driveLinks,
                adminName: user?.fullname?.toString() || "Admin",
              }),
            });
            const data = await res.json();
            if (!res.ok)
              throw new Error(data.error || "Failed to create content");
            const created = data.content;
            const newContent: ApprovalItem = {
              id: created.id,
              title: created.title,
              caption: created.caption || "",
              platforms: created.platforms || "",
              contentTypes: created.contentTypes || created.content_types || "",
              publishDate: created.publishDate || created.publish_date || "",
              client: created.client || "",
              assignedTo: created.assignedTo || "",
              driveLinks: created.driveLinks || [],
              pillar: created.pillar || created.content_pillar || "",
              status: (created.status as any) || "review",
              priority: created.priority ?? null,
              revisionDueDate: created.revisionDueDate ?? null,
              revisionCount: created.revisionCount ?? 0,
              revisionNotes: created.revisionNotes ?? [],
            };
            addContent(newContent);
            fetchContents();
            setIsAddContentOpen(false);
          } catch (error) {
            console.error(error);
            alert(
              error instanceof Error ? error.message : "Something went wrong",
            );
          }
        }}
        brandColor={CONTENT_BRAND}
      />

      <RequestRevisionModal
        isOpen={isRevisionOpen}
        onClose={() => setIsRevisionOpen(false)}
        onSubmit={async (request) => {
          if (!selectedApproval) return;
          try {
            const revisionNote = {
              commenter: user?.primary_contact_name || "Client",
              comment: request.comment,
              created_at: new Date().toISOString(),
            };
            const res = await fetch("/api/contents/revise", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: selectedApproval.id,
                status: "revise",
                priority: request.priority,
                revision_due_date: request.dueDate,
                revision_count: (selectedApproval.revisionCount || 0) + 1,
                revision_notes: [
                  ...(selectedApproval.revisionNotes || []),
                  revisionNote,
                ],
                clientName: user?.primary_contact_name || "Client",
              }),
            });
            const data = await res.json();
            if (!res.ok)
              throw new Error(data.error || "Failed to request revision");
            updateStatus(selectedApproval.id, "revise");
            fetchContents();
            setIsRevisionOpen(false);
          } catch (error) {
            console.error(error);
            alert(
              error instanceof Error ? error.message : "Something went wrong",
            );
          }
        }}
        contentTitle={selectedApproval?.title || ""}
        contentPlatforms={selectedApproval?.platforms || []}
        assignedTo={selectedApproval?.assignedTo || ""}
        brandColor={CONTENT_BRAND}
      />

      <SubmitRevisionModal
        isOpen={isSubmitRevisionOpen}
        onClose={() => setIsSubmitRevisionOpen(false)}
        content={
          selectedApproval
            ? {
                ...selectedApproval,
                publishDate:
                  selectedApproval.publishDate ||
                  new Date().toISOString().split("T")[0],
                assignedTo: selectedApproval.assignedTo || "",
                driveLinks: selectedApproval.driveLinks ?? [],
              }
            : null
        }
        adminName={user?.fullname?.toString() || "Admin"}
        onSubmit={async (update) => {
          try {
            const res = await fetch("/api/contents/submit-revision", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(update),
            });
            const data = await res.json();
            if (!res.ok)
              throw new Error(data.error || "Failed to submit revision");
            updateStatus(update.id, "review");
            fetchContents();
            setIsSubmitRevisionOpen(false);
          } catch (error) {
            console.error(error);
            alert(
              error instanceof Error ? error.message : "Something went wrong",
            );
          }
        }}
        brandColor={CONTENT_BRAND}
      />

      <ApproveConfirmDialog
        isOpen={isApproveOpen}
        onClose={() => setIsApproveOpen(false)}
        onConfirm={async () => {
          if (!selectedApproval) return;
          const res = await fetch("/api/contents/approve", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: selectedApproval.id,
              approverName: user?.primary_contact_name || "Client",
            }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Failed to approve");
          updateStatus(selectedApproval.id, "approved");
          fetchContents();
          setIsApproveOpen(false);
        }}
        contentTitle={selectedApproval?.title || ""}
        platforms={selectedApproval?.platforms || []}
        clientName={selectedApproval?.client || ""}
        brandColor={CONTENT_BRAND}
      />

      <EditContentModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onUpdate={async (id: string, updatedData) => {
          try {
            const response = await fetch("/api/contents/update", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id,
                content_title: updatedData.title,
                caption: updatedData.caption,
                platforms: updatedData.platforms,
                content_types: updatedData.contentTypes,
                client: updatedData.client,
                assigned_to: updatedData.assignedTo,
                content_pillar: updatedData.pillar,
                publish_date: updatedData.publishDate,
                gdrive_links: updatedData.driveLinks,
                adminName: user?.fullname?.toString() || "Admin",
              }),
            });
            const result = await response.json();
            if (!response.ok)
              throw new Error(result.error || "Failed to update content");
            await fetchContents();
            setSelectedApproval((prev) => {
              if (!prev) return null;
              return {
                ...prev,
                title: updatedData.title,
                caption: updatedData.caption,
                platforms: updatedData.platforms,
                contentTypes: updatedData.contentTypes,
                client: updatedData.client,
                assignedTo: updatedData.assignedTo,
                pillar: updatedData.pillar,
                publishDate: updatedData.publishDate,
                driveLinks: updatedData.driveLinks,
                status: prev.status,
                priority: prev.priority,
                revisionDueDate: prev.revisionDueDate,
                revisionCount: prev.revisionCount,
                revisionNotes: prev.revisionNotes,
              };
            });
            alert("Content updated successfully!");
          } catch (error) {
            console.error(error);
            alert(
              error instanceof Error
                ? error.message
                : "Failed to update content",
            );
          }
        }}
        content={selectedApproval!}
        brandColor={CONTENT_BRAND}
      />

      <DeleteContentModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setContentToDelete(null);
        }}
        onConfirm={async (id) => {
          try {
            const res = await fetch("/api/contents/delete", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id,
                adminName: user?.fullname?.toString() || "Admin",
              }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to delete");
            await fetchContents();
            setIsDeleteOpen(false);
            setIsDetailOpen(false);
            setContentToDelete(null);
            alert("Content deleted successfully");
          } catch (error) {
            alert(
              error instanceof Error
                ? error.message
                : "Failed to delete content",
            );
          }
        }}
        contentTitle={contentToDelete?.title || ""}
        contentId={contentToDelete?.id || ""}
        isDeleting={false}
      />
    </div>
  );
}
