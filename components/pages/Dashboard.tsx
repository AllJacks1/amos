"use client";

import React, { useState } from "react";
import {
  Calendar,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  BarChart3,
  Plus,
  Search,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const brandColor = "#430062";

// Types
interface KPI {
  title: string;
  value: string | number;
  change: number;
  trend: "up" | "down";
  icon: React.ReactNode;
}

interface UpcomingPost {
  id: string;
  title: string;
  platform: string;
  client: string;
  publishDate: string;
  status: "scheduled" | "draft";
}

interface ApprovalItem {
  id: string;
  thumbnail: string;
  title: string;
  client: string;
  submitted: string;
  status: "pending" | "reviewing";
}

interface Activity {
  id: string;
  user: { name: string; initials: string };
  action: string;
  entity: string;
  timestamp: string;
}

interface TopPost {
  id: string;
  thumbnail: string;
  title: string;
  platform: string;
  reach: number;
  engagement: number;
  badge: "excellent" | "good";
}

// Mock Data
const kpis: KPI[] = [
  {
    title: "Total Posts",
    value: "248",
    change: 12,
    trend: "up",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    title: "Pending Approvals",
    value: "7",
    change: -3,
    trend: "down",
    icon: <Clock className="h-5 w-5" />,
  },
  {
    title: "Avg Engagement",
    value: "4.8%",
    change: 0.8,
    trend: "up",
    icon: <TrendingUp className="h-5 w-5" />,
  },
  {
    title: "Active Clients",
    value: "14",
    change: 2,
    trend: "up",
    icon: <Users className="h-5 w-5" />,
  },
];

const upcomingPosts: UpcomingPost[] = [
  {
    id: "1",
    title: "Summer Collection Launch Reel",
    platform: "Instagram",
    client: "Lumina Fashion",
    publishDate: "May 24, 2026",
    status: "scheduled",
  },
  {
    id: "2",
    title: "Behind the Scenes - Product Demo",
    platform: "LinkedIn",
    client: "Nexus Tech",
    publishDate: "May 25, 2026",
    status: "scheduled",
  },
  {
    id: "3",
    title: "Weekly Tips Carousel",
    platform: "Instagram",
    client: "Bloom Wellness",
    publishDate: "May 26, 2026",
    status: "scheduled",
  },
];

const approvals: ApprovalItem[] = [
  {
    id: "a1",
    thumbnail: "https://picsum.photos/id/1015/300/200",
    title: "Q2 Brand Campaign Hero",
    client: "Vertex Solutions",
    submitted: "2 hours ago",
    status: "pending",
  },
  {
    id: "a2",
    thumbnail: "https://picsum.photos/id/237/300/200",
    title: "Podcast Promo Thumbnail",
    client: "Mindful Media",
    submitted: "Yesterday",
    status: "reviewing",
  },
];

const performanceData = [
  { day: "Mon", reach: 12400, engagement: 680 },
  { day: "Tue", reach: 9800, engagement: 540 },
  { day: "Wed", reach: 15600, engagement: 920 },
  { day: "Thu", reach: 13200, engagement: 710 },
  { day: "Fri", reach: 18900, engagement: 1250 },
  { day: "Sat", reach: 8700, engagement: 480 },
];

const topPosts: TopPost[] = [
  {
    id: "p1",
    thumbnail: "https://picsum.photos/id/1015/300/200",
    title: "Productivity Hacks That Actually Work",
    platform: "LinkedIn",
    reach: 45200,
    engagement: 6.8,
    badge: "excellent",
  },
  {
    id: "p2",
    thumbnail: "https://picsum.photos/id/106/300/200",
    title: "Summer Lookbook 2026",
    platform: "Instagram",
    reach: 38100,
    engagement: 12.4,
    badge: "excellent",
  },
];

const recentActivities: Activity[] = [
  {
    id: "act1",
    user: { name: "Sarah Chen", initials: "SC" },
    action: "approved",
    entity: "Summer Promo Video",
    timestamp: "11 min ago",
  },
  {
    id: "act2",
    user: { name: "Marcus Rivera", initials: "MR" },
    action: "published",
    entity: "Client Testimonial Reel",
    timestamp: "47 min ago",
  },
  {
    id: "act3",
    user: { name: "Aisha Patel", initials: "AP" },
    action: "requested changes",
    entity: "Website Launch Post",
    timestamp: "2 hours ago",
  },
];

export default function AMOSDashboard() {
  const [dateRange, setDateRange] = useState("This Week");

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight">
            Good morning, Alex
          </h2>
          <p className="text-zinc-600 mt-2 text-lg">
            Here&apos;s what&apos;s happening with your marketing operations
            today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-zinc-200 rounded-xl px-4 py-1.5 text-sm">
            <Calendar className="h-4 w-4 text-zinc-500" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent outline-none text-zinc-700"
            >
              <option>This Week</option>
              <option>Last 30 Days</option>
              <option>This Month</option>
              <option>Q2 2026</option>
            </select>
          </div>

          {/* <Button variant="outline" size="sm">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button> */}

          <Button
            style={{ backgroundColor: brandColor }}
            className="text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <Card
            key={index}
            className="bg-white border border-zinc-200 rounded-3xl shadow-sm"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="text-zinc-500">{kpi.title}</div>
              <div className="text-zinc-400">{kpi.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-semibold mb-3 tracking-tighter">
                {kpi.value}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div
                  className={`flex items-center gap-1 ${kpi.trend === "up" ? "text-emerald-600" : "text-rose-600"}`}
                >
                  {kpi.trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  {Math.abs(kpi.change)}%
                </div>
                <span className="text-zinc-500">from last period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="xl:col-span-7 space-y-6">
          <Card className="bg-white border border-zinc-200 rounded-2xl sm:rounded-3xl shadow-sm">
            <CardHeader className="border-b border-zinc-100 pb-3 sm:pb-4 px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="min-w-0">
                  <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-violet-600 flex-shrink-0" />
                    <span className="truncate">Upcoming Content</span>
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm mt-0.5">
                    Next 7 days • 12 scheduled
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9"
                >
                  Full Calendar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
              <div className="space-y-3 sm:space-y-4">
                {upcomingPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl hover:bg-zinc-100 transition-colors group min-w-0"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-zinc-100 rounded-lg sm:rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-mono text-zinc-500">
                      {post.platform.slice(0, 3)}
                    </div>
                    <div className="flex-1 min-w-0 w-full">
                      <p className="font-medium text-sm sm:text-base truncate">
                        {post.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-3 gap-y-1 text-xs sm:text-sm text-zinc-500 mt-1">
                        <span className="truncate max-w-[120px] sm:max-w-none">
                          {post.client}
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span>{post.publishDate}</span>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-emerald-200 text-emerald-700 capitalize text-xs whitespace-nowrap mt-1 sm:mt-0 flex-shrink-0"
                    >
                      {post.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-zinc-200 rounded-2xl sm:rounded-3xl shadow-sm">
            <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 flex-shrink-0" />
                  Approval Queue
                </CardTitle>
                <Badge
                  variant="secondary"
                  className="bg-amber-100 text-amber-700 border-amber-200 w-fit text-xs"
                >
                  {approvals.length} pending
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="space-y-3 sm:space-y-4">
                {approvals.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 bg-zinc-50 rounded-xl sm:rounded-2xl border border-zinc-100 min-w-0"
                  >
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full sm:w-24 h-32 sm:h-16 object-cover rounded-lg sm:rounded-xl flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm sm:text-base line-clamp-2 sm:line-clamp-1">
                        {item.title}
                      </div>
                      <div className="text-xs sm:text-sm text-zinc-600 mt-0.5 sm:mt-1">
                        {item.client}
                      </div>
                      <div className="text-xs text-zinc-500 mt-2">
                        {item.submitted}
                      </div>
                    </div>
                    <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-3 justify-between sm:justify-center mt-1 sm:mt-0">
                      <Badge
                        className={
                          item.status === "pending"
                            ? "bg-rose-100 text-rose-700 text-xs whitespace-nowrap"
                            : "bg-blue-100 text-blue-700 text-xs whitespace-nowrap"
                        }
                      >
                        {item.status}
                      </Badge>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 sm:h-9 text-xs px-2 sm:px-3"
                        >
                          Review
                        </Button>
                        <Button
                          size="sm"
                          className="h-8 sm:h-9 text-xs px-2 sm:px-3"
                          style={{ backgroundColor: brandColor }}
                        >
                          Approve
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="xl:col-span-5 space-y-4 sm:space-y-6">
          <Card className="bg-white border border-zinc-200 rounded-2xl sm:rounded-3xl shadow-sm">
            <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
              <CardTitle className="text-base sm:text-lg">
                Performance Snapshot
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                This week vs last week
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="h-56 sm:h-64 md:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                    <XAxis dataKey="day" stroke="#71717a" fontSize={12} />
                    <YAxis stroke="#71717a" fontSize={12} width={40} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fafafa",
                        border: "1px solid #e4e4e7",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                    />
                    <Line
                      type="natural"
                      dataKey="reach"
                      stroke={brandColor}
                      strokeWidth={3}
                      dot={{ fill: brandColor, r: 4 }}
                    />
                    <Line
                      type="natural"
                      dataKey="engagement"
                      stroke="#71717a"
                      strokeWidth={2}
                      strokeDasharray="4 2"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-zinc-200 rounded-2xl sm:rounded-3xl shadow-sm">
            <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
              <CardTitle className="text-base sm:text-lg">
                Top Performing Posts
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4 sm:space-y-6">
              {topPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4 min-w-0"
                >
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-full sm:w-20 h-40 sm:h-20 object-cover rounded-xl sm:rounded-2xl flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium leading-tight text-sm sm:text-base line-clamp-2">
                      {post.title}
                    </div>
                    <div className="text-xs sm:text-sm text-zinc-500 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="truncate">{post.platform}</span>
                      <span className="text-emerald-600">•</span>
                      <Badge
                        variant="outline"
                        className="text-[10px] sm:text-xs px-1.5 py-0 h-auto"
                      >
                        {post.badge}
                      </Badge>
                    </div>
                    <div className="mt-2 sm:mt-3 grid grid-cols-2 gap-3 sm:gap-4 text-sm">
                      <div>
                        <div className="text-zinc-500 text-[10px] sm:text-xs uppercase tracking-wider">
                          REACH
                        </div>
                        <div className="font-mono font-medium text-sm sm:text-base">
                          {(post.reach / 1000).toFixed(0)}K
                        </div>
                      </div>
                      <div>
                        <div className="text-zinc-500 text-[10px] sm:text-xs uppercase tracking-wider">
                          ENGAGEMENT
                        </div>
                        <div className="font-mono font-medium text-emerald-600 text-sm sm:text-base">
                          {post.engagement}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-white border border-zinc-200 rounded-2xl sm:rounded-3xl shadow-sm">
            <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
              <CardTitle className="text-base sm:text-lg">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="space-y-4 sm:space-y-6">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex gap-3 sm:gap-4 min-w-0 items-start"
                  >
                    <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border border-zinc-200 flex-shrink-0">
                      <AvatarFallback className="text-[10px] sm:text-xs bg-zinc-100 text-zinc-700">
                        {activity.user.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm sm:text-base leading-snug">
                        <span className="font-medium">
                          {activity.user.name}
                        </span>{" "}
                        <span className="text-zinc-600">{activity.action}</span>{" "}
                        <span className="font-medium break-words">
                          &quot;{activity.entity}&quot;
                        </span>
                      </div>
                      <div className="text-[10px] sm:text-xs text-zinc-500 mt-0.5 sm:mt-1">
                        {activity.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
