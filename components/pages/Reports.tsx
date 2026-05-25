'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, Eye, Heart, Award, Target, Calendar, Download 
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

// Types (unchanged)
interface KPI {
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  icon: React.ReactNode;
}

interface ContentItem {
  id: string;
  title: string;
  thumbnail: string;
  platform: 'instagram' | 'facebook' | 'linkedin' | 'tiktok';
  reach: number;
  engagement: number;
  rate: number;
  date: string;
  type: 'reel' | 'post' | 'story';
}

interface Campaign {
  id: string;
  name: string;
  objective: string;
  platform: string;
  reach: number;
  clicks: number;
  leads: number;
  engagement: number;
  roi: number;
  status: 'active' | 'completed';
}

interface TrendData {
  date: string;
  reach: number;
  engagement: number;
}

// Mock Data (unchanged)
const kpiData: KPI[] = [
  { label: "Total Reach", value: "248.4K", change: 18.2, trend: "up", icon: <Eye className="h-5 w-5" /> },
  { label: "Total Engagement", value: "42.8K", change: 12.7, trend: "up", icon: <Heart className="h-5 w-5" /> },
  { label: "Avg Engagement Rate", value: "17.3%", change: -2.1, trend: "down", icon: <Target className="h-5 w-5" /> },
  { label: "Active Campaigns", value: "7", change: 1, trend: "up", icon: <Award className="h-5 w-5" /> },
];

const weeklySummary = {
  reach: "89.2K",
  engagement: "14.7K",
  topPost: "Summer Product Launch Reel",
  bestPlatform: "Instagram",
  growth: 24.8,
  published: 18,
};

const topContent: ContentItem[] = [
  {
    id: "1",
    title: "Behind the scenes at our new studio",
    thumbnail: "https://picsum.photos/id/1015/300/200",
    platform: "instagram",
    reach: 45200,
    engagement: 12400,
    rate: 27.4,
    date: "May 18, 2026",
    type: "reel"
  },
  {
    id: "2",
    title: "How we helped a client 4x their leads",
    thumbnail: "https://picsum.photos/id/106/300/200",
    platform: "linkedin",
    reach: 31800,
    engagement: 6700,
    rate: 21.1,
    date: "May 17, 2026",
    type: "post"
  },
  {
    id: "3",
    title: "Quick tip: Instagram algorithm 2026",
    thumbnail: "https://picsum.photos/id/201/300/200",
    platform: "tiktok",
    reach: 67400,
    engagement: 18900,
    rate: 28.0,
    date: "May 16, 2026",
    type: "reel"
  },
];

const campaigns: Campaign[] = [
  {
    id: "c1",
    name: "Summer Product Launch",
    objective: "Brand Awareness",
    platform: "Multi-platform",
    reach: 124000,
    clicks: 18400,
    leads: 1240,
    engagement: 28900,
    roi: 4.8,
    status: "active"
  },
  {
    id: "c2",
    name: "Q2 Thought Leadership",
    objective: "Lead Generation",
    platform: "LinkedIn",
    reach: 67200,
    clicks: 9300,
    leads: 890,
    engagement: 12400,
    roi: 6.2,
    status: "completed"
  },
];

const reachTrend: TrendData[] = [
  { date: "May 8", reach: 12400, engagement: 3200 },
  { date: "May 9", reach: 15600, engagement: 4100 },
  { date: "May 10", reach: 9800, engagement: 2800 },
  { date: "May 11", reach: 22100, engagement: 6700 },
  { date: "May 12", reach: 18700, engagement: 5400 },
  { date: "May 13", reach: 25400, engagement: 8200 },
  { date: "May 14", reach: 31200, engagement: 9800 },
];

