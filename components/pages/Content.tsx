"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  LayoutDashboard,
  Table as TableIcon,
  Plus,
  Search,
  MoreHorizontal,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import AddContentModal from "../sections/AddContentModal";
import RequestRevisionModal from "../sections/RequestRevisionModal";
import SubmitRevisionModal from "../sections/SubmitRevisionModal";
import ApproveConfirmDialog from "../sections/ApproveConfirmDialog";
import { useContentStore } from "@/store/useContentStore";

const brandColor = "#430062";
const role = "client";

// ==================== TYPES ====================
interface ContentItem {
  id: string;
  title: string;
  caption: string;
  platform: string;
  contentType: string;
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

const statusColors = {
  review: "bg-amber-100 text-amber-700",
  revise: "bg-rose-100 text-rose-700",
  approved: "bg-emerald-100 text-emerald-700",
  scheduled: "bg-blue-100 text-blue-700",
  posted: "bg-purple-100 text-purple-700",
};

const statusLabels = {
  review: "For Review",
  revise: "For Revision",
  approved: "Approved",
  scheduled: "Scheduled",
  posted: "Posted",
};

export default function ContentOperations() {
  const [activeView, setActiveView] = useState<"kanban" | "calendar" | "table">(
    "kanban",
  );

  const { contents, fetchContents, updateStatus, addContent, loading } =
    useContentStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(
    null,
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddContentOpen, setIsAddContentOpen] = useState(false);

  const filteredContents = contents.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const [isRevisionOpen, setIsRevisionOpen] = useState(false);
  const [isSubmitRevisionOpen, setIsSubmitRevisionOpen] = useState(false);
  const [isApproveOpen, setIsApproveOpen] = useState(false);

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  const kanbanColumns = [
    {
      id: "review",
      title: "For Review",
      items: filteredContents.filter((c) => c.status === "review"),
    },
    {
      id: "revise",
      title: "For Revision",
      items: filteredContents.filter((c) => c.status === "revise"),
    },
    {
      id: "approved",
      title: "Approved",
      items: filteredContents.filter((c) => c.status === "approved"),
    },
    {
      id: "scheduled",
      title: "Scheduled",
      items: filteredContents.filter((c) => c.status === "scheduled"),
    },
  ];

  const handleStatusChange = async (
    id: string,
    newStatus: ContentItem["status"],
  ) => {
    await updateStatus(id, newStatus);
  };

  const openDetail = (content: ContentItem) => {
    setSelectedContent(content);
    setIsDetailOpen(true);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Content Operations
          </h1>
          <p className="text-zinc-600 mt-1 text-sm sm:text-base">
            Unified workspace • 87 total pieces
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none sm:w-72 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 flex-shrink-0" />
            <Input
              placeholder="Search content..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40 md:w-44">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="review">In Review</SelectItem>
              <SelectItem value="revise">For Revision</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
            </SelectContent>
          </Select>

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
      <Tabs
        value={activeView}
        onValueChange={(v) =>
          setActiveView(v as "calendar" | "kanban" | "table")
        }
        className="w-full"
      >
        <TabsList className="bg-white border border-zinc-200 flex flex-wrap h-auto w-full md:w-fit p-1 gap-1">
          <TabsTrigger
            value="kanban"
            className="data-[state=active]:border-b-2 data-[state=active]:border-violet-600 data-[state=active]:bg-violet-50 flex-1 sm:flex-none justify-center text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2.5"
          >
            <LayoutDashboard className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden sm:inline">Kanban</span>
          </TabsTrigger>
          <TabsTrigger
            value="calendar"
            className="data-[state=active]:border-b-2 data-[state=active]:border-violet-600 data-[state=active]:bg-violet-50 flex-1 sm:flex-none justify-center text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2.5"
          >
            <CalendarIcon className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden sm:inline">Calendar</span>
          </TabsTrigger>
          <TabsTrigger
            value="table"
            className="data-[state=active]:border-b-2 data-[state=active]:border-violet-600 data-[state=active]:bg-violet-50 flex-1 sm:flex-none justify-center text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2.5"
          >
            <TableIcon className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden sm:inline">Table</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="kanban" className="mt-4 sm:mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 pb-4 sm:pb-8">
            {kanbanColumns.map((column) => (
              <div
                key={column.id}
                className="bg-white rounded-2xl sm:rounded-3xl border border-zinc-100 p-4 sm:p-5"
              >
                <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2">
                  <h3 className="font-semibold text-sm sm:text-base truncate min-w-0">
                    {column.title}
                  </h3>
                  <Badge variant="secondary" className="flex-shrink-0">
                    {column.items.length}
                  </Badge>
                </div>

                <div className="space-y-3">
                  {column.items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => openDetail(item)}
                      className="bg-white border border-zinc-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="font-medium text-sm sm:text-base line-clamp-2 mb-2">
                        {item.title}
                      </div>

                      <div className="text-xs sm:text-sm text-zinc-500 mb-3">
                        {item.client}
                      </div>

                      {/* Google Drive Links */}
                      {item.driveLinks && item.driveLinks.length > 0 && (
                        <div className="mb-4">
                          <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1.5">
                            Drive Files
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {item.driveLinks.map((link, idx) => (
                              <a
                                key={idx}
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1.5 text-xs bg-zinc-100 hover:bg-zinc-200 transition-colors px-3 py-1 rounded-lg text-zinc-700 truncate max-w-full"
                              >
                                <span className="text-amber-600">↗</span>
                                File {idx + 1}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-2">
                        <Badge
                          className={`${statusColors[item.status]} text-xs whitespace-nowrap`}
                        >
                          {statusLabels[item.status]}
                        </Badge>
                        <Avatar className="h-6 w-6 flex-shrink-0">
                          <AvatarFallback className="text-xs">
                            {item.assignedTo
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                  ))}

                  {column.items.length === 0 && (
                    <div className="text-center py-8 sm:py-12 text-zinc-400 text-sm">
                      No content here
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="mt-4 sm:mt-6">
          <Card className="bg-white border border-zinc-200 rounded-2xl sm:rounded-3xl">
            <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
              <CardTitle className="text-base sm:text-lg">
                May 2026 Content Calendar
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                <div className="grid grid-cols-7 gap-px bg-zinc-200 rounded-2xl overflow-hidden min-w-[640px]">
                  {Array.from({ length: 35 }).map((_, i) => {
                    const day = i - 2;
                    const date = day > 0 ? `May ${day}` : "";
                    const dayContent = filteredContents.filter((c) =>
                      c.publishDate.includes(
                        `2026-05-${day.toString().padStart(2, "0")}`,
                      ),
                    );

                    return (
                      <div
                        key={i}
                        className="bg-white min-h-[100px] sm:min-h-[140px] p-2 sm:p-3 hover:bg-zinc-50 transition-colors"
                      >
                        {date && (
                          <div className="text-[10px] sm:text-xs font-mono text-zinc-400 mb-1 sm:mb-2">
                            {date}
                          </div>
                        )}
                        <div className="space-y-1 sm:space-y-2">
                          {dayContent.slice(0, 2).map((item) => (
                            <div
                              key={item.id}
                              onClick={() => openDetail(item)}
                              className="text-[10px] sm:text-xs p-1.5 sm:p-2 bg-zinc-50 rounded-md sm:rounded-lg cursor-pointer hover:bg-white border border-transparent hover:border-zinc-200"
                            >
                              <div className="font-medium line-clamp-1">
                                {item.title}
                              </div>
                              <div className="text-[10px] text-zinc-500 mt-0.5">
                                {item.platform}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="table" className="mt-4 sm:mt-6">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-zinc-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50">
                    <th className="text-left py-3 px-3 sm:py-4 sm:px-6 font-medium text-zinc-500 text-xs sm:text-sm whitespace-nowrap">
                      Title
                    </th>
                    <th className="text-left py-3 px-3 sm:py-4 sm:px-6 font-medium text-zinc-500 text-xs sm:text-sm whitespace-nowrap">
                      Platform
                    </th>
                    <th className="text-left py-3 px-3 sm:py-4 sm:px-6 font-medium text-zinc-500 text-xs sm:text-sm whitespace-nowrap">
                      Type
                    </th>
                    <th className="text-left py-3 px-3 sm:py-4 sm:px-6 font-medium text-zinc-500 text-xs sm:text-sm whitespace-nowrap">
                      Client
                    </th>
                    <th className="text-left py-3 px-3 sm:py-4 sm:px-6 font-medium text-zinc-500 text-xs sm:text-sm whitespace-nowrap">
                      Status
                    </th>
                    <th className="text-left py-3 px-3 sm:py-4 sm:px-6 font-medium text-zinc-500 text-xs sm:text-sm whitespace-nowrap">
                      Publish Date
                    </th>
                    <th className="text-left py-3 px-3 sm:py-4 sm:px-6 font-medium text-zinc-500 text-xs sm:text-sm whitespace-nowrap">
                      Assigned
                    </th>
                    <th className="w-10 sm:w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContents.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-zinc-100 hover:bg-zinc-50 cursor-pointer transition-colors"
                      onClick={() => openDetail(item)}
                    >
                      <td className="py-3 px-3 sm:py-5 sm:px-6 font-medium text-sm sm:text-base">
                        {item.title}
                      </td>
                      <td className="py-3 px-3 sm:py-5 sm:px-6 text-zinc-600 text-xs sm:text-sm whitespace-nowrap">
                        {item.platform}
                      </td>
                      <td className="py-3 px-3 sm:py-5 sm:px-6 text-zinc-600 text-xs sm:text-sm whitespace-nowrap">
                        {item.contentType}
                      </td>
                      <td className="py-3 px-3 sm:py-5 sm:px-6 text-zinc-600 text-xs sm:text-sm whitespace-nowrap">
                        {item.client}
                      </td>
                      <td className="py-3 px-3 sm:py-5 sm:px-6">
                        <Badge
                          className={`${statusColors[item.status]} text-xs whitespace-nowrap`}
                        >
                          {statusLabels[item.status]}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 sm:py-5 sm:px-6 text-xs sm:text-sm text-zinc-600 font-mono whitespace-nowrap">
                        {item.publishDate}
                      </td>
                      <td className="py-3 px-3 sm:py-5 sm:px-6">
                        <div className="flex items-center gap-2 min-w-0">
                          <Avatar className="h-6 w-6 flex-shrink-0">
                            <AvatarFallback className="text-xs bg-zinc-100">
                              {item.assignedTo
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs sm:text-sm text-zinc-600 truncate">
                            {item.assignedTo}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 sm:py-5 sm:px-6">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-3xl lg:max-w-4xl xl:max-w-5xl h-[100dvh] sm:h-[94vh] overflow-hidden p-0 flex flex-col">
          {selectedContent && (
            <div className="flex flex-col h-full min-h-0">
              {/* Header */}
              <DialogHeader className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-3 sm:pb-5 border-b bg-white z-10 flex-shrink-0 relative">
                <DialogTitle className="text-xl sm:text-2xl lg:text-3xl leading-tight font-semibold tracking-tight break-words pr-8">
                  {selectedContent.title}
                </DialogTitle>

                <div className="flex flex-wrap items-center gap-2 mt-3 sm:mt-4">
                  <Badge
                    className={`${statusColors[selectedContent.status]} text-xs sm:text-sm font-medium px-2.5 sm:px-3 py-0.5 sm:py-1`}
                  >
                    {statusLabels[selectedContent.status]}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-xs sm:text-sm font-medium px-2.5 sm:px-3 py-0.5 sm:py-1"
                  >
                    {selectedContent.platform}
                  </Badge>
                </div>

                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-4 sm:right-6 sm:top-6 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-full h-8 w-8 sm:h-9 sm:w-9"
                  onClick={() => setIsDetailOpen(false)}
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="sr-only">Close</span>
                </Button>
              </DialogHeader>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-4 sm:pb-8 space-y-6 sm:space-y-10 min-h-0">
                {/* Drive Files / Assets */}
                {selectedContent.driveLinks &&
                  selectedContent.driveLinks.length > 0 && (
                    <div>
                      <h4 className="text-[11px] sm:text-xs font-semibold tracking-widest text-zinc-500 mb-2 sm:mb-3">
                        GOOGLE DRIVE FILES
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedContent.driveLinks.map((link, idx) => (
                          <a
                            key={idx}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-4 border border-zinc-200 hover:border-zinc-300 rounded-2xl group transition-all hover:shadow-sm"
                          >
                            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center flex-shrink-0">
                              <span className="text-xl">📁</span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-sm text-zinc-900 group-hover:text-violet-700 transition-colors line-clamp-1">
                                Asset File {idx + 1}
                              </p>
                              <p className="text-xs text-zinc-500 truncate">
                                Google Drive Link
                              </p>
                            </div>
                            <div className="text-amber-600 text-xl group-hover:translate-x-0.5 transition-transform">
                              ↗
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Caption */}
                <div>
                  <h4 className="text-[11px] sm:text-xs font-semibold tracking-widest text-zinc-500 mb-2 sm:mb-3">
                    CAPTION
                  </h4>
                  <p className="text-sm sm:text-[15px] leading-relaxed text-zinc-700">
                    {selectedContent.caption}
                  </p>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 lg:gap-x-8 gap-y-4 sm:gap-y-6">
                  <div>
                    <h4 className="text-[11px] sm:text-xs font-semibold tracking-widest text-zinc-500 mb-1.5 sm:mb-2">
                      CLIENT
                    </h4>
                    <p className="text-sm sm:text-base font-medium text-zinc-900">
                      {selectedContent.client}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-[11px] sm:text-xs font-semibold tracking-widest text-zinc-500 mb-1.5 sm:mb-2">
                      PILLAR
                    </h4>
                    <p className="text-sm sm:text-base font-medium text-zinc-900">
                      {selectedContent.pillar}
                    </p>
                  </div>
                </div>

                <Separator className="my-1 sm:my-2" />

                {/* Revision Details */}

                {(selectedContent.revisionNotes?.length > 0 ||
                  selectedContent.revisionDueDate ||
                  selectedContent.priority ||
                  selectedContent.revisionCount) && (
                  <div className="space-y-5 rounded-2xl border border-amber-200 bg-amber-50/50 p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm sm:text-base font-semibold text-amber-900">
                        Revision Details
                      </h4>

                      {selectedContent.priority && (
                        <Badge className="bg-amber-100 text-amber-700 border border-amber-200">
                          {selectedContent.priority} Priority
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedContent.revisionDueDate && (
                        <div>
                          <p className="text-[11px] uppercase tracking-widest text-zinc-500 mb-1">
                            Due Date
                          </p>
                          <p className="text-sm font-medium text-zinc-900">
                            {selectedContent.revisionDueDate}
                          </p>
                        </div>
                      )}

                      {selectedContent.revisionCount !== null && (
                        <div>
                          <p className="text-[11px] uppercase tracking-widest text-zinc-500 mb-1">
                            Revision Count
                          </p>
                          <p className="text-sm font-medium text-zinc-900">
                            {selectedContent.revisionCount}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Revision Notes */}
                    {selectedContent.revisionNotes?.length > 0 && (
                      <div>
                        <p className="text-[11px] uppercase tracking-widest text-zinc-500 mb-3">
                          Revision Notes
                        </p>

                        <div className="space-y-3">
                          {selectedContent.revisionNotes.map((note, idx) => (
                            <div
                              key={idx}
                              className="rounded-xl border border-zinc-200 bg-white p-4"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-sm text-zinc-900">
                                  {note.commenter}
                                </span>

                                <span className="text-xs text-zinc-400">
                                  {new Date(note.created_at).toLocaleString()}
                                </span>
                              </div>

                              <p className="text-sm text-zinc-700 leading-relaxed">
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
              <div className="border-t bg-white p-4 sm:p-6 lg:p-8 z-10 flex-shrink-0">
                <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                  {role === "admin" && selectedContent.status === "revise" && (
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:flex-1 h-11 sm:h-12 font-medium text-sm sm:text-base"
                      onClick={() => {
                        setIsDetailOpen(false);
                        setIsSubmitRevisionOpen(true);
                      }}
                    >
                      Submit Revision
                    </Button>
                  )}
                  {role === "client" && selectedContent.status === "review" && (
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:flex-1 h-11 sm:h-12 font-medium text-sm sm:text-base"
                      onClick={() => {
                        setIsDetailOpen(false);
                        setIsRevisionOpen(true);
                      }}
                    >
                      Request Revision
                    </Button>
                  )}
                  {role === "client" && selectedContent.status === "review" && (
                    <Button
                      size="lg"
                      className="w-full sm:flex-1 h-11 sm:h-12 font-semibold text-white shadow-lg shadow-violet-500/20 hover:shadow-xl hover:shadow-violet-500/30 transition-all active:scale-[0.985] text-sm sm:text-base"
                      style={{ backgroundColor: brandColor }}
                      onClick={() => {
                        setIsDetailOpen(false);
                        setIsApproveOpen(true);
                      }}
                    >
                      Approve
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
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
                platform: content.platform,
                content_type: content.contentType,
                client: content.client,
                assigned_to: content.assignedTo,
                content_pillar: content.pillar,
                publish_date: content.publishDate,
                gdrive_links: content.driveLinks,
              }),
            });

            const data = await res.json();

            if (!res.ok) {
              throw new Error(data.error || "Failed to create content");
            }

            const created = data.content;

            const newContent: ContentItem = {
              id: created.id,
              title: created.content_title,
              caption: created.caption,
              platform: created.platform,
              contentType: created.content_type,
              publishDate: created.publish_date,
              client: created.client,
              assignedTo: created.assigned_to,
              driveLinks: created.gdrive_links || [],
              pillar: created.content_pillar,
            };

            addContent(newContent);

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
          try {
            if (!selectedContent) return;

            const revisionNote = {
              commenter: "Karl Tan", // replace with logged in user later
              comment: request.comment,
              created_at: new Date().toISOString(),
            };

            const res = await fetch("/api/contents/revise", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: selectedContent.id,
                status: "revise",
                priority: request.priority,
                revision_due_date: request.dueDate,
                revision_count: 1, // or increment dynamically
                revision_notes: [revisionNote],
              }),
            });

            const data = await res.json();

            if (!res.ok) {
              throw new Error(data.error || "Failed to update content");
            }

            console.log("Updated:", data);

            // optional local UI update
            handleStatusChange(selectedContent.id, "revise");

            setIsRevisionOpen(false);

            // refetch latest data
            fetchContents();
          } catch (error) {
            console.error(error);

            alert(
              error instanceof Error ? error.message : "Something went wrong",
            );
          }
        }}
        contentTitle={selectedContent?.title}
        contentPlatform={selectedContent?.platform}
        assignedTo={selectedContent?.assignedTo || "Team Member"}
        brandColor={brandColor}
      />
      <SubmitRevisionModal
        isOpen={isSubmitRevisionOpen}
        onClose={() => setIsSubmitRevisionOpen(false)}
        onSubmit={async (update) => {
          try {
            const res = await fetch("/api/contents/submit-revision", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(update),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to update");

            // Update local store
            handleStatusChange(update.id, "review");
            fetchContents(); // Refresh to get updated data

            setIsSubmitRevisionOpen(false);
          } catch (error) {
            console.error(error);
            alert(
              error instanceof Error ? error.message : "Something went wrong",
            );
          }
        }}
        content={selectedContent}
        brandColor={brandColor}
        adminName="Admin" // or from auth context
      />
      <ApproveConfirmDialog
        isOpen={isApproveOpen}
        onClose={() => setIsApproveOpen(false)}
        onConfirm={async () => {
          if (!selectedContent) return;

          const res = await fetch("/api/contents/approve", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: selectedContent.id }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Failed to approve");

          // Update local state
          handleStatusChange(selectedContent.id, "approved");
          fetchContents();

          setIsApproveOpen(false);
        }}
        contentTitle={selectedContent?.title}
        contentPlatform={selectedContent?.platform}
        clientName={selectedContent?.client}
        brandColor={brandColor}
      />
    </div>
  );
}
