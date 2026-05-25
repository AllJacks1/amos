"use client";

import React, { useState } from "react";
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

const brandColor = "#430062";

// ==================== TYPES ====================
interface ContentItem {
  id: string;
  title: string;
  caption: string;
  platform: string;
  contentType: string;
  status: "draft" | "review" | "approval" | "approved" | "scheduled" | "posted";
  publishDate: string;
  client: string;
  assignedTo: string;
  driveLinks: string[];
  pillar: string;
}

interface Comment {
  id: string;
  user: string;
  comment: string;
  timestamp: string;
}

// ==================== MOCK DATA ====================
const mockContents: ContentItem[] = [
  {
    id: "c1",
    title: "Summer Collection Launch Reel",
    caption: "Get ready for our boldest summer yet 🌞",
    platform: "Instagram",
    contentType: "Reel",
    status: "scheduled",
    publishDate: "2026-05-24",
    client: "Lumina Fashion",
    assignedTo: "Sarah Chen",
    driveLinks: [
      "https://drive.google.com/file/d/1x7vK9pL2mNqR8tYvUjW3xZ5aB7cD9eF/view",
      "https://drive.google.com/file/d/1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sT1u/view",
    ],
    pillar: "Product Launch",
  },
  {
    id: "c2",
    title: "Q2 Performance Report Teaser",
    caption: "Numbers don't lie. Results do.",
    platform: "LinkedIn",
    contentType: "Carousel",
    status: "posted",
    publishDate: "2026-05-27",
    client: "Nexus Tech",
    assignedTo: "Marcus Rivera",
    driveLinks: [
      "https://drive.google.com/file/d/1odwTxBNBZOOaRJfxgmCPC4eJzm-n7pQR/view?usp=sharing",
    ],
    pillar: "Thought Leadership",
  },
  {
    id: "c3",
    title: "Wellness Tips Monday",
    caption: "Small habits. Big impact.",
    platform: "Instagram",
    contentType: "Static",
    status: "review",
    publishDate: "2026-05-26",
    client: "Bloom Wellness",
    assignedTo: "Aisha Patel",
    driveLinks: [
      "https://drive.google.com/file/d/3y8wL5qM2nPrS9uZvXkW5yA7bC9dE1fH/view",
      "https://drive.google.com/file/d/4z9xM6rN3oQsT0vAwYlX6zB8cD0eF2gI/view",
    ],
    pillar: "Educational",
  },
];

const mockComments: Comment[] = [
  {
    id: "com1",
    user: "Sarah Chen",
    comment: "Looks great! Just add brand logo at the end.",
    timestamp: "2 hours ago",
  },
  {
    id: "com2",
    user: "David Kim",
    comment: "Approved from client side.",
    timestamp: "Yesterday",
  },
];

const statusColors = {
  draft: "bg-zinc-100 text-zinc-700",
  review: "bg-amber-100 text-amber-700",
  approval: "bg-rose-100 text-rose-700",
  approved: "bg-emerald-100 text-emerald-700",
  scheduled: "bg-blue-100 text-blue-700",
  posted: "bg-purple-100 text-purple-700",
};

const statusLabels = {
  draft: "Draft",
  review: "Internal Review",
  approval: "For Approval",
  approved: "Approved",
  scheduled: "Scheduled",
  posted: "Posted",
};

export default function ContentOperations() {
  const [activeView, setActiveView] = useState<"kanban" | "calendar" | "table">(
    "kanban",
  );
  const [contents, setContents] = useState(mockContents);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(
    null,
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredContents = contents.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const kanbanColumns = [
    {
      id: "draft",
      title: "Draft",
      items: filteredContents.filter((c) => c.status === "draft"),
    },
    {
      id: "review",
      title: "Internal Review",
      items: filteredContents.filter((c) => c.status === "review"),
    },
    {
      id: "approval",
      title: "For Approval",
      items: filteredContents.filter((c) => c.status === "approval"),
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

  const handleStatusChange = (id: string, newStatus: ContentItem["status"]) => {
    setContents((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item,
      ),
    );
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
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="review">In Review</SelectItem>
              <SelectItem value="approval">For Approval</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
            </SelectContent>
          </Select>

          <Button
            style={{ backgroundColor: brandColor }}
            className="text-white w-full sm:w-auto"
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

                {/* Comments Section */}
                <div className="flex flex-col min-h-[200px] sm:min-h-0">
                  <div className="flex items-center justify-between mb-3 sm:mb-5">
                    <h4 className="font-semibold text-base sm:text-lg flex items-center gap-2">
                      Comments
                      <span className="text-xs sm:text-sm font-medium px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-500">
                        {mockComments.length}
                      </span>
                    </h4>
                  </div>

                  <ScrollArea className="flex-1 pr-2 min-h-0">
                    <div className="space-y-4 sm:space-y-6 pb-4">
                      {mockComments.map((comment) => (
                        <div key={comment.id} className="flex gap-2.5 sm:gap-3">
                          <Avatar className="h-8 w-8 sm:h-9 sm:w-10 flex-shrink-0">
                            <AvatarFallback className="text-xs sm:text-sm font-medium">
                              {comment.user
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-semibold text-sm sm:text-base text-zinc-900 truncate">
                                {comment.user}
                              </span>
                              <span className="text-[11px] sm:text-xs text-zinc-400 whitespace-nowrap flex-shrink-0">
                                {comment.timestamp}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-zinc-600 leading-relaxed">
                              {comment.comment}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="border-t bg-white p-4 sm:p-6 lg:p-8 z-10 flex-shrink-0">
                <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:flex-1 h-11 sm:h-12 font-medium text-sm sm:text-base"
                  >
                    Request Revision
                  </Button>
                  <Button
                    size="lg"
                    className="w-full sm:flex-1 h-11 sm:h-12 font-semibold text-white shadow-lg shadow-violet-500/20 hover:shadow-xl hover:shadow-violet-500/30 transition-all active:scale-[0.985] text-sm sm:text-base"
                    style={{ backgroundColor: brandColor }}
                    onClick={() => {
                      if (selectedContent) {
                        handleStatusChange(selectedContent.id, "approved");
                        setIsDetailOpen(false);
                      }
                    }}
                  >
                    Approve & Schedule
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