const platformData = [
  { name: "Instagram", value: 42, fill: "#430062" },
  { name: "LinkedIn", value: 28, fill: "#64748b" },
  { name: "TikTok", value: 19, fill: "#ec4899" },
  { name: "Facebook", value: 11, fill: "#3b82f6" },
];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("last-30-days");
  const [selectedClient, setSelectedClient] = useState("all");

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="p-8 space-y-10">
        {/* Page Header + Filters */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">Reports</h1>
            <p className="text-zinc-500 mt-1">Executive Marketing Insights • May 2026</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-48 rounded-2xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-7-days">Last 7 days</SelectItem>
                <SelectItem value="last-30-days">Last 30 days</SelectItem>
                <SelectItem value="last-90-days">Last 90 days</SelectItem>
                <SelectItem value="this-year">This Year</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger className="w-56 rounded-2xl">
                <SelectValue placeholder="Select Client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                <SelectItem value="acme">Acme Corp</SelectItem>
                <SelectItem value="nexus">Nexus Dynamics</SelectItem>
                <SelectItem value="velora">Velora Beauty</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="rounded-2xl" onClick={() => alert('Export functionality coming soon')}>
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>

            {/* <Button className="rounded-2xl bg-[#430062] hover:bg-[#430062]/90">
              Share Report
            </Button> */}
          </div>
        </div>

        {/* Executive KPI Cards */}
        <div>
          {/* <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-zinc-900">Executive Summary</h2>
              <p className="text-zinc-500">May 2026 Performance</p>
            </div>
            <Badge variant="secondary" className="rounded-full px-3 py-1">+18% from last month</Badge>
          </div> */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiData.map((kpi, i) => (
              <Card key={i} className="rounded-3xl border border-zinc-100 shadow-sm hover:shadow transition-all">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="text-zinc-500">{kpi.label}</div>
                    {kpi.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-semibold tracking-tighter text-zinc-900 mb-1">
                    {kpi.value}
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    {kpi.trend === 'up' ? (
                      <TrendingUp className="text-emerald-500 h-4 w-4" />
                    ) : (
                      <TrendingDown className="text-rose-500 h-4 w-4" />
                    )}
                    <span className={kpi.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}>
                      {kpi.change}%
                    </span>
                    <span className="text-zinc-400">vs last period</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Growth Trends */}
        <Card className="rounded-3xl overflow-hidden border border-zinc-100">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Growth Trends</CardTitle>
                <CardDescription>Reach and engagement over time</CardDescription>
              </div>
              <Select defaultValue="reach">
                <SelectTrigger className="w-40 rounded-2xl">
                  <SelectValue />
                </SelectTrigger>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={reachTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: 'none', 
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                    }} 
                  />
                  <Area type="natural" dataKey="reach" stroke="#430062" fill="#430062" fillOpacity={0.1} strokeWidth={3} />
                  <Area type="natural" dataKey="engagement" stroke="#a855f7" fill="#a855f7" fillOpacity={0.1} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Summary + Platform Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5">
            <Card className="rounded-3xl h-full border border-zinc-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[#430062]" />
                  This Week at a Glance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-zinc-500 mb-1">REACH</div>
                    <div className="text-4xl font-semibold tracking-tighter">{weeklySummary.reach}</div>
                    <div className="text-emerald-600 text-sm flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3" /> +24.8%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-zinc-500 mb-1">ENGAGEMENT</div>
                    <div className="text-4xl font-semibold tracking-tighter">{weeklySummary.engagement}</div>
                    <div className="text-emerald-600 text-sm flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3" /> +19.4%
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-6">
                  <div>
                    <div className="text-sm text-zinc-500 mb-2">TOP PERFORMING POST</div>
                    <div className="font-medium text-lg leading-tight">"{weeklySummary.topPost}"</div>
                    <div className="text-xs text-zinc-500 mt-3">Instagram • 47K reach</div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="text-sm text-zinc-500">BEST PLATFORM</div>
                      <div className="font-semibold text-xl mt-0.5">{weeklySummary.bestPlatform}</div>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-zinc-500">CONTENT PUBLISHED</div>
                      <div className="font-semibold text-xl mt-0.5">{weeklySummary.published}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-7">
            <Card className="rounded-3xl h-full border border-zinc-100">
              <CardHeader>
                <CardTitle>Platform Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col lg:flex-row gap-10 items-center">
                  <div className="w-full lg:w-80 h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={platformData}
                          cx="50%"
                          cy="50%"
                          innerRadius={90}
                          outerRadius={130}
                          dataKey="value"
                        >
                          {platformData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex-1 space-y-5">
                    {platformData.map((platform, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: platform.fill }} />
                          <span className="font-medium">{platform.name}</span>
                        </div>
                        <div className="font-mono text-sm font-medium">{platform.value}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Top Content */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold tracking-tight">Top Performing Content</h2>
            <Button variant="ghost" size="sm" className="text-[#430062] hover:text-[#430062]/80">
              View all content →
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {topContent.map((content) => (
              <Card key={content.id} className="rounded-3xl overflow-hidden group border border-zinc-100 hover:border-zinc-200 transition-all">
                <div className="relative">
                  <img 
                    src={content.thumbnail} 
                    alt={content.title}
                    className="w-full h-52 object-cover"
                  />
                  <Badge className="absolute top-4 right-4 bg-black/70 hover:bg-black text-white rounded-full text-xs uppercase tracking-widest">
                    {content.type}
                  </Badge>
                </div>
                
                <CardContent className="p-6">
                  <div className="font-medium leading-tight line-clamp-2 mb-4">{content.title}</div>
                  <Badge variant="outline" className="capitalize text-xs mb-6">
                    {content.platform}
                  </Badge>

                  <div className="grid grid-cols-3 gap-4 text-center text-sm">
                    <div>
                      <div className="text-zinc-400 text-xs">REACH</div>
                      <div className="font-semibold mt-0.5">{formatNumber(content.reach)}</div>
                    </div>
                    <div>
                      <div className="text-zinc-400 text-xs">ENGAGE</div>
                      <div className="font-semibold mt-0.5">{formatNumber(content.engagement)}</div>
                    </div>
                    <div>
                      <div className="text-zinc-400 text-xs">RATE</div>
                      <div className="font-semibold text-emerald-600 mt-0.5">{content.rate}%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Campaign Summaries */}
        <Card className="rounded-3xl border border-zinc-100">
          <CardHeader>
            <CardTitle>Active Campaigns</CardTitle>
            <CardDescription>Performance across all live initiatives</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {campaigns.map((campaign, index) => (
                <div key={index} className="flex flex-col lg:flex-row gap-8 p-6 rounded-2xl bg-zinc-50">
                  <div className="lg:w-80">
                    <div className="uppercase text-xs tracking-widest text-zinc-500 mb-1">{campaign.objective}</div>
                    <h3 className="text-xl font-semibold tracking-tight">{campaign.name}</h3>
                    <p className="text-sm text-zinc-500 mt-1">{campaign.platform}</p>
                  </div>

                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6">
                    <div>
                      <div className="text-xs text-zinc-500">REACH</div>
                      <div className="text-2xl font-semibold mt-1 tracking-tighter">{formatNumber(campaign.reach)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-zinc-500">CLICKS</div>
                      <div className="text-2xl font-semibold mt-1 tracking-tighter">{formatNumber(campaign.clicks)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-zinc-500">LEADS</div>
                      <div className="text-2xl font-semibold mt-1 tracking-tighter">{formatNumber(campaign.leads)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-zinc-500">ROI</div>
                      <div className="text-2xl font-semibold mt-1 text-emerald-600">×{campaign.roi}</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Badge 
                      className={`rounded-full px-5 py-1.5 ${campaign.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-200 text-zinc-700'}`}
                    >
                      {campaign.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Executive Insights */}
        {/* <Card className="rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-950 text-white border-none">
          <CardHeader>
            <CardTitle className="text-white">Executive Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1 w-8 h-8 rounded-2xl bg-white/10 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Reels continue to outperform static content by 3.4× in engagement.</p>
                    <p className="text-sm text-zinc-400 mt-2">Strong recommendation: Allocate 65% of budget to short-form video.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1 w-8 h-8 rounded-2xl bg-white/10 flex items-center justify-center">
                    <Award className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">LinkedIn is driving highest quality leads this quarter.</p>
                    <p className="text-sm text-zinc-400 mt-2">Consider doubling down on thought leadership content for B2B clients.</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-white/10" />

            <div className="text-xs uppercase tracking-[2px] text-zinc-500">KEY RECOMMENDATION</div>
            <p className="text-xl leading-snug">
              Focus next month on <span className="text-[#a855f7] font-medium">Instagram Reels + LinkedIn Native Posts</span>. 
              These two formats are currently responsible for 71% of all qualified leads.
            </p>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}