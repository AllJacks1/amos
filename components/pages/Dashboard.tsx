'use client';

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
  { title: "Total Posts", value: "248", change: 12, trend: "up", icon: <BarChart3 className="h-5 w-5" /> },
  { title: "Pending Approvals", value: "7", change: -3, trend: "down", icon: <Clock className="h-5 w-5" /> },
  { title: "Avg Engagement", value: "4.8%", change: 0.8, trend: "up", icon: <TrendingUp className="h-5 w-5" /> },
  { title: "Active Clients", value: "14", change: 2, trend: "up", icon: <Users className="h-5 w-5" /> },
];

const upcomingPosts: UpcomingPost[] = [
  { id: "1", title: "Summer Collection Launch Reel", platform: "Instagram", client: "Lumina Fashion", publishDate: "May 24, 2026", status: "scheduled" },
  { id: "2", title: "Behind the Scenes - Product Demo", platform: "LinkedIn", client: "Nexus Tech", publishDate: "May 25, 2026", status: "scheduled" },
  { id: "3", title: "Weekly Tips Carousel", platform: "Instagram", client: "Bloom Wellness", publishDate: "May 26, 2026", status: "scheduled" },
];

const approvals: ApprovalItem[] = [
  { id: "a1", thumbnail: "https://picsum.photos/id/1015/300/200", title: "Q2 Brand Campaign Hero", client: "Vertex Solutions", submitted: "2 hours ago", status: "pending" },
  { id: "a2", thumbnail: "https://picsum.photos/id/237/300/200", title: "Podcast Promo Thumbnail", client: "Mindful Media", submitted: "Yesterday", status: "reviewing" },
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
  { id: "p1", thumbnail: "https://picsum.photos/id/1015/300/200", title: "Productivity Hacks That Actually Work", platform: "LinkedIn", reach: 45200, engagement: 6.8, badge: "excellent" },
  { id: "p2", thumbnail: "https://picsum.photos/id/106/300/200", title: "Summer Lookbook 2026", platform: "Instagram", reach: 38100, engagement: 12.4, badge: "excellent" },
];

const recentActivities: Activity[] = [
  { id: "act1", user: { name: "Sarah Chen", initials: "SC" }, action: "approved", entity: "Summer Promo Video", timestamp: "11 min ago" },
  { id: "act2", user: { name: "Marcus Rivera", initials: "MR" }, action: "published", entity: "Client Testimonial Reel", timestamp: "47 min ago" },
  { id: "act3", user: { name: "Aisha Patel", initials: "AP" }, action: "requested changes", entity: "Website Launch Post", timestamp: "2 hours ago" },
];

export default function AMOSDashboard() {
  const [dateRange, setDateRange] = useState("This Week");

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight">Good morning, Alex</h2>
          <p className="text-zinc-600 mt-2 text-lg">
            Here's what's happening with your marketing operations today.
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

          <Button style={{ backgroundColor: brandColor }} className="text-white">
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <Card key={index} className="bg-white border border-zinc-200 rounded-3xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="text-zinc-500">{kpi.title}</div>
              <div className="text-zinc-400">{kpi.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-semibold mb-3 tracking-tighter">{kpi.value}</div>
              <div className="flex items-center gap-2 text-sm">
                <div className={`flex items-center gap-1 ${kpi.trend === "up" ? "text-emerald-600" : "text-rose-600"}`}>
                  {kpi.trend === "up" ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
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
        <Card className="bg-white border border-zinc-200 rounded-3xl shadow-sm">
              <CardHeader className="border-b border-zinc-100 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-violet-600" />
                      Upcoming Content
                    </CardTitle>
                    <CardDescription>Next 7 days • 12 scheduled</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">Full Calendar</Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {upcomingPosts.map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center gap-4 p-4 rounded-2xl hover:bg-zinc-100 transition-colors group"
                    >
                      <div className="w-12 h-12 bg-zinc-100 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-mono text-zinc-500">
                        {post.platform.slice(0, 3)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{post.title}</p>
                        <div className="flex items-center gap-3 text-sm text-zinc-500 mt-1">
                          <span>{post.client}</span>
                          <span>•</span>
                          <span>{post.publishDate}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-emerald-200 text-emerald-700 capitalize">
                        {post.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Approval Queue */}
            <Card className="bg-white border border-zinc-200 rounded-3xl shadow-sm">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    Approval Queue
                  </CardTitle>
                  <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200">
                    {approvals.length} pending
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {approvals.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-4 bg-zinc-50 rounded-2xl border border-zinc-100"
                    >
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-24 h-16 object-cover rounded-xl"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{item.title}</div>
                        <div className="text-sm text-zinc-600">{item.client}</div>
                        <div className="text-xs text-zinc-500 mt-2">{item.submitted}</div>
                      </div>
                      <div className="flex flex-col items-end gap-3 justify-center">
                        <Badge
                          className={
                            item.status === "pending"
                              ? "bg-rose-100 text-rose-700"
                              : "bg-blue-100 text-blue-700"
                          }
                        >
                          {item.status}
                        </Badge>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="h-8 text-xs">Review</Button>
                          <Button size="sm" className="h-8 text-xs" style={{ backgroundColor: brandColor }}>
                            Approve
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card> </div>

        {/* Right Column */}
        <div className="xl:col-span-5 space-y-6">
          <Card className="bg-white border border-zinc-200 rounded-3xl shadow-sm">
              <CardHeader>
                <CardTitle>Performance Snapshot</CardTitle>
                <CardDescription>This week vs last week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                      <XAxis dataKey="day" stroke="#71717a" />
                      <YAxis stroke="#71717a" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fafafa",
                          border: "1px solid #e4e4e7",
                          borderRadius: "12px",
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

            {/* Top Performing Posts */}
            <Card className="bg-white border border-zinc-200 rounded-3xl shadow-sm">
              <CardHeader>
                <CardTitle>Top Performing Posts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {topPosts.map((post) => (
                  <div key={post.id} className="flex gap-4">
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      className="w-20 h-20 object-cover rounded-2xl"
                    />
                    <div className="flex-1">
                      <div className="font-medium leading-tight line-clamp-2">{post.title}</div>
                      <div className="text-sm text-zinc-500 mt-1 flex items-center gap-2">
                        <span>{post.platform}</span>
                        <span className="text-emerald-600">•</span>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          {post.badge}
                        </Badge>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-zinc-500 text-xs">REACH</div>
                          <div className="font-mono font-medium">{(post.reach / 1000).toFixed(0)}K</div>
                        </div>
                        <div>
                          <div className="text-zinc-500 text-xs">ENGAGEMENT</div>
                          <div className="font-mono font-medium text-emerald-600">{post.engagement}%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white border border-zinc-200 rounded-3xl shadow-sm">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex gap-4">
                      <Avatar className="h-9 w-9 border border-zinc-200">
                        <AvatarFallback className="text-xs bg-zinc-100 text-zinc-700">
                          {activity.user.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div>
                          <span className="font-medium">{activity.user.name}</span>{" "}
                          <span className="text-zinc-600">{activity.action}</span>{" "}
                          <span className="font-medium">"{activity.entity}"</span>
                        </div>
                        <div className="text-xs text-zinc-500 mt-1">{activity.timestamp}</div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card></div>
      </div>
    </div>
  );
}