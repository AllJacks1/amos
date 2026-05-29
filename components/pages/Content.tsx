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
  FileText,
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

import CalendarView from "../sections/CalendarView";
import { ContentItem, useContentStore } from "@/store/useContentStore";
import { useAuthStore } from "@/store/useAuthStore";
import EditContentModal from "../sections/EditContentModal";
import { useClientStore } from "@/store/clientStore";
import { useUsersStore } from "@/store/useUsersStore";

const brandColor = "#430062";

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
  const user = useAuthStore((state) => state.user);
  const role = user?.role || "";

  const { clients, fetchClients } = useClientStore();
  const { users, fetchUsers } = useUsersStore();

  const [activeView, setActiveView] = useState<"kanban" | "calendar" | "table">(
    "kanban",
  );

  const { contents, fetchContents, updateStatus, addContent, loading } =
    useContentStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [clientFilter, setClientFilter] = useState<string>("all");
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(
    null,
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddContentOpen, setIsAddContentOpen] = useState(false);

  const uniqueClients = [
    ...new Set(contents.map((item) => item.client).filter(Boolean)),
  ];

  const filteredContents = contents.filter((item) => {
    const matchesSearch =
      (item.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.client || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;

    const matchesClient =
      clientFilter === "all" || item.client === clientFilter;

    return matchesSearch && matchesStatus && matchesClient;
  });

  const [isRevisionOpen, setIsRevisionOpen] = useState(false);
  const [isSubmitRevisionOpen, setIsSubmitRevisionOpen] = useState(false);
  const [isApproveOpen, setIsApproveOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // You can make this adjustable

  const totalPages = Math.ceil(filteredContents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedContents = filteredContents.slice(startIndex, endIndex);

  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    fetchContents();
    fetchClients();
    fetchUsers();
  }, [fetchContents, fetchClients, fetchUsers]);

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

  const openEdit = () => {
    setIsDetailOpen(false);
    setIsEditOpen(true);
  }

  const getInitials = (
    name?: string | number | boolean | null | undefined,
  ): string => {
    // Convert to string first and handle all edge cases
    const nameStr = typeof name === "string" ? name : name?.toString() || "";

    if (!nameStr.trim()) return "U";

    return nameStr
      .trim()
      .split(" ")
      .map((word) => word[0] || "")
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const clientLookup = Object.fromEntries(
    clients.map((c) => [c.id, c.company_name]),
  );

  const userLookup = Object.fromEntries(users.map((u) => [u.id, u.fullname]));

  console.log("Mapped Contents:", contents);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Content Operations
          </h1>
          <p className="text-zinc-600 mt-1 text-sm sm:text-base">
            Unified workspace • {filteredContents.length} total piece
            {filteredContents.length !== 1 ? "s" : ""}
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
              {/* <SelectItem value="scheduled">Scheduled</SelectItem> */}
            </SelectContent>
          </Select>

          {role === "admin" && (
            <Select value={clientFilter} onValueChange={setClientFilter}>
              <SelectTrigger className="w-full sm:w-44 md:w-52">
                <SelectValue placeholder="All Clients" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>

                {uniqueClients.map((client) => (
                  <SelectItem key={client} value={client}>
                    {clientLookup[client]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {role === "admin" && (
            <Button
              style={{ backgroundColor: brandColor }}
              className="text-white w-full sm:w-auto"
              onClick={() => setIsAddContentOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4 flex-shrink-0" />
              New Content
            </Button>
          )}
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
                        {clientLookup[item.client]}
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
                            {getInitials(userLookup[item.assignedTo])}
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
          <CalendarView contents={filteredContents} onOpenDetail={openDetail} />
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
                      Platforms
                    </th>
                    <th className="text-left py-3 px-3 sm:py-4 sm:px-6 font-medium text-zinc-500 text-xs sm:text-sm whitespace-nowrap">
                      Content Types
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
                  {paginatedContents.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-zinc-100 hover:bg-zinc-50 cursor-pointer transition-colors"
                      onClick={() => openDetail(item)}
                    >
                      <td className="py-3 px-3 sm:py-5 sm:px-6 font-medium text-sm sm:text-base">
                        {item.title}
                      </td>

                      {/* Platforms - Multiple Badges */}
                      <td className="py-3 px-3 sm:py-5 sm:px-6">
                        <div className="flex flex-wrap gap-1">
                          {item.platforms && item.platforms.length > 0 ? (
                            <>
                              {item.platforms
                                .slice(0, 2)
                                .map((platform: string) => (
                                  <Badge
                                    key={platform}
                                    variant="outline"
                                    className="text-[10px] font-medium px-2 py-0.5"
                                  >
                                    {platform}
                                  </Badge>
                                ))}
                              {item.platforms.length > 2 && (
                                <Badge
                                  variant="outline"
                                  className="text-[10px] px-2 py-0.5"
                                >
                                  +{item.platforms.length - 2}
                                </Badge>
                              )}
                            </>
                          ) : (
                            <span className="text-zinc-400 text-sm">—</span>
                          )}
                        </div>
                      </td>

                      {/* Content Types - Multiple Badges */}
                      <td className="py-3 px-3 sm:py-5 sm:px-6">
                        <div className="flex flex-wrap gap-1">
                          {item.contentTypes && item.contentTypes.length > 0 ? (
                            <>
                              {item.contentTypes
                                .slice(0, 2)
                                .map((type: string) => (
                                  <Badge
                                    key={type}
                                    variant="secondary"
                                    className="text-[10px] bg-zinc-100 text-zinc-700 px-2 py-0.5"
                                  >
                                    {type}
                                  </Badge>
                                ))}
                              {item.contentTypes.length > 2 && (
                                <Badge
                                  variant="secondary"
                                  className="text-[10px] bg-zinc-100 px-2 py-0.5"
                                >
                                  +{item.contentTypes.length - 2}
                                </Badge>
                              )}
                            </>
                          ) : (
                            <span className="text-zinc-400 text-sm">—</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-3 sm:py-5 sm:px-6 text-zinc-600 text-xs sm:text-sm whitespace-nowrap">
                        {clientLookup[item.client]}
                      </td>

                      <td className="py-3 px-3 sm:py-5 sm:px-6">
                        <Badge
                          className={`${statusColors[item.status] || "bg-zinc-100 text-zinc-700"} text-xs whitespace-nowrap`}
                        >
                          {statusLabels[item.status] || item.status}
                        </Badge>
                      </td>

                      <td className="py-3 px-3 sm:py-5 sm:px-6 text-xs sm:text-sm text-zinc-600 font-mono whitespace-nowrap">
                        {item.publishDate}
                      </td>

                      <td className="py-3 px-3 sm:py-5 sm:px-6">
                        <div className="flex items-center gap-2 min-w-0">
                          <Avatar className="h-6 w-6 flex-shrink-0">
                            <AvatarFallback className="text-xs bg-zinc-100">
                              {getInitials(userLookup[item.assignedTo])}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs sm:text-sm text-zinc-600 truncate">
                            {userLookup[item.assignedTo]}
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

            {/* Pagination Controls */}
            <div className="flex items-center justify-between border-t border-zinc-100 px-4 py-4 sm:px-6">
              <div className="text-sm text-zinc-500">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, filteredContents.length)} of{" "}
                <span className="font-medium text-zinc-700">
                  {filteredContents.length}
                </span>{" "}
                entries
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-8"
                      >
                        {page}
                      </Button>
                    ),
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
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
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-8">
                    <DialogTitle className="text-xl sm:text-2xl lg:text-3xl leading-tight font-semibold tracking-tight break-words">
                      {selectedContent.title}
                    </DialogTitle>

                    <div className="flex flex-wrap items-center gap-2 mt-3 sm:mt-4">
                      <Badge
                        className={`${statusColors[selectedContent.status]} text-xs sm:text-sm font-medium px-2.5 sm:px-3 py-0.5 sm:py-1`}
                      >
                        {statusLabels[selectedContent.status]}
                      </Badge>

                      {selectedContent.platforms?.map((platform: string) => (
                        <Badge
                          key={platform}
                          variant="outline"
                          className="text-xs sm:text-sm"
                        >
                          {platform}
                        </Badge>
                      ))}

                      {selectedContent.contentTypes?.map((type: string) => (
                        <Badge
                          key={type}
                          variant="secondary"
                          className="text-xs sm:text-sm bg-zinc-100"
                        >
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="hidden sm:flex items-center gap-2 h-9"
                      onClick={openEdit}
                    >
                      <FileText className="h-4 w-4" />
                      Edit
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 sm:h-9 sm:w-9 rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                      onClick={() => setIsDetailOpen(false)}
                    >
                      <X className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </div>
                </div>
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

                  {selectedContent.caption ? (
                    <div
                      className="text-sm sm:text-[15px] leading-relaxed text-zinc-700 prose prose-zinc max-w-none prose-headings:text-zinc-800 prose-strong:text-zinc-800 prose-a:text-blue-600"
                      dangerouslySetInnerHTML={{
                        __html: selectedContent.caption,
                      }}
                    />
                  ) : (
                    <p className="text-zinc-500 italic">No caption provided.</p>
                  )}
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 lg:gap-x-8 gap-y-4 sm:gap-y-6">
                  <div>
                    <h4 className="text-[11px] sm:text-xs font-semibold tracking-widest text-zinc-500 mb-1.5 sm:mb-2">
                      CLIENT
                    </h4>
                    <p className="text-sm sm:text-base font-medium text-zinc-900">
                      {clientLookup[selectedContent.client]}
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
                  <div>
                    <h4 className="text-[11px] sm:text-xs font-semibold tracking-widest text-zinc-500 mb-1.5 sm:mb-2">
                      PUBLISH DATE
                    </h4>
                    <p className="text-sm sm:text-base font-medium text-zinc-900">
                      {selectedContent.publishDate}
                    </p>
                  </div>
                  {user?.role === "admin" && (
                    <div>
                      <h4 className="text-[11px] sm:text-xs font-semibold tracking-widest text-zinc-500 mb-1.5 sm:mb-2">
                        ASSIGNED TO
                      </h4>
                      <p className="text-sm sm:text-base font-medium text-zinc-900">
                        {userLookup[selectedContent.assignedTo]}
                      </p>
                    </div>
                  )}
                </div>

                <Separator className="my-1 sm:my-2" />

                {/* Revision Details */}
                {/* Revision Details Section */}
                {((selectedContent.revisionNotes?.length ?? 0) > 0 ||
                  selectedContent.revisionDueDate ||
                  selectedContent.priority ||
                  typeof selectedContent.revisionCount === "number") && (
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
                            {new Date(
                              selectedContent.revisionDueDate,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      )}

                      {typeof selectedContent.revisionCount === "number" && (
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
                    {(selectedContent.revisionNotes?.length ?? 0) > 0 && (
                      <div>
                        <p className="text-[11px] uppercase tracking-widest text-zinc-500 mb-3">
                          Revision Notes
                        </p>

                        <div className="space-y-3">
                          {selectedContent.revisionNotes?.map((note, idx) => (
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

            const newContent: ContentItem = {
              id: created.id,
              title: created.title,

              caption: created.caption || "",
              platforms: created.platform || "",
              contentTypes: created.content_type || "",
              publishDate: created.publish_date || "",

              client: created.client || "",

              status: created.status || "review",

              assignedTo: created.assigned_to || "",

              driveLinks: created.gdrive_links || [],
              pillar: created.content_pillar || "",
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
              commenter: user?.primary_contact_name, // replace with logged in user later
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
                clientName: user?.primary_contact_name || "Client",
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
        contentPlatforms={selectedContent?.platforms}
        assignedTo={selectedContent?.assignedTo || ""}
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
        adminName={user?.fullname?.toString() || "Admin"}
      />
      <ApproveConfirmDialog
        isOpen={isApproveOpen}
        onClose={() => setIsApproveOpen(false)}
        onConfirm={async () => {
          if (!selectedContent) return;

          const res = await fetch("/api/contents/approve", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: selectedContent.id,
              approverName: user?.primary_contact_name || "Client",
            }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Failed to approve");

          // Update local state
          handleStatusChange(selectedContent.id, "approved");
          fetchContents();

          setIsApproveOpen(false);
        }}
        contentTitle={selectedContent?.title}
        platforms={selectedContent?.platforms}
        clientName={selectedContent?.client}
        brandColor={brandColor}
      />
      <EditContentModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onUpdate={async (id: string, updatedData) => {
          try {
            // console.log("Updating content with ID:", id, "Data:", updatedData);
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

            // ✅ FIXED: Proper type casting + refresh
            await fetchContents(); // Best way - refresh from store

            // Update selected content safely
            setSelectedContent((prev) => {
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
                // Keep original status unless you explicitly update it
                status: prev.status,
                // Preserve other fields that might not be in updatedData
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
        content={selectedContent!}
        brandColor={brandColor}
      />
    </div>
  );
}
