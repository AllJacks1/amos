"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Clock,
  FileText,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Activity,
  Calendar,
  User,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

const CONTENT_BRAND = "#430062";

/* ───────── TYPES ───────── */
interface LogEntry {
  id: string;
  created_at: string;
  activity: string;
}

/* ───────── MOCK DATA (replace with API call) ───────── */
const MOCK_LOGS: LogEntry[] = [
  {
    id: "log_001",
    created_at: "2026-06-02T20:15:00+08:00",
    activity: "User 'admin@amos.com' approved content 'Summer Campaign Launch'",
  },
  {
    id: "log_002",
    created_at: "2026-06-02T19:45:00+08:00",
    activity: "User 'admin@amos.com' created new client 'Acme Corp'",
  },
  {
    id: "log_003",
    created_at: "2026-06-02T18:30:00+08:00",
    activity: "Content 'Product Video Reel' status changed to 'Needs Revision'",
  },
  {
    id: "log_004",
    created_at: "2026-06-02T17:00:00+08:00",
    activity: "User 'sarah@amos.com' submitted revision for 'Holiday Post'",
  },
  {
    id: "log_005",
    created_at: "2026-06-02T16:20:00+08:00",
    activity: "User 'admin@amos.com' deactivated member 'john@amos.com'",
  },
  {
    id: "log_006",
    created_at: "2026-06-02T14:10:00+08:00",
    activity: "Client 'Globex Inc' updated password",
  },
  {
    id: "log_007",
    created_at: "2026-06-02T11:30:00+08:00",
    activity: "Content 'Brand Awareness Q3' published to Instagram",
  },
  {
    id: "log_008",
    created_at: "2026-06-02T09:00:00+08:00",
    activity: "User 'admin@amos.com' added member 'mike@amos.com' as Creative",
  },
  {
    id: "log_009",
    created_at: "2026-06-01T22:45:00+08:00",
    activity: "Content 'TikTok Trend Video' moved to 'Approved'",
  },
  {
    id: "log_010",
    created_at: "2026-06-01T20:00:00+08:00",
    activity: "Client 'Stark Industries' status changed to 'Paused'",
  },
  {
    id: "log_011",
    created_at: "2026-06-01T16:30:00+08:00",
    activity: "User 'admin@amos.com' deleted content 'Old Campaign Draft'",
  },
  {
    id: "log_012",
    created_at: "2026-06-01T12:00:00+08:00",
    activity: "System backup completed successfully",
  },
];

/* ───────── HELPERS ───────── */

/**
 * Format a date string to Asia/Manila timezone with relative time
 */
const formatManilaTime = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    const now = new Date();

    // Format to Asia/Manila
    const manilaFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Manila",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    // Calculate relative time
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    let relative = "";
    if (diffMins < 1) relative = "Just now";
    else if (diffMins < 60) relative = `${diffMins}m ago`;
    else if (diffHours < 24) relative = `${diffHours}h ago`;
    else if (diffDays === 1) relative = "Yesterday";
    else relative = `${diffDays}d ago`;

    return `${manilaFormatter.format(date)} · ${relative}`;
  } catch {
    return dateStr;
  }
};

/**
 * Extract entity type from activity string for badge coloring
 */
const getActivityType = (
  activity: string,
): { label: string; color: string } => {
  const lower = activity.toLowerCase();
  if (lower.includes("approv")) return { label: "Approval", color: "#10b981" };
  if (lower.includes("creat") || lower.includes("add"))
    return { label: "Create", color: "#0ea5e9" };
  if (lower.includes("delet") || lower.includes("deactiv"))
    return { label: "Delete", color: "#ef4444" };
  if (lower.includes("updat") || lower.includes("chang"))
    return { label: "Update", color: "#f59e0b" };
  if (lower.includes("submit") || lower.includes("revis"))
    return { label: "Revision", color: "#8b5cf6" };
  if (lower.includes("publish") || lower.includes("post"))
    return { label: "Publish", color: "#06b6d4" };
  if (lower.includes("backup") || lower.includes("system"))
    return { label: "System", color: "#71717a" };
  return { label: "Activity", color: "#430062" };
};

