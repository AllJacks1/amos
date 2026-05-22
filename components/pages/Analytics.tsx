'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  MousePointer, 
  Calendar as CalendarIcon,
  Search 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
} from 'recharts';

const brandColor = "#430062";

interface KPICard {
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  icon: React.ReactNode;
}

interface TopPost {
  id: string;
  title: string;
  platform: string;
  thumbnail: string;
  reach: number;
  interactions: number;
  engagementRate: number;
  clicks: number;
  publishDate: string;
}

// Mock Data
const kpiCards: KPICard[] = [
  { title: "Total Reach", value: "248.4K", change: 18, trend: "up", icon: <Eye className="h-5 w-5" /> },
  { title: "Total Impressions", value: "1.2M", change: 12, trend: "up", icon: <Users className="h-5 w-5" /> },
  { title: "Engagement Rate", value: "6.8%", change: -2, trend: "down", icon: <TrendingUp className="h-5 w-5" /> },
  { title: "Total Clicks", value: "18.7K", change: 24, trend: "up", icon: <MousePointer className="h-5 w-5" /> },
];

const trendData = [
  { date: "May 16", reach: 12400, engagement: 820, clicks: 340 },
  { date: "May 17", reach: 9800, engagement: 650, clicks: 280 },
  { date: "May 18", reach: 15600, engagement: 1240, clicks: 670 },
  { date: "May 19", reach: 13200, engagement: 890, clicks: 420 },
  { date: "May 20", reach: 18900, engagement: 1580, clicks: 940 },
  { date: "May 21", reach: 14200, engagement: 1120, clicks: 580 },
  { date: "May 22", reach: 21400, engagement: 1870, clicks: 1120 },
];

const platformData = [
  { name: "Instagram", reach: 124000, fill: "#E1306C" },
  { name: "LinkedIn", reach: 89000, fill: "#0A66C2" },
  { name: "Facebook", reach: 67000, fill: "#1877F2" },
];

const topPosts: TopPost[] = [
  {
    id: "p1",
    title: "Summer Collection Launch Reel",
    platform: "Instagram",
    thumbnail: "https://picsum.photos/id/1015/120/120",
    reach: 45200,
    interactions: 3240,
    engagementRate: 12.4,
    clicks: 1840,
    publishDate: "May 20",
  },
  {
    id: "p2",
    title: "Q2 Performance Insights",
    platform: "LinkedIn",
    thumbnail: "https://picsum.photos/id/201/120/120",
    reach: 31800,
    interactions: 1870,
    engagementRate: 8.9,
    clicks: 1240,
    publishDate: "May 19",
  },
  {
    id: "p3",
    title: "Wellness Routine Tips",
    platform: "Instagram",
    thumbnail: "https://picsum.photos/id/237/120/120",
    reach: 27400,
    interactions: 2310,
    engagementRate: 11.2,
    clicks: 980,
    publishDate: "May 21",
  },
];

export default function AnalyticsModule() {
  const [dateRange, setDateRange] = useState("7d");
  const [platformFilter, setPlatformFilter] = useState("all");

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white">
        <div className="flex h-16 items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div 
                className="h-9 w-9 rounded-2xl flex items-center justify-center text-white font-bold text-2xl"
                style={{ backgroundColor: brandColor }}
              >
                A
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
                <p className="text-sm text-zinc-500">Marketing Performance • Live</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="q2">Q2 2026</SelectItem>
              </SelectContent>
            </Select>

            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="All Platforms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">Export Report</Button>
          </div>
        </div>
      </header>

      <div className="p-8 space-y-10">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiCards.map((kpi, index) => (
            <Card key={index} className="bg-white border border-zinc-200 rounded-3xl shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-base text-zinc-600 font-medium">{kpi.title}</CardTitle>
                <div className="text-zinc-400">{kpi.icon}</div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-semibold tracking-tighter mb-3">{kpi.value}</div>
                <div className="flex items-center gap-2 text-sm">
                  <div className={`flex items-center gap-1 ${kpi.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    <TrendingUp className="h-4 w-4" />
                    {kpi.change}%
                  </div>
                  <span className="text-zinc-500">vs last period</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Main Trend Chart */}
          <div className="xl:col-span-8">
            <Card className="bg-white border border-zinc-200 rounded-3xl shadow-sm">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Performance Trend</CardTitle>
                  <Badge variant="outline">Reach + Engagement</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                      <XAxis dataKey="date" stroke="#71717a" />
                      <YAxis stroke="#71717a" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          border: '1px solid #e4e4e7', 
                          borderRadius: '12px',
                          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                        }} 
                      />
                      <Line 
                        type="natural" 
                        dataKey="reach" 
                        stroke={brandColor} 
                        strokeWidth={4} 
                        dot={{ r: 5, fill: brandColor }}
                        name="Reach"
                      />
                      <Line 
                        type="natural" 
                        dataKey="engagement" 
                        stroke="#71717a" 
                        strokeWidth={3} 
                        strokeDasharray="5 5"
                        dot={{ r: 4 }}
                        name="Engagement"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Platform Breakdown */}
          <div className="xl:col-span-4">
            <Card className="bg-white border border-zinc-200 rounded-3xl shadow-sm h-full">
              <CardHeader>
                <CardTitle>Platform Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={platformData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                      <XAxis dataKey="name" stroke="#71717a" />
                      <YAxis stroke="#71717a" />
                      <Tooltip />
                      <Bar dataKey="reach" fill={brandColor} radius={8} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Top Performing Posts */}
        <Card className="bg-white border border-zinc-200 rounded-3xl shadow-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Top Performing Posts</CardTitle>
              <Button variant="ghost" size="sm">View All Posts →</Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Content</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead className="text-right">Reach</TableHead>
                  <TableHead className="text-right">Interactions</TableHead>
                  <TableHead className="text-right">Engagement</TableHead>
                  <TableHead className="text-right">Clicks</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topPosts.map((post) => (
                  <TableRow key={post.id} className="hover:bg-zinc-50 cursor-pointer">
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <img 
                          src={post.thumbnail} 
                          alt={post.title}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div className="font-medium max-w-[260px] line-clamp-2">{post.title}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{post.platform}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium">
                      {(post.reach / 1000).toFixed(0)}K
                    </TableCell>
                    <TableCell className="text-right font-mono">{post.interactions.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <span className="text-emerald-600 font-medium">{post.engagementRate}%</span>
                    </TableCell>
                    <TableCell className="text-right font-mono">{post.clicks.toLocaleString()}</TableCell>
                    <TableCell className="text-zinc-500 text-sm">{post.publishDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}