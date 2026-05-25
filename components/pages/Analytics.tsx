"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  Heart,
  Users,
  Calendar,
  Download,
  Search,
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
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Types
interface KPICard {
  label: string;
  value: string;
  change: number;
  trend: "up" | "down";
  icon: React.ReactNode;
}

interface Post {
  id: string;
  title: string;
  thumbnail: string;
  platform: string;
  type: string;
  reach: number;
  interactions: number;
  engagementRate: number;
  clicks: number;
  publishedAt: string;
}

interface TrendData {
  date: string;
  reach: number;
  engagement: number;
  clicks: number;
}

// Mock Data
const kpiData: KPICard[] = [
  {
    label: "Total Reach",
    value: "1.24M",
    change: 14.8,
    trend: "up",
    icon: <Eye className="h-5 w-5" />,
  },
  {
    label: "Total Impressions",
    value: "2.89M",
    change: 9.3,
    trend: "up",
    icon: <Users className="h-5 w-5" />,
  },
  {
    label: "Total Engagement",
    value: "186.4K",
    change: 22.1,
    trend: "up",
    icon: <Heart className="h-5 w-5" />,
  },
  {
    label: "Total Clicks",
    value: "47.2K",
    change: -3.4,
    trend: "down",
    icon: <MousePointer className="h-5 w-5" />,
  },
];

const performanceTrend = [
  { date: "May 15", reach: 45200, engagement: 12400, clicks: 3200 },
  { date: "May 16", reach: 68100, engagement: 18900, clicks: 4800 },
  { date: "May 17", reach: 53400, engagement: 14200, clicks: 3900 },
  { date: "May 18", reach: 89400, engagement: 26700, clicks: 7100 },
  { date: "May 19", reach: 67300, engagement: 19800, clicks: 5200 },
  { date: "May 20", reach: 112400, engagement: 32400, clicks: 8900 },
  { date: "May 21", reach: 98400, engagement: 28100, clicks: 7600 },
];

const platformData = [
  { name: "Instagram", reach: 42, fill: "#430062" },
  { name: "Facebook", reach: 28, fill: "#3b82f6" },
  { name: "LinkedIn", reach: 18, fill: "#64748b" },
  { name: "TikTok", reach: 12, fill: "#ec4899" },
];

