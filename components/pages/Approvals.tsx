"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import AddContentModal from "../sections/AddContentModal";
import RequestRevisionModal from "../sections/RequestRevisionModal";
import { useContentStore } from "@/store/useContentStore";

const brandColor = "#430062";

// ==================== TYPES ====================
interface ApprovalItem {
  id: string;
  title: string;
  caption: string;
  platform: string;
  contentType: string;
  client: string;
  thumbnail: string;
  status: "pending" | "revision" | "approved";
  dueDate: string;
  submittedAt: string;
  revisionCount: number;
  driveLinks?: string[];
}

interface Comment {
  id: string;
  user: string;
  role: string;
  comment: string;
  timestamp: string;
}

interface HistoryEntry {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  comment?: string;
}

// ==================== MOCK DATA ===================
const mockComments: Comment[] = [
  {
    id: "c1",
    user: "Elena Voss",
    role: "Client",
    comment: "I love the visuals but can we make the CTA button larger?",
    timestamp: "4 hours ago",
  },
  {
    id: "c2",
    user: "Sarah Chen",
    role: "Marketing",
    comment: "Updated the button size and contrast. Ready for review.",
    timestamp: "2 hours ago",
  },
];

const mockHistory: HistoryEntry[] = [
  {
    id: "h1",
    action: "Submitted for Approval",
    user: "Sarah Chen",
    timestamp: "May 18, 2026",
  },
  {
    id: "h2",
    action: "Revision Requested",
    user: "Elena Voss",
    timestamp: "May 19, 2026",
    comment: "Make CTA button more prominent",
  },
  {
    id: "h3",
    action: "Resubmitted",
    user: "Sarah Chen",
    timestamp: "May 20, 2026",
  },
];

