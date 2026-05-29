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
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import AddContentModal from "../sections/AddContentModal";
import RequestRevisionModal from "../sections/RequestRevisionModal";
import SubmitRevisionModal from "../sections/SubmitRevisionModal";
import ApproveConfirmDialog from "../sections/ApproveConfirmDialog";

import { useContentStore } from "@/store/useContentStore";
import { useAuthStore } from "@/store/useAuthStore";
import EditContentModal from "../sections/EditContentModal";
import { useClientStore } from "@/store/clientStore";
import { useUsersStore } from "@/store/useUsersStore";

const brandColor = "#430062";

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

export default function ApprovalsModule() {
  const user = useAuthStore((state) => state.user);
  const role = user?.role || "";

  const { clients, fetchClients } = useClientStore();
  const { users, fetchUsers } = useUsersStore();

  // Local State
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

  // Store
  const { contents, loading, error, fetchContents, addContent, updateStatus } =
    useContentStore();

  useEffect(() => {
    fetchContents();
    fetchClients();
    fetchUsers();
  }, [fetchContents, fetchClients, fetchUsers]);

  // ==================== FILTERING & COUNTS ====================
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

  const uniqueClients = useMemo(() => {
    return [...new Set(contents.map((item) => item.client).filter(Boolean))];
  }, [contents]);

  const pendingCount = useMemo(() => {
    return contents.filter(
      (a) =>
        a.status === "review" &&
        (clientFilter === "all" || a.client === clientFilter),
    ).length;
  }, [contents, clientFilter]);

  const revisionCount = useMemo(() => {
    return contents.filter(
      (a) =>
        a.status === "revise" &&
        (clientFilter === "all" || a.client === clientFilter),
    ).length;
  }, [contents, clientFilter]);

  const approvedCount = useMemo(() => {
    return contents.filter(
      (a) =>
        a.status === "approved" &&
        (clientFilter === "all" || a.client === clientFilter),
    ).length;
  }, [contents, clientFilter]);

  // ==================== DATE UTILITIES ====================
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

  // ==================== HANDLERS ====================
  const openDetail = (approval: any) => {
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

  const clientLookup = Object.fromEntries(
    clients.map((c) => [c.id, c.company_name]),
  );

  const userLookup = Object.fromEntries(users.map((u) => [u.id, u.fullname]));

  return (
    <div className="p-6 lg:p-8 space-y-8 min-h-screen bg-zinc-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">
              Approvals
            </h1>
            <p className="text-zinc-600 mt-1">Client collaboration hub</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:max-w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Search by title or client..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {role === "admin" && (
              <>
                <Select value={clientFilter} onValueChange={setClientFilter}>
                  <SelectTrigger className="w-full sm:w-56 h-11">
                    <SelectValue placeholder="All Clients" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Clients</SelectItem>
                    {uniqueClients.map((client) => (
                      <SelectItem key={client} value={client}>
                        {client}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  style={{ backgroundColor: brandColor }}
                  className="text-white whitespace-nowrap"
                  onClick={() => setIsAddContentOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Content
                </Button>
              </>
            )}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            {
              title: "Pending Review",
              count: pendingCount,
              icon: Clock,
              color: "amber",
            },
            {
              title: "Needs Revision",
              count: revisionCount,
              icon: AlertCircle,
              color: "rose",
            },
            {
              title: "Approved",
              count: approvedCount,
              icon: CheckCircle,
              color: "emerald",
            },
          ].map((stat, i) => (
            <Card key={i} className="border border-zinc-200">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{stat.title}</CardTitle>
                  <stat.icon className={`h-5 w-5 text-${stat.color}-600`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-semibold tracking-tighter text-zinc-900">
                  {stat.count}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(v) =>
            setActiveTab(v as "review" | "revise" | "approved")
          }
        >
          <TabsList className="bg-white border border-zinc-200 p-1 w-full md:w-fit">
            {[
              {
                value: "review",
                label: "Pending Review",
                icon: Clock,
                count: pendingCount,
              },
              {
                value: "revise",
                label: "Needs Revision",
                icon: AlertCircle,
                count: revisionCount,
              },
              {
                value: "approved",
                label: "Approved",
                icon: CheckCircle,
                count: approvedCount,
              },
            ].map(({ value, label, icon: Icon, count }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="flex items-center gap-2 px-5 py-2.5"
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
                {count > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {count}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {["review", "revise", "approved"].map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-8">
              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin h-8 w-8 border-4 border-zinc-300 border-t-violet-600 rounded-full" />
                </div>
              ) : error ? (
                <div className="text-center py-20 text-red-600">
                  <AlertCircle className="h-10 w-10 mx-auto mb-4" />
                  <p>{error}</p>
                </div>
              ) : filteredApprovals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredApprovals.map((item) => {
                    const overdue = isOverdue(item.revisionDueDate);

                    return (
                      <Card
                        key={item.id}
                        className="group cursor-pointer hover:shadow-xl transition-all duration-300 border border-zinc-200 hover:border-zinc-300"
                        onClick={() => openDetail(item)}
                      >
                        <CardContent className="p-6 flex flex-col h-full">
                          <h3 className="font-semibold text-lg leading-tight mb-3 line-clamp-2 group-hover:text-violet-700 transition-colors">
                            {item.title}
                          </h3>

                          {/* Platforms & Content Types - Multiple Selection */}
                          <div className="flex flex-wrap gap-2 mb-5">
                            {/* Platforms */}
                            {item.platforms && item.platforms.length > 0 ? (
                              <>
                                {item.platforms
                                  .slice(0, 2)
                                  .map((platform: string) => (
                                    <Badge
                                      key={platform}
                                      variant="outline"
                                      className="text-xs font-medium px-2.5 py-0.5"
                                    >
                                      {platform}
                                    </Badge>
                                  ))}
                                {item.platforms.length > 2 && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs px-2.5 py-0.5"
                                  >
                                    +{item.platforms.length - 2}
                                  </Badge>
                                )}
                              </>
                            ) : (
                              <span className="text-xs text-zinc-400">
                                No platform
                              </span>
                            )}

                            {/* Content Types */}
                            {item.contentTypes &&
                            item.contentTypes.length > 0 ? (
                              <>
                                {item.contentTypes
                                  .slice(0, 2)
                                  .map((type: string) => (
                                    <Badge
                                      key={type}
                                      variant="secondary"
                                      className="text-xs bg-zinc-100 text-zinc-700 px-2.5 py-0.5"
                                    >
                                      {type}
                                    </Badge>
                                  ))}
                                {item.contentTypes.length > 2 && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs bg-zinc-100 px-2.5 py-0.5"
                                  >
                                    +{item.contentTypes.length - 2}
                                  </Badge>
                                )}
                              </>
                            ) : (
                              <span className="text-xs text-zinc-400">
                                No content type
                              </span>
                            )}
                          </div>

                          {/* Drive Files */}
                          {item.driveLinks && item.driveLinks.length > 0 && (
                            <div className="mb-6">
                              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2">
                                DRIVE FILES
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {item.driveLinks.slice(0, 2).map((_, idx) => (
                                  <div
                                    key={idx}
                                    className="text-xs flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1 rounded-lg"
                                  >
                                    <FolderOpen className="h-3.5 w-3.5" />
                                    File {idx + 1}
                                  </div>
                                ))}
                                {item.driveLinks.length > 2 && (
                                  <div className="text-xs text-amber-600 px-2 py-1">
                                    +{item.driveLinks.length - 2} more
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Footer */}
                          <div className="mt-auto flex items-center justify-between pt-4 border-t">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9 ring-2 ring-white">
                                <AvatarFallback className="bg-zinc-100 text-xs font-medium">
                                  {clientLookup[item.client]
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">
                                  {clientLookup[item.client]}
                                </p>
                                <p
                                  className={`text-xs ${overdue ? "text-rose-600 font-medium" : "text-zinc-500"}`}
                                >
                                  {formatDueDate(item.revisionDueDate)}
                                </p>
                              </div>
                            </div>

                            {item.revisionCount && item.revisionCount > 0 && (
                              <Badge variant="outline" className="text-xs">
                                {item.revisionCount} rev
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-24">
                  <div className="mx-auto w-20 h-20 bg-zinc-100 rounded-3xl flex items-center justify-center mb-6">
                    {tab === "review" && (
                      <Inbox className="h-10 w-10 text-zinc-400" />
                    )}
                    {tab === "revise" && (
                      <CheckCircle2 className="h-10 w-10 text-zinc-400" />
                    )}
                    {tab === "approved" && (
                      <PartyPopper className="h-10 w-10 text-zinc-400" />
                    )}
                  </div>
                  <h3 className="text-2xl font-semibold text-zinc-900">
                    No items found
                  </h3>
                  <p className="text-zinc-500 mt-2">
                    Try changing the filter or search term.
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent
          className="w-[95vw] max-w-2xl max-h-[95vh] p-0 flex flex-col overflow-hidden"
          showCloseButton={false}
        >
          {selectedApproval && (
            <div className="flex flex-col h-full max-h-[95vh] overflow-hidden">
              {/* Fixed Header */}
              <DialogHeader className="px-6 sm:px-8 py-5 sm:py-6 border-b bg-white flex-shrink-0 relative">
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-12">
                    <DialogTitle className="text-2xl sm:text-3xl font-semibold leading-tight">
                      {selectedApproval.title}
                    </DialogTitle>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {selectedApproval.platforms?.map((platform, idx) => (
                        <Badge key={idx} variant="default">
                          {platform}
                        </Badge>
                      ))}
                      {selectedApproval.contentTypes?.map((type, idx) => (
                        <Badge key={idx} variant="outline">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="hidden sm:flex items-center gap-2"
                      onClick={() => setIsEditOpen(true)}
                    >
                      <FileText className="h-4 w-4" />
                      Edit
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsDetailOpen(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </DialogHeader>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-10 bg-zinc-50">
                {/* Google Drive Files */}
                {selectedApproval.driveLinks &&
                  selectedApproval.driveLinks.length > 0 && (
                    <div>
                      <h4 className="uppercase text-xs tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
                        <FolderOpen className="h-4 w-4" /> GOOGLE DRIVE FILES
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selectedApproval.driveLinks.map((link, idx) => (
                          <a
                            key={idx}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex w-full items-center gap-4 p-5 border border-zinc-200 rounded-2xl hover:border-amber-300 hover:bg-amber-50/70 transition-all group"
                          >
                            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                              <FolderOpen className="h-6 w-6 text-amber-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium group-hover:text-amber-700">
                                Asset File {idx + 1}
                              </p>
                              <p className="text-sm text-zinc-500 truncate">
                                Google Drive Link
                              </p>
                            </div>
                            <ExternalLink className="h-5 w-5 text-zinc-400 group-hover:text-amber-600" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Caption */}
                <div>
                  <h4 className="uppercase text-xs tracking-widest text-zinc-500 mb-3">
                    CAPTION
                  </h4>
                  {selectedApproval.caption ? (
                    <div
                      className="text-zinc-700 leading-relaxed text-[15.5px] prose prose-zinc max-w-none prose-headings:text-zinc-800 prose-strong:text-zinc-800 prose-a:text-blue-600"
                      dangerouslySetInnerHTML={{
                        __html: selectedApproval.caption,
                      }}
                    />
                  ) : (
                    <p className="text-zinc-500 italic">No caption provided.</p>
                  )}
                </div>

                {/* Revision Details */}
                {(selectedApproval.revisionDueDate ||
                  (selectedApproval.revisionNotes?.length ?? 0) > 0) && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                    <h4 className="font-semibold text-amber-900 mb-4">
                      Revision Details
                    </h4>
                    {(selectedApproval.revisionNotes?.length ?? 0) > 0 && (
                      <div className="text-sm text-amber-800">
                        {selectedApproval.revisionNotes?.length ?? 0} previous
                        revision note(s)
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Fixed Footer */}
              <div className="border-t p-6 bg-white flex-shrink-0 flex gap-3">
                {role === "admin" && selectedApproval.status === "revise" && (
                  <Button
                    onClick={handleSubmitRevision}
                    className="flex-1 h-12"
                  >
                    Submit Revision
                  </Button>
                )}

                {role === "client" && selectedApproval.status === "review" && (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleRequestRevision}
                      className="flex-1 h-12"
                    >
                      Request Revision
                    </Button>
                    <Button
                      onClick={handleApprove}
                      className="flex-1 h-12 text-white"
                      style={{ backgroundColor: brandColor }}
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

      {/* Modals */}
      <AddContentModal
        isOpen={isAddContentOpen}
        onClose={() => setIsAddContentOpen(false)}
        onAdd={async (content) => {
          try {
            const res = await fetch("/api/contents/create", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
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

            if (!res.ok) {
              throw new Error(data.error || "Failed to create content");
            }

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
            fetchContents(); // Refresh the full list from server

            setIsAddContentOpen(false);
          } catch (error) {
            console.error(error);
            alert(
              error instanceof Error ? error.message : "Something went wrong",
            );
          }
        }}
        brandColor={brandColor}
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
                revision_due_date: request.dueDate, // ← Fixed: use .dueDate
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
        brandColor={brandColor}
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
                // SubmitRevisionModal expects ContentItem['assignedTo'] to be a string (not undefined)
                assignedTo: selectedApproval.assignedTo || "",
                // SubmitRevisionModal expects ContentItem['driveLinks'] to be string[] (never undefined)
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
        brandColor={brandColor}
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

          // Update local store + refresh
          updateStatus(selectedApproval.id, "approved");
          fetchContents();

          setIsApproveOpen(false);
        }}
        contentTitle={selectedApproval?.title || ""}
        platforms={selectedApproval?.platforms || []}
        clientName={selectedApproval?.client || ""}
        brandColor={brandColor}
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

            if (!response.ok) {
              throw new Error(result.error || "Failed to update content");
            }

            // Refresh data
            await fetchContents();

            // Update selected item for immediate feedback
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
                // Preserve existing fields not in edit
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
        brandColor={brandColor}
      />
    </div>
  );
}