/* ───────── MAIN COMPONENT ───────── */
export default function LogsModule() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  /* ───────── FETCH LOGS (API) ───────── */
  const fetchLogs = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/logs/fetch-logs");

      if (!res.ok) {
        throw new Error("Failed to fetch logs");
      }

      const data = await res.json();

      setLogs(data.logs ?? []);
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  /* ───────── SORTING: Newest first ───────── */
  const sortedLogs = useMemo(() => {
    return [...logs].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }, [logs]);

  /* ───────── FILTERING ───────── */
  const filteredLogs = useMemo(() => {
    const searchValue = String(searchTerm ?? "")
      .toLowerCase()
      .trim();
    if (!searchValue) return sortedLogs;

    return sortedLogs.filter((log) => {
      const activity = String(log?.activity ?? "").toLowerCase();
      const id = String(log?.id ?? "").toLowerCase();
      const date = formatManilaTime(log.created_at).toLowerCase();
      return (
        activity.includes(searchValue) ||
        id.includes(searchValue) ||
        date.includes(searchValue)
      );
    });
  }, [sortedLogs, searchTerm]);

  /* ───────── PAGINATION ───────── */
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  /* ───────── RENDER ───────── */
  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      {/* ═══════ HEADER ═══════ */}
      <div className="rounded-2xl border border-zinc-200/80 bg-white/90 p-4 shadow-sm ring-1 ring-black/[0.03] backdrop-blur-sm sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="relative sm:w-72 md:w-182">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 shrink-0 text-zinc-400" />
              <Input
                placeholder="Search logs..."
                className="h-10 w-full rounded-xl border-zinc-200/80 bg-zinc-50/50 pl-10 shadow-sm focus-visible:ring-[#430062]/15 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            
            <Button
              variant="outline"
              size="sm"
              onClick={fetchLogs}
              disabled={loading}
              className="h-10 rounded-xl border-zinc-200/80 hover:bg-zinc-50 hover:border-zinc-300"
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* ═══════ KPI STRIP ═══════ */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
        {(
          [
            {
              label: "Total Logs",
              count: logs.length,
              icon: FileText,
              color: CONTENT_BRAND,
            },
            {
              label: "Today",
              count: logs.filter((l) => {
                const d = new Date(l.created_at);
                const now = new Date();
                return (
                  d.getDate() === now.getDate() &&
                  d.getMonth() === now.getMonth() &&
                  d.getFullYear() === now.getFullYear()
                );
              }).length,
              icon: Calendar,
              color: "#0ea5e9",
            },
            {
              label: "Approvals",
              count: logs.filter((l) =>
                l.activity.toLowerCase().includes("approv"),
              ).length,
              icon: Activity,
              color: "#10b981",
            },
            {
              label: "Updates",
              count: logs.filter(
                (l) =>
                  l.activity.toLowerCase().includes("updat") ||
                  l.activity.toLowerCase().includes("chang"),
              ).length,
              icon: Clock,
              color: "#f59e0b",
            },
          ] as const
        ).map((stat) => (
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
              <span className="text-sm font-medium text-zinc-600">
                {stat.label}
              </span>
            </div>
            <div className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 tabular-nums sm:text-4xl">
              {stat.count}
            </div>
          </div>
        ))}
      </div>

      {/* ═══════ LOGS TABLE ═══════ */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm ring-1 ring-black/[0.03]">
        <div className="border-b border-zinc-100 px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-zinc-900 sm:text-lg">
                All Activity
              </h2>
              <p className="text-sm text-zinc-500">
                Sorted by newest first · Asia/Manila (GMT+8)
              </p>
            </div>
            <Badge
              variant="secondary"
              className="text-xs bg-zinc-100 text-zinc-600"
            >
              {filteredLogs.length} result
              {filteredLogs.length !== 1 ? "s" : ""}
            </Badge>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-zinc-100 bg-zinc-50 hover:bg-zinc-50">
                <TableHead className="py-3 px-3 sm:py-4 sm:px-6 text-xs sm:text-sm font-medium text-zinc-500 whitespace-nowrap w-16">
                  ID
                </TableHead>
                <TableHead className="py-3 px-3 sm:py-4 sm:px-6 text-xs sm:text-sm font-medium text-zinc-500 whitespace-nowrap">
                  Activity
                </TableHead>
                <TableHead className="py-3 px-3 sm:py-4 sm:px-6 text-xs sm:text-sm font-medium text-zinc-500 whitespace-nowrap w-48">
                  Timestamp
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="h-8 w-8 animate-spin rounded-full border-3 border-zinc-200 border-t-[#430062]" />
                      <p className="text-sm text-zinc-400">
                        Loading activity logs…
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : paginatedLogs.length > 0 ? (
                paginatedLogs.map((log) => {
                  const activityType = getActivityType(log.activity);
                  return (
                    <TableRow
                      key={log.id}
                      className="border-b border-zinc-100 transition-colors hover:bg-zinc-50"
                    >
                      <TableCell className="py-3 px-3 sm:py-5 sm:px-6">
                        <code className="rounded-lg bg-zinc-100 px-2 py-1 text-[11px] font-mono text-zinc-600">
                          {log.id}
                        </code>
                      </TableCell>

                      <TableCell className="py-3 px-3 sm:py-5 sm:px-6">
                        <div className="flex flex-col gap-1.5">
                          <p className="text-sm font-medium text-zinc-900 sm:text-[15px] leading-relaxed">
                            {log.activity}
                          </p>
                          <Badge
                            variant="outline"
                            className="w-fit text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5"
                            style={{
                              borderColor: `${activityType.color}30`,
                              color: activityType.color,
                              backgroundColor: `${activityType.color}10`,
                            }}
                          >
                            {activityType.label}
                          </Badge>
                        </div>
                      </TableCell>

                      <TableCell className="py-3 px-3 sm:py-5 sm:px-6">
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-600">
                          <Clock className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
                          <span className="font-mono whitespace-nowrap">
                            {formatManilaTime(log.created_at)}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100">
                        <FileText className="h-8 w-8 text-zinc-300" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-zinc-800">
                        No logs found
                      </h3>
                      <p className="mt-1 text-sm text-zinc-400">
                        Try adjusting your search or check back later
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        {filteredLogs.length > itemsPerPage && (
          <div className="flex items-center justify-between border-t border-zinc-100 px-4 py-4 sm:px-6">
            <div className="text-sm text-zinc-500">
              Showing{" "}
              <span className="font-medium text-zinc-700">
                {startIndex + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium text-zinc-700">
                {Math.min(endIndex, filteredLogs.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-zinc-700">
                {filteredLogs.length}
              </span>{" "}
              entries
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="h-9 rounded-xl border-zinc-200/80 text-xs hover:bg-zinc-50 hover:border-zinc-300 disabled:opacity-40"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </Button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={`page-${page}`}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={`h-9 w-9 rounded-xl text-xs ${
                        currentPage === page
                          ? "bg-[#430062] text-white shadow-sm hover:bg-[#5a0080]"
                          : "border-zinc-200/80 hover:bg-zinc-50 hover:border-zinc-300"
                      }`}
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
                className="h-9 rounded-xl border-zinc-200/80 text-xs hover:bg-zinc-50 hover:border-zinc-300 disabled:opacity-40"
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
