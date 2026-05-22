'use client';

import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, TrendingDown, Users, Heart, MessageCircle, 
  Share2, MousePointerClick, Calendar, Download 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell 
} from 'recharts';

const brandColor = "#430062";

interface PerformancePost {
  id: string;
  title: string;
  platform: 'Instagram' | 'Facebook' | 'LinkedIn';
  publishedDate: string;
  type: 'Reel' | 'Carousel' | 'Static' | 'Story';
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  clicks: number;
}

const mockPosts: PerformancePost[] = [
  {
    id: "P-3921",
    title: "Summer Collection Launch Reel",
    platform: "Instagram",
    publishedDate: "2026-05-18",
    type: "Reel",
    reach: 12400,
    likes: 2450,
    comments: 312,
    shares: 189,
    clicks: 874
  },
  {
    id: "P-3922",
    title: "Client Success Story Carousel",
    platform: "LinkedIn",
    publishedDate: "2026-05-20",
    type: "Carousel",
    reach: 8750,
    likes: 1240,
    comments: 87,
    shares: 245,
    clicks: 432
  },
  {
    id: "P-3923",
    title: "Quick Tip: Email Marketing 2026",
    platform: "Facebook",
    publishedDate: "2026-05-21",
    type: "Static",
    reach: 6300,
    likes: 890,
    comments: 134,
    shares: 67,
    clicks: 291
  },
  {
    id: "P-3924",
    title: "Behind the Scenes - Creative Process",
    platform: "Instagram",
    publishedDate: "2026-05-15",
    type: "Reel",
    reach: 15600,
    likes: 3890,
    comments: 421,
    shares: 312,
    clicks: 645
  },
];

const trendData = [
  { date: 'May 12', reach: 8200, interactions: 1240, er: 15.1 },
  { date: 'May 14', reach: 9700, interactions: 1680, er: 17.3 },
  { date: 'May 16', reach: 11400, interactions: 2030, er: 17.8 },
  { date: 'May 18', reach: 9800, interactions: 1870, er: 19.1 },
  { date: 'May 20', reach: 14200, interactions: 2540, er: 17.9 },
  { date: 'May 22', reach: 13100, interactions: 2310, er: 17.6 },
];

const platformData = [
  { platform: 'Instagram', reach: 45200, interactions: 8920, fill: '#E1306C' },
  { platform: 'LinkedIn', reach: 21800, interactions: 3410, fill: '#0A66C2' },
  { platform: 'Facebook', reach: 15600, interactions: 2870, fill: '#1877F2' },
];

const typeData = [
  { name: 'Reel', value: 48, fill: brandColor },
  { name: 'Carousel', value: 29, fill: '#6b21a8' },
  { name: 'Static', value: 23, fill: '#a855f7' },
];

