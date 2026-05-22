"use client";

import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Heart,
  Share2,
  BarChart3,
  Award,
  Calendar,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const brandColor = "#430062";

interface ReportPost {
  id: string;
  title: string;
  platform: string;
  publishedDate: string;
  reach: number;
  interactions: number;
  engagementRate: number;
  type: string;
}

const weeklyPosts: ReportPost[] = [
  {
    id: "R-1121",
    title: "Summer Collection Launch Reel",
    platform: "Instagram",
    publishedDate: "May 18",
    reach: 24800,
    interactions: 5420,
    engagementRate: 21.9,
    type: "Reel",
  },
  {
    id: "R-1122",
    title: "Client Success Story",
    platform: "LinkedIn",
    publishedDate: "May 20",
    reach: 9800,
    interactions: 1840,
    engagementRate: 18.8,
    type: "Carousel",
  },
  {
    id: "R-1123",
    title: "Weekly Marketing Tip",
    platform: "Facebook",
    publishedDate: "May 21",
    reach: 6700,
    interactions: 980,
    engagementRate: 14.6,
    type: "Static",
  },
];

const monthlyPosts: ReportPost[] = [
  ...weeklyPosts,
  {
    id: "R-1124",
    title: "Product Feature Deep Dive",
    platform: "Instagram",
    publishedDate: "May 12",
    reach: 31200,
    interactions: 6890,
    engagementRate: 22.1,
    type: "Reel",
  },
];

const weeklyTrend = [
  { day: "Mon", reach: 6800, er: 14.2 },
  { day: "Tue", reach: 12400, er: 19.8 },
  { day: "Wed", reach: 8900, er: 16.1 },
  { day: "Thu", reach: 15200, er: 23.4 },
  { day: "Fri", reach: 9800, er: 17.9 },
  { day: "Sat", reach: 6700, er: 21.2 },
  { day: "Sun", reach: 5400, er: 15.8 },
];

const platformComparison = [
  { platform: "Instagram", reach: 124000, er: 20.8, fill: "#E1306C" },
  { platform: "LinkedIn", reach: 45600, er: 16.4, fill: "#0A66C2" },
  { platform: "Facebook", reach: 28900, er: 13.9, fill: "#1877F2" },
];

const contentTypeData = [
  { name: "Reels", value: 54, fill: brandColor },
  { name: "Carousels", value: 28, fill: "#7c3aed" },
  { name: "Static", value: 18, fill: "#c026d3" },
];

