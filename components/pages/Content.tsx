'use client';

import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  LayoutDashboard,
  Table as TableIcon,
  Plus,
  Search,
  MoreHorizontal,
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
  thumbnail?: string;
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
    thumbnail: "https://picsum.photos/id/1015/400/300",
    pillar: "Product Launch",
  },
  {
    id: "c2",
    title: "Q2 Performance Report Teaser",
    caption: "Numbers don't lie. Results do.",
    platform: "LinkedIn",
    contentType: "Carousel",
    status: "approval",
    publishDate: "2026-05-27",
    client: "Nexus Tech",
    assignedTo: "Marcus Rivera",
    thumbnail: "https://picsum.photos/id/201/400/300",
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
    thumbnail: "https://picsum.photos/id/237/400/300",
    pillar: "Educational",
  },
];

const mockComments: Comment[] = [
  { id: "com1", user: "Sarah Chen", comment: "Looks great! Just add brand logo at the end.", timestamp: "2 hours ago" },
  { id: "com2", user: "David Kim", comment: "Approved from client side.", timestamp: "Yesterday" },
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
  const [activeView, setActiveView] = useState<"kanban" | "calendar" | "table">("kanban");
  const [contents, setContents] = useState(mockContents);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredContents = contents.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const kanbanColumns = [
    { id: "draft", title: "Draft", items: filteredContents.filter(c => c.status === "draft") },
    { id: "review", title: "Internal Review", items: filteredContents.filter(c => c.status === "review") },
    { id: "approval", title: "For Approval", items: filteredContents.filter(c => c.status === "approval") },
    { id: "approved", title: "Approved", items: filteredContents.filter(c => c.status === "approved") },
    { id: "scheduled", title: "Scheduled", items: filteredContents.filter(c => c.status === "scheduled") },
  ];

  const handleStatusChange = (id: string, newStatus: ContentItem["status"]) => {
    setContents(prev => prev.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    ));
  };

  const openDetail = (content: ContentItem) => {
    setSelectedContent(content);
    setIsDetailOpen(true);
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Content Operations</h1>
          <p className="text-zinc-600 mt-1">Unified workspace • 87 total pieces</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-80">
            <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search content, clients..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-44">
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

          <Button style={{ backgroundColor: brandColor }} className="text-white">
            <Plus className="mr-2 h-4 w-4" />
            New Content
          </Button>
        </div>
      </div>

      {/* View Tabs */}
      <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)} className="w-full">
        <TabsList className="bg-white border border-zinc-200">
          <TabsTrigger value="kanban" className="data-[state=active]:border-b-2 data-[state=active]:border-violet-600">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Kanban
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="table">
            <TableIcon className="mr-2 h-4 w-4" />
            Table
          </TabsTrigger>
        </TabsList>

        {/* Kanban View */}
        <TabsContent value="kanban" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 overflow-x-auto pb-8">
            {kanbanColumns.map((column) => (
              <div key={column.id} className="bg-white rounded-3xl border border-zinc-100 p-5 min-w-[280px]">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold">{column.title}</h3>
                  <Badge variant="secondary">{column.items.length}</Badge>
                </div>

                <div className="space-y-3">
                  {column.items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => openDetail(item)}
                      className="bg-white border border-zinc-200 rounded-2xl p-4 hover:shadow-md transition-all cursor-pointer"
                    >
                      {item.thumbnail && (
                        <img src={item.thumbnail} alt={item.title} className="w-full h-32 object-cover rounded-xl mb-4" />
                      )}
                      <div className="font-medium line-clamp-2 mb-2">{item.title}</div>
                      <div className="text-sm text-zinc-500 mb-3">{item.client}</div>

                      <div className="flex items-center justify-between">
                        <Badge className={statusColors[item.status]}>
                          {statusLabels[item.status]}
                        </Badge>
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {item.assignedTo.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                  ))}

                  {column.items.length === 0 && (
                    <div className="text-center py-12 text-zinc-400">No content here</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Calendar & Table Views (same structure as before) */}
        <TabsContent value="calendar" className="mt-6">
          <Card className="bg-white border border-zinc-200 rounded-3xl">
            <CardHeader>
              <CardTitle>May 2026 Content Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-px bg-zinc-200 rounded-2xl overflow-hidden">
                {Array.from({ length: 35 }).map((_, i) => {
                  const day = i - 2; // offset for demo
                  const date = day > 0 ? `May ${day}` : "";
                  const dayContent = filteredContents.filter((c) =>
                    c.publishDate.includes(
                      `2026-05-${day.toString().padStart(2, "0")}`,
                    ),
                  );

                  return (
                    <div
                      key={i}
                      className="bg-white min-h-[140px] p-3 hover:bg-zinc-50 transition-colors"
                    >
                      {date && (
                        <div className="text-xs font-mono text-zinc-400 mb-2">
                          {date}
                        </div>
                      )}
                      <div className="space-y-2">
                        {dayContent.slice(0, 2).map((item) => (
                          <div
                            key={item.id}
                            onClick={() => openDetail(item)}
                            className="text-xs p-2 bg-zinc-50 rounded-lg cursor-pointer hover:bg-white border border-transparent hover:border-zinc-200"
                          >
                            <div className="font-medium line-clamp-1">
                              {item.title}
                            </div>
                            <div className="text-[10px] text-zinc-500">
                              {item.platform}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="table" className="mt-6">
          <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50">
                    <th className="text-left py-4 px-6 font-medium text-zinc-500 text-sm">
                      Title
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-zinc-500 text-sm">
                      Platform
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-zinc-500 text-sm">
                      Type
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-zinc-500 text-sm">
                      Client
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-zinc-500 text-sm">
                      Status
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-zinc-500 text-sm">
                      Publish Date
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-zinc-500 text-sm">
                      Assigned
                    </th>
                    <th className="w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContents.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-zinc-100 hover:bg-zinc-50 cursor-pointer transition-colors"
                      onClick={() => openDetail(item)}
                    >
                      <td className="py-5 px-6 font-medium">{item.title}</td>
                      <td className="py-5 px-6 text-zinc-600">
                        {item.platform}
                      </td>
                      <td className="py-5 px-6 text-zinc-600">
                        {item.contentType}
                      </td>
                      <td className="py-5 px-6 text-zinc-600">{item.client}</td>
                      <td className="py-5 px-6">
                        <Badge className={statusColors[item.status]}>
                          {statusLabels[item.status]}
                        </Badge>
                      </td>
                      <td className="py-5 px-6 text-sm text-zinc-600 font-mono">
                        {item.publishDate}
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs bg-zinc-100">
                              {item.assignedTo
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-zinc-600">
                            {item.assignedTo}
                          </span>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <Button
                          variant="ghost"
                          size="icon"
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

      {/* Content Detail Sheet */}
      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          {/* Your existing detail sheet content remains unchanged */}
          {selectedContent && (
            <>
              <SheetHeader className="mb-8">
                <SheetTitle className="text-2xl">{selectedContent.title}</SheetTitle>
                <div className="flex gap-3 mt-2">
                  <Badge className={statusColors[selectedContent.status]}>
                    {statusLabels[selectedContent.status]}
                  </Badge>
                  <Badge variant="outline">{selectedContent.platform}</Badge>
                </div>
              </SheetHeader>

              {selectedContent.thumbnail && (
                <img
                  src={selectedContent.thumbnail}
                  alt="preview"
                  className="w-full aspect-video object-cover rounded-2xl mb-8"
                />
              )}

              <div className="space-y-8">
                <div>
                  <h4 className="text-sm font-medium text-zinc-500 mb-2">
                    CAPTION
                  </h4>
                  <p className="text-zinc-700 leading-relaxed">
                    {selectedContent.caption}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-zinc-500 mb-1">
                      CLIENT
                    </h4>
                    <p>{selectedContent.client}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-zinc-500 mb-1">
                      PILLAR
                    </h4>
                    <p>{selectedContent.pillar}</p>
                  </div>
                </div>

                <Separator />

                {/* Comments */}
                <div>
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    Comments
                    <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-500">
                      {mockComments.length}
                    </span>
                  </h4>
                  <ScrollArea className="h-80">
                    <div className="space-y-6 pr-4">
                      {mockComments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {comment.user
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <span className="font-medium">
                                {comment.user}
                              </span>
                              <span className="text-xs text-zinc-400">
                                {comment.timestamp}
                              </span>
                            </div>
                            <p className="text-sm text-zinc-600 mt-1">
                              {comment.comment}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>

              <div className="flex gap-3 mt-12 pt-8 border-t">
                <Button variant="outline" className="flex-1">
                  Request Revision
                </Button>
                <Button
                  className="flex-1 text-white"
                  style={{ backgroundColor: brandColor }}
                  onClick={() => {
                    if (selectedContent) {
                      handleStatusChange(selectedContent.id, "approved");
                      setIsDetailOpen(false);
                    }
                  }}
                >
                  Approve &amp; Schedule
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}