export default function OrganicPerformanceTracker() {
  const [searchTerm, setSearchTerm] = useState("");
  const [platformFilter, setPlatformFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [sortBy, setSortBy] = useState<"engagement" | "reach" | "date">("engagement");

  const totalReach = mockPosts.reduce((sum, p) => sum + p.reach, 0);
  const totalInteractions = mockPosts.reduce((sum, p) => 
    sum + p.likes + p.comments + p.shares + p.clicks, 0
  );
  const avgEngagement = ((totalInteractions / totalReach) * 100).toFixed(1);

  const filteredAndSortedPosts = useMemo(() => {
    let result = [...mockPosts];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(term)
      );
    }

    if (platformFilter !== "All") {
      result = result.filter(p => p.platform === platformFilter);
    }

    if (typeFilter !== "All") {
      result = result.filter(p => p.type === typeFilter);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "engagement") {
        const erA = ((a.likes + a.comments + a.shares + a.clicks) / a.reach) * 100;
        const erB = ((b.likes + b.comments + b.shares + b.clicks) / b.reach) * 100;
        return erB - erA;
      }
      if (sortBy === "reach") return b.reach - a.reach;
      return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
    });

    return result;
  }, [searchTerm, platformFilter, typeFilter, sortBy]);

  const getPerformanceBadge = (er: number) => {
    if (er >= 18) return { label: "High Performer", class: "bg-emerald-100 text-emerald-700" };
    if (er >= 12) return { label: "Good", class: "bg-blue-100 text-blue-700" };
    return { label: "Needs Attention", class: "bg-amber-100 text-amber-700" };
  };

  const calculateER = (post: PerformancePost) => {
    const interactions = post.likes + post.comments + post.shares + post.clicks;
    return ((interactions / post.reach) * 100);
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <div className="border-b bg-white sticky top-0 z-50">
        <div className="px-8 py-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div 
                className="w-9 h-9 rounded-2xl flex items-center justify-center text-white font-bold text-xl"
                style={{ backgroundColor: brandColor }}
              >
                A
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight">Organic Performance</h1>
                <p className="text-zinc-500">Real-time insights across all channels • May 2026</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Last 30 days
            </Button>
            <Button style={{ backgroundColor: brandColor }} className="text-white">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="px-8 pb-6 border-t pt-4 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Input 
              placeholder="Search posts..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={platformFilter} onValueChange={setPlatformFilter}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Platforms</SelectItem>
              <SelectItem value="Instagram">Instagram</SelectItem>
              <SelectItem value="Facebook">Facebook</SelectItem>
              <SelectItem value="LinkedIn">LinkedIn</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Content Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Types</SelectItem>
              <SelectItem value="Reel">Reel</SelectItem>
              <SelectItem value="Carousel">Carousel</SelectItem>
              <SelectItem value="Static">Static</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="engagement">Best Engagement</SelectItem>
              <SelectItem value="reach">Highest Reach</SelectItem>
              <SelectItem value="date">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="p-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-500">Total Reach</CardTitle>
              <Users className="w-5 h-5 text-zinc-400" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-semibold tracking-tighter">{totalReach.toLocaleString()}</div>
              <div className="flex items-center text-emerald-600 text-sm mt-2">
                <TrendingUp className="w-4 h-4 mr-1" /> +18% from last month
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-500">Total Interactions</CardTitle>
              <Heart className="w-5 h-5 text-zinc-400" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-semibold tracking-tighter">{totalInteractions.toLocaleString()}</div>
              <div className="flex items-center text-emerald-600 text-sm mt-2">
                <TrendingUp className="w-4 h-4 mr-1" /> +12% from last month
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-500">Avg. Engagement Rate</CardTitle>
              <MessageCircle className="w-5 h-5 text-zinc-400" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-semibold tracking-tighter">{avgEngagement}%</div>
              <div className="flex items-center text-emerald-600 text-sm mt-2">
                +2.4 pts • Industry benchmark 8.2%
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-500">Top Platform</CardTitle>
              <Share2 className="w-5 h-5 text-zinc-400" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-semibold tracking-tighter">Instagram</div>
              <div className="text-sm text-zinc-500 mt-2">62% of total reach</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Charts & Table */}
          <div className="flex-1 space-y-8">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="posts">All Posts</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-8">
                {/* Trend Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Trend (Last 10 Days)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={320}>
                      <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="natural" 
                          dataKey="reach" 
                          stroke={brandColor} 
                          strokeWidth={3}
                          dot={{ fill: brandColor, r: 4 }}
                        />
                        <Line 
                          type="natural" 
                          dataKey="interactions" 
                          stroke="#a855f7" 
                          strokeWidth={2}
                          strokeDasharray="4 2"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Platform & Type Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Platform Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={platformData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="platform" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="reach" fill={brandColor} radius={8} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Content Type Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={240}>
                        <PieChart>
                          <Pie
                            data={typeData}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={100}
                            dataKey="value"
                          >
                            {typeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="flex justify-center gap-6 mt-4">
                        {typeData.map((t, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.fill }} />
                            {t.name} ({t.value}%)
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="posts">
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Post</TableHead>
                        <TableHead>Platform</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Reach</TableHead>
                        <TableHead className="text-right">Interactions</TableHead>
                        <TableHead className="text-right">Engagement</TableHead>
                        <TableHead>Performance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAndSortedPosts.map((post) => {
                        const er = calculateER(post);
                        const interactions = post.likes + post.comments + post.shares + post.clicks;
                        const badge = getPerformanceBadge(er);
                        
                        return (
                          <TableRow key={post.id} className="hover:bg-zinc-50">
                            <TableCell>
                              <div className="font-medium">{post.title}</div>
                              <div className="text-xs text-zinc-500">{post.publishedDate}</div>
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
                              {interactions.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              {er.toFixed(1)}%
                            </TableCell>
                            <TableCell>
                              <Badge className={badge.class}>
                                {badge.label}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar Insights */}
          <div className="w-96 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Posts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {mockPosts
                  .sort((a, b) => calculateER(b) - calculateER(a))
                  .slice(0, 3)
                  .map((post, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="text-3xl font-semibold text-zinc-200">0{idx+1}</div>
                      <div className="flex-1">
                        <p className="font-medium leading-tight line-clamp-2">{post.title}</p>
                        <p className="text-xs text-emerald-600 mt-1">
                          {calculateER(post).toFixed(1)}% ER • {post.platform}
                        </p>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-sm">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-medium">Reels are winning</div>
                    <div className="text-zinc-500">Average 21.4% engagement rate</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <TrendingDown className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="font-medium">LinkedIn needs attention</div>
                    <div className="text-zinc-500">Lowest average engagement this month</div>
                  </div>
                </div>

                <div className="pt-4 border-t text-xs text-zinc-500">
                  Last updated just now • All data is live
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}