export default function MarketingReportingDashboard() {
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");
  const [platformFilter, setPlatformFilter] = useState("All");

  const currentPosts = period === "weekly" ? weeklyPosts : monthlyPosts;

  const filteredPosts = useMemo(() => {
    if (platformFilter === "All") return currentPosts;
    return currentPosts.filter((p) => p.platform === platformFilter);
  }, [currentPosts, platformFilter]);

  const totalReach = filteredPosts.reduce((sum, p) => sum + p.reach, 0);
  const totalInteractions = filteredPosts.reduce(
    (sum, p) => sum + p.interactions,
    0,
  );
  const avgER =
    filteredPosts.reduce((sum, p) => sum + p.engagementRate, 0) /
      filteredPosts.length || 0;

  const topPost = [...filteredPosts].sort(
    (a, b) => b.engagementRate - a.engagementRate,
  )[0];

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <div className="border-b bg-white sticky top-0 z-50">
        <div className="px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-2xl"
              style={{ backgroundColor: brandColor }}
            >
              A
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                Marketing Reports
              </h1>
              <p className="text-zinc-500">
                Performance Summary • Axis Marketing OS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Platforms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Platforms</SelectItem>
                <SelectItem value="Instagram">Instagram</SelectItem>
                <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                <SelectItem value="Facebook">Facebook</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Custom Range
            </Button>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Period Tabs */}
        <Tabs
          value={period}
          onValueChange={(v) => setPeriod(v as "weekly" | "monthly")}
          className="mb-8"
        >
          <TabsList className="inline-flex">
            <TabsTrigger value="weekly">This Week</TabsTrigger>
            <TabsTrigger value="monthly">This Month</TabsTrigger>
          </TabsList>

          <TabsContent value={period} className="mt-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-500">
                    Total Reach
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-semibold tracking-tighter">
                    {totalReach.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600 text-sm mt-2">
                    <TrendingUp className="w-4 h-4" /> +24% vs last period
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-500">
                    Total Interactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-semibold tracking-tighter">
                    {totalInteractions.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600 text-sm mt-2">
                    <TrendingUp className="w-4 h-4" /> +19% vs last period
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-500">
                    Avg Engagement Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-semibold tracking-tighter">
                    {avgER.toFixed(1)}%
                  </div>
                  <div className="text-sm text-zinc-500 mt-2">
                    Above industry avg (9.8%)
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-500">
                    Posts Published
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-semibold tracking-tighter">
                    {filteredPosts.length}
                  </div>
                  <div className="text-sm text-emerald-600 mt-2">
                    3 scheduled next week
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
              {/* Charts Section */}
              <div className="xl:col-span-8 space-y-8">
                {/* Reach Trend */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Reach Trend •{" "}
                      {period === "weekly" ? "Last 7 Days" : "Last 30 Days"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={weeklyTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="natural"
                          dataKey="reach"
                          stroke={brandColor}
                          strokeWidth={4}
                          dot={{
                            r: 5,
                            fill: "#fff",
                            stroke: brandColor,
                            strokeWidth: 3,
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Platform Performance */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Platform Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={platformComparison}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="platform" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="reach" fill={brandColor} radius={6} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Content Type Breakdown */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Content Type Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                      <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                          <Pie
                            data={contentTypeData}
                            cx="50%"
                            cy="50%"
                            innerRadius={65}
                            outerRadius={95}
                            dataKey="value"
                          >
                            {contentTypeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                    <div className="flex justify-center gap-6 text-sm mt-2">
                      {contentTypeData.map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.fill }}
                          />
                          {item.name}
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>

              {/* Sidebar */}
              <div className="xl:col-span-4 space-y-6">
                {/* Top Performer Highlight */}
                {topPost && (
                  <Card className="border-emerald-200 bg-emerald-50/50">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-emerald-600" />
                        <CardTitle className="text-lg">Top Performer</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="font-semibold text-lg leading-tight">
                        {topPost.title}
                      </div>
                      <div className="text-sm text-zinc-500 mt-1">
                        {topPost.platform} • {topPost.type}
                      </div>

                      <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-3xl font-semibold text-emerald-700">
                            {topPost.engagementRate}%
                          </div>
                          <div className="text-xs text-zinc-500">
                            ENGAGEMENT
                          </div>
                        </div>
                        <div>
                          <div className="text-3xl font-semibold">
                            {topPost.reach.toLocaleString()}
                          </div>
                          <div className="text-xs text-zinc-500">REACH</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Insights */}
                <Card>
                  <CardHeader>
                    <CardTitle>Key Insights</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex gap-4">
                      <div className="text-emerald-600">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">
                          Reels continue to dominate
                        </p>
                        <p className="text-sm text-zinc-500">
                          Average 22.4% engagement rate
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="text-amber-600">
                        <TrendingDown className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">
                          Facebook needs optimization
                        </p>
                        <p className="text-sm text-zinc-500">
                          Lowest engagement this period
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Top Posts Table */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Top Performing Content</CardTitle>
                <CardDescription>Ranked by engagement rate</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Content</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Reach</TableHead>
                      <TableHead className="text-right">Interactions</TableHead>
                      <TableHead className="text-right">Engagement</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPosts
                      .sort((a, b) => b.engagementRate - a.engagementRate)
                      .map((post) => (
                        <TableRow key={post.id}>
                          <TableCell className="font-medium">
                            {post.title}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{post.platform}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{post.type}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {post.reach.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {post.interactions.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="font-semibold">
                              {post.engagementRate}%
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