export default function ApprovalsModule() {
  const [activeTab, setActiveTab] = useState<
    "review" | "revision" | "approved"
  >("review");
  const [searchTerm, setSearchTerm] = useState("");
  const [clientFilter, setClientFilter] = useState("all");
  const [selectedApproval, setSelectedApproval] = useState<ApprovalItem | null>(
    null,
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isAddContentOpen, setIsAddContentOpen] = useState(false);
  const [isRevisionOpen, setIsRevisionOpen] = useState(false);

  const { contents, loading, error, fetchContents, addContent, updateStatus } =
    useContentStore();

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  const filteredApprovals = contents.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClient =
      clientFilter === "all" || item.client === clientFilter;
    const matchesTab = item.status === activeTab;
    return matchesSearch && matchesClient && matchesTab;
  });

  const openDetail = (approval: ApprovalItem) => {
    setSelectedApproval(approval);
    setIsDetailOpen(true);
  };

  const handleApprove = () => {
    alert("Content approved successfully! 🎉");
    setIsDetailOpen(false);
  };

  const handleRequestRevision = () => {
    setIsRevisionOpen(true);
    setIsDetailOpen(false);
  };

  function formatDueDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.ceil(
      (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays < 0)
      return `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? "s" : ""}`;
    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "Due tomorrow";
    if (diffDays <= 7) return `Due in ${diffDays} days`;
    return `Due ${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  }

  function isOverdue(dateStr: string): boolean {
    const due = new Date(dateStr);
    due.setHours(23, 59, 59, 999);

    return due < new Date();
  }

  const pendingCount = contents.filter((a) => a.status === "review").length;

  const revisionCount = contents.filter((a) => a.status === "revision").length;

  const approvedCount = contents.filter((a) => a.status === "approved").length;

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex flex-col gap-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Approvals</h1>
            <p className="text-zinc-600 mt-1">Client collaboration hub</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 min-w-0 sm:max-w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Search approvals..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Client Filter */}
            <Select value={clientFilter} onValueChange={setClientFilter}>
              <SelectTrigger className="h-11 w-full sm:w-52">
                <SelectValue placeholder="All Clients" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                <SelectItem value="Lumina Fashion">Lumina Fashion</SelectItem>
                <SelectItem value="Nexus Tech">Nexus Tech</SelectItem>
                <SelectItem value="Bloom Wellness">Bloom Wellness</SelectItem>
              </SelectContent>
            </Select>

            {/* Upload Button */}
            <Button
              style={{ backgroundColor: brandColor }}
              className="text-white w-full sm:w-auto"
              onClick={() => setIsAddContentOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4 flex-shrink-0" />
              New Content
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white border border-zinc-200 rounded-3xl shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Pending Review</CardTitle>
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-semibold tracking-tighter">{pendingCount}</div>
              {/* <p className="text-sm text-zinc-500 mt-2">Due this week</p> */}
            </CardContent>
          </Card>

          <Card className="bg-white border border-zinc-200 rounded-3xl shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Revision Needed</CardTitle>
                <AlertCircle className="h-5 w-5 text-rose-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-semibold tracking-tighter">{revisionCount}</div>
              {/* <p className="text-sm text-zinc-500 mt-2">Action required</p> */}
            </CardContent>
          </Card>

          <Card className="bg-white border border-zinc-200 rounded-3xl shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Approved</CardTitle>
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-semibold tracking-tighter">{approvedCount}</div>
              {/* <p className="text-sm text-emerald-600 mt-2">
                +4 from last month
              </p> */}
            </CardContent>
          </Card>
        </div>

        {/* Status Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(v) =>
            setActiveTab(v as "review" | "revision" | "approved")
          }
          className="w-full"
        >
          <TabsList className="bg-white border border-zinc-200 flex flex-wrap h-auto w-full md:w-fit p-1 gap-1">
            {[
              {
                value: "review",
                label: "Pending Review",
                icon: Clock,
                count: pendingCount,
              },
              {
                value: "revision",
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
                className="data-[state=active]:border-b-2 data-[state=active]:border-violet-600 data-[state=active]:bg-violet-50 flex-1 sm:flex-none justify-center text-xs sm:text-sm sm:px-4 sm:py-2.5"
              >
                <Icon className="h-4 w-4 flex-shrink-0" />

                {/* Full label on larger screens */}
                <span className="hidden sm:inline">{label}</span>

                {count > 0 && (
                  <span className="ml-1 text-[10px] sm:text-xs bg-zinc-200/80 data-[state=active]:bg-violet-100 text-zinc-600 data-[state=active]:text-violet-700 px-1.5 py-0.5 rounded-full font-semibold transition-colors">
                    {count}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {["review", "revision", "approved"].map((tab) => (
            <TabsContent
              key={tab}
              value={tab}
              className="mt-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/20 rounded-lg"
            >
              {filteredApprovals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                  {filteredApprovals.map((item, index) => (
                    <Card
                      key={item.id}
                      className="group bg-white border border-zinc-200/80 rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-zinc-200/50 hover:border-zinc-300/80 transition-all duration-300 cursor-pointer flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/30 focus-visible:ring-offset-2"
                      onClick={() => openDetail(item)}
                      style={{ animationDelay: `${index * 40}ms` }}
                    >
                      <CardContent className="p-5 sm:p-6 flex-1 flex flex-col">
                        {/* Title */}
                        <h3 className="font-semibold text-base sm:text-lg leading-snug mb-2 line-clamp-2 text-zinc-900 group-hover:text-violet-700 transition-colors duration-200">
                          {item.title}
                        </h3>

                        {/* Metadata */}
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-zinc-500 mb-4">
                          <span className="font-medium text-zinc-600">
                            {item.platform}
                          </span>
                          <span className="text-zinc-300">•</span>
                          <span>{item.contentType}</span>
                        </div>

                        {/* Drive Files */}
                        {item.driveLinks && item.driveLinks.length > 0 && (
                          <div className="mb-4">
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 mb-2">
                              Drive Files
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {item.driveLinks.map((link, idx) => (
                                <a
                                  key={idx}
                                  href={link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-flex items-center gap-1.5 text-xs bg-zinc-50 hover:bg-zinc-100 active:bg-zinc-200 transition-all duration-200 px-2.5 py-1.5 rounded-lg text-zinc-600 border border-zinc-200/80 hover:border-zinc-300 hover:shadow-sm group/link"
                                >
                                  <FolderOpen className="h-3 w-3 text-amber-600 flex-shrink-0" />
                                  <span className="truncate max-w-[120px] sm:max-w-[140px]">
                                    File {idx + 1}
                                  </span>
                                  <ExternalLink className="h-2.5 w-2.5 text-zinc-400 opacity-0 group-hover/link:opacity-100 transition-opacity flex-shrink-0" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Footer */}
                        <div className="mt-auto pt-4 border-t border-zinc-100 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Avatar className="h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0 ring-2 ring-zinc-50">
                              <AvatarFallback className="bg-zinc-100 text-zinc-600 text-xs font-medium">
                                {item.client
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-zinc-900 truncate">
                                {item.client}
                              </p>
                              <p
                                className={`text-xs ${
                                  isOverdue(item.dueDate)
                                    ? "text-rose-500 font-medium"
                                    : "text-zinc-500"
                                }`}
                              >
                                {formatDueDate(item.dueDate)}
                              </p>
                            </div>
                          </div>

                          {item.revisionCount > 0 && (
                            <Badge
                              variant="outline"
                              className="text-[11px] sm:text-xs whitespace-nowrap flex-shrink-0 bg-zinc-50 text-zinc-600 border-zinc-200"
                            >
                              {item.revisionCount} revision
                              {item.revisionCount !== 1 ? "s" : ""}
                            </Badge>
                          )}
                        </div>
                      </CardContent>

                      {/* Status bar for cards without thumbnail */}
                      {!item.thumbnail && (
                        <div
                          className={`h-1 w-full ${
                            item.status === "review"
                              ? "bg-amber-400"
                              : item.status === "revision"
                                ? "bg-rose-400"
                                : "bg-emerald-400"
                          }`}
                        />
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 sm:py-24 animate-in fade-in duration-500">
                  <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-zinc-50 border border-zinc-100 rounded-2xl flex items-center justify-center mb-5">
                    {tab === "review" ? (
                      <Inbox className="h-7 w-7 text-zinc-300" />
                    ) : tab === "revision" ? (
                      <CheckCircle2 className="h-7 w-7 text-zinc-300" />
                    ) : (
                      <PartyPopper className="h-7 w-7 text-zinc-300" />
                    )}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-zinc-900">
                    {tab === "review"
                      ? "All caught up!"
                      : tab === "revision"
                        ? "No revisions needed"
                        : "Nothing approved yet"}
                  </h3>
                  <p className="text-sm sm:text-base text-zinc-500 mt-2 max-w-sm mx-auto">
                    {tab === "review"
                      ? "There are no items waiting for your review right now."
                      : tab === "revision"
                        ? "Great work! No content needs revision at the moment."
                        : "Approved items will appear here once you review them."}
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Content Detail Sheet */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="w-full max-w-[95vw] lg:max-w-5xl xl:max-w-6xl max-h-[94vh] overflow-hidden p-0 flex flex-col">
          {selectedApproval && (
            <div className="flex flex-col h-full min-h-0">
              {/* Header */}
              <DialogHeader className="px-6 sm:px-8 pt-6 pb-5 border-b bg-white z-10 flex-shrink-0 relative">
                <DialogTitle className="text-2xl sm:text-3xl leading-tight font-semibold tracking-tight pr-10">
                  {selectedApproval.title}
                </DialogTitle>

                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge>{selectedApproval.platform}</Badge>
                  <Badge variant="outline">
                    {selectedApproval.contentType}
                  </Badge>
                </div>

                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 sm:right-6 top-5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-full h-9 w-9"
                  onClick={() => setIsDetailOpen(false)}
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </Button>
              </DialogHeader>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-8 space-y-10 min-h-0">
                {/* Google Drive Files */}
                {selectedApproval.driveLinks &&
                  selectedApproval.driveLinks.length > 0 && (
                    <div>
                      <h4 className="uppercase text-xs tracking-widest text-zinc-500 mb-3 flex items-center gap-2">
                        <FolderOpen className="h-4 w-4" />
                        GOOGLE DRIVE FILES
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedApproval.driveLinks.map((link, idx) => (
                          <a
                            key={idx}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-4 p-4 border border-zinc-200 hover:border-amber-300 rounded-2xl hover:bg-amber-50/50 transition-all"
                          >
                            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                              <FolderOpen className="h-6 w-6 text-amber-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-sm text-zinc-900 group-hover:text-amber-700 transition-colors">
                                Asset File {idx + 1}
                              </p>
                              <p className="text-xs text-zinc-500 truncate">
                                Google Drive Link
                              </p>
                            </div>
                            <ExternalLink className="h-5 w-5 text-zinc-400 group-hover:text-amber-600 transition-colors" />
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
                  <p className="text-zinc-700 leading-relaxed text-[15px] sm:text-lg">
                    {selectedApproval.caption}
                  </p>
                </div>

                <Separator className="my-8" />

                {/* Revision History */}
                <div>
                  <h4 className="font-semibold mb-5">Revision History</h4>
                  <div className="space-y-8 pl-5 border-l-2 border-zinc-200">
                    {mockHistory.map((entry, index) => (
                      <div key={entry.id} className="relative">
                        {index !== mockHistory.length - 1 && (
                          <div className="absolute left-[-9px] top-7 w-0.5 h-8 bg-zinc-200" />
                        )}
                        <div className="flex gap-5">
                          <div className="text-xs w-20 text-right text-zinc-400 font-mono pt-0.5 shrink-0">
                            {entry.timestamp}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{entry.action}</div>
                            <div className="text-sm text-zinc-500">
                              by {entry.user}
                            </div>
                            {entry.comment && (
                              <p className="text-sm text-zinc-600 mt-2 italic">
                                &quot;{entry.comment}&quot;
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comments */}
                <div>
                  <h4 className="font-semibold mb-5 flex items-center gap-2">
                    Comments
                    <span className="text-sm px-2.5 py-0.5 bg-zinc-100 rounded-full text-zinc-500">
                      {mockComments.length}
                    </span>
                  </h4>

                  <ScrollArea className="h-72 sm:h-80 pr-4">
                    <div className="space-y-6">
                      {mockComments.map((comment) => (
                        <div key={comment.id} className="flex gap-4">
                          <Avatar className="h-9 w-9 shrink-0">
                            <AvatarFallback>
                              {comment.user
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">
                                {comment.user}
                              </span>
                              <span className="text-xs text-zinc-400 whitespace-nowrap">
                                {comment.timestamp}
                              </span>
                            </div>
                            <p className="mt-1 text-zinc-600 leading-relaxed">
                              {comment.comment}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>

              {/* Sticky Action Bar */}
              <div className="border-t bg-white p-6 sm:p-8 z-10 flex-shrink-0">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 h-12"
                    onClick={handleRequestRevision}
                  >
                    Request Revision
                  </Button>
                  <Button
                    className="flex-1 h-12 text-white p-2"
                    style={{ backgroundColor: brandColor }}
                    onClick={handleApprove}
                  >
                    Approve Content
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <AddContentModal
        isOpen={isAddContentOpen}
        onClose={() => setIsAddContentOpen(false)}
        onAdd={(content) => {
          const newContent: ContentItem = {
            id: `c${Date.now()}`,
            title: content.title,
            caption: content.caption,
            platform: content.platform,
            contentType: content.contentType,
            status: content.status as ContentItem["status"],
            publishDate: content.publishDate,
            client: content.client,
            assignedTo: content.assignedTo,
            driveLinks: content.driveLinks,
            pillar: content.pillar,
          };

          addContent(newContent);
        }}
        brandColor={brandColor}
      />
      <RequestRevisionModal
        isOpen={isRevisionOpen}
        onClose={() => setIsRevisionOpen(false)}
        onSubmit={(request) => {
          // Handle the revision request
          console.log("Revision requested:", request);
          // Update content status to "revision"
          if (selectedApproval) {
            handleStatusChange(selectedApproval.id, "revision");
          }
          // You could also append to revision history here
        }}
        contentTitle={selectedApproval?.title}
        contentPlatform={selectedApproval?.platform}
        assignedTo={selectedApproval?.assignedTo || "Team Member"}
        brandColor={brandColor}
      />
    </div>
  );
}