const topPosts: Post[] = [
  {
    id: "1",
    title: "Product launch behind-the-scenes reel",
    thumbnail: "https://picsum.photos/id/1015/280/160",
    platform: "Instagram",
    type: "Reel",
    reach: 124800,
    interactions: 28400,
    engagementRate: 22.8,
    clicks: 6700,
    publishedAt: "2h ago",
  },
  {
    id: "2",
    title: "5 mistakes killing your LinkedIn reach",
    thumbnail: "https://picsum.photos/id/201/280/160",
    platform: "LinkedIn",
    type: "Carousel",
    reach: 87300,
    interactions: 12400,
    engagementRate: 14.2,
    clicks: 5400,
    publishedAt: "Yesterday",
  },
  {
    id: "3",
    title: "Client success story - 340% ROI",
    thumbnail: "https://picsum.photos/id/106/280/160",
    platform: "Facebook",
    type: "Video",
    reach: 67200,
    interactions: 9800,
    engagementRate: 14.6,
    clicks: 3200,
    publishedAt: "May 20",
  },
];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("7d");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [contentTypeFilter, setContentTypeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"engagement" | "reach" | "clicks">(
    "engagement",
  );

  const formatNumber = (num: number) =>
    new Intl.NumberFormat("en-US").format(num);

  const filteredPosts = [...topPosts]
    .filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (platformFilter === "all" ||
          post.platform.toLowerCase() === platformFilter) &&
        (contentTypeFilter === "all" ||
          post.type.toLowerCase() === contentTypeFilter.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "engagement") return b.interactions - a.interactions;
      if (sortBy === "reach") return b.reach - a.reach;
      return b.clicks - a.clicks;
    });

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="p-4 sm:p-6 lg:p-8 space-y-8 lg:space-y-10">
        {/* Page Header + Filters */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900">
              Analytics
            </h1>
            <p className="text-zinc-500 mt-1">
              Live Marketing Performance • May 2026
            </p>
          </div>

          <div className="flex flex-col justify-end sm:flex-row gap-3">
            {/* <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Search content..."
                className="pl-10 h-11 rounded-2xl w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div> */}

            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="h-11 w-full sm:w-40 rounded-2xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>

              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger className="h-11 w-full sm:w-40 rounded-2xl">
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={contentTypeFilter}
                onValueChange={setContentTypeFilter}
              >
                <SelectTrigger className="h-11 w-full sm:w-40 rounded-2xl">
                  <SelectValue placeholder="Content Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="reel">Reels</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                  <SelectItem value="carousel">Carousels</SelectItem>
                  <SelectItem value="post">Static Posts</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                className="rounded-2xl whitespace-nowrap px-6"
                onClick={() => alert("Export coming soon")}
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {kpiData.map((kpi, index) => (
            <Card
              key={index}
              className="rounded-3xl border border-zinc-100 shadow-sm hover:shadow transition-all"
            >
              <CardHeader className="pb-3 px-6 pt-6">
                <div className="flex justify-between items-start">
                  <div className="text-zinc-500 text-sm font-medium pr-2">
                    {kpi.label}
                  </div>
                  <div className="text-zinc-400">{kpi.icon}</div>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="text-4xl font-semibold tracking-tighter mb-3">
                  {kpi.value}
                </div>
                <div className="flex items-center gap-2 text-sm flex-wrap">
                  {kpi.trend === "up" ? (
                    <TrendingUp className="text-emerald-500 h-4 w-4 flex-shrink-0" />
                  ) : (
                    <TrendingDown className="text-rose-500 h-4 w-4 flex-shrink-0" />
                  )}
                  <span
                    className={
                      kpi.trend === "up" ? "text-emerald-600" : "text-rose-600"
                    }
                  >
                    {kpi.change}%
                  </span>
                  <span className="text-zinc-400">from last period</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-7 gap-6">
          {/* Engagement Trend */}
          <Card className="xl:col-span-4 rounded-3xl border border-zinc-100">
            <CardHeader className="px-6 pt-6">
              <CardTitle>Performance Over Time</CardTitle>
              <CardDescription>
                Reach, Engagement & Clicks trend
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="h-72 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <RechartsTooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Area
                      type="natural"
                      dataKey="reach"
                      stroke="#430062"
                      fill="#430062"
                      fillOpacity={0.08}
                      strokeWidth={3}
                    />
                    <Area
                      type="natural"
                      dataKey="engagement"
                      stroke="#a855f7"
                      fill="#a855f7"
                      fillOpacity={0.08}
                      strokeWidth={2.5}
                    />
                    <Area
                      type="natural"
                      dataKey="clicks"
                      stroke="#eab308"
                      fill="#eab308"
                      fillOpacity={0.08}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Platform Breakdown */}
          <Card className="xl:col-span-3 rounded-3xl border border-zinc-100">
            <CardHeader className="px-6 pt-6">
              <CardTitle>Platform Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="h-72 sm:h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={platformData}
                      cx="50%"
                      cy="50%"
                      innerRadius={72}
                      outerRadius={110}
                      dataKey="reach"
                    >
                      {platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3.5 mt-6">
                {platformData.map((platform) => (
                  <div
                    key={platform.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ background: platform.fill }}
                      />
                      <span className="font-medium">{platform.name}</span>
                    </div>
                    <span className="font-semibold">{platform.reach}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performing Posts */}
        <Card className="rounded-3xl border border-zinc-100">
          <CardHeader className="px-6 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Top Performing Content</CardTitle>
                <CardDescription>
                  Real-time ranked by engagement
                </CardDescription>
              </div>
              <Select
                value={sortBy}
                onValueChange={(value: any) => setSortBy(value)}
              >
                <SelectTrigger className="w-full sm:w-52 h-11 rounded-2xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="engagement">Sort by Engagement</SelectItem>
                  <SelectItem value="reach">Sort by Reach</SelectItem>
                  <SelectItem value="clicks">Sort by Clicks</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="px-0 sm:px-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[260px]">Content</TableHead>
                    <TableHead className="w-28">Platform</TableHead>
                    <TableHead className="text-right min-w-[100px]">
                      Reach
                    </TableHead>
                    <TableHead className="text-right min-w-[110px]">
                      Interactions
                    </TableHead>
                    <TableHead className="text-right min-w-[110px]">
                      Engagement
                    </TableHead>
                    <TableHead className="text-right min-w-[90px]">
                      Clicks
                    </TableHead>
                    <TableHead className="min-w-[90px]">Published</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.map((post) => (
                    <TableRow
                      key={post.id}
                      className="hover:bg-zinc-50 cursor-pointer"
                    >
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <img
                            src={post.thumbnail}
                            alt={post.title}
                            className="w-14 h-10 object-cover rounded-xl flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="font-medium line-clamp-2 leading-tight">
                              {post.title}
                            </div>
                            <div className="text-xs text-zinc-500 mt-0.5">
                              {post.type}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-medium">
                          {post.platform}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono font-medium">
                        {formatNumber(post.reach)}
                      </TableCell>
                      <TableCell className="text-right font-mono font-medium">
                        {formatNumber(post.interactions)}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-emerald-600 font-medium">
                          {post.engagementRate}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-mono font-medium">
                        {formatNumber(post.clicks)}
                      </TableCell>
                      <TableCell className="text-sm text-zinc-500 whitespace-nowrap">
                        {post.publishedAt}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-16 text-zinc-400">
                No content found matching your filters.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
