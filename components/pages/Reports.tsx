"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import {
  FileText,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart as PieIcon,
  Calendar,
  Download,
  Filter,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Award,
  Users,
  Eye,
  Heart,
  Share2,
  Clock,
  CheckCircle2,
  Printer,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CONTENT_BRAND = "#430062";

/* ───────── TYPES ───────── */
interface ReportPeriod {
  label: string;
  startDate: string;
  endDate: string;
}

interface MetricData {
  name: string;
  value: number;
  previousValue?: number;
  change?: number;
}

interface ChartDataPoint {
  name: string;
  reach: number;
  impressions: number;
  engagement: number;
  clicks: number;
  shares: number;
  saves: number;
}

interface ContentTypePerformance {
  type: string;
  reach: number;
  engagement: number;
  posts: number;
  avgEngagementRate: number;
}

interface PlatformPerformance {
  platform: string;
  reach: number;
  engagement: number;
  followers: number;
  growth: number;
}

interface InsightItem {
  type: "positive" | "negative" | "neutral";
  title: string;
  description: string;
  metric: string;
  change: number;
  icon: React.ElementType;
}

/* ───────── MOCK DATA ───────── */
const WEEKLY_DATA: ChartDataPoint[] = [
  {
    name: "Mon",
    reach: 12400,
    impressions: 22100,
    engagement: 1840,
    clicks: 340,
    shares: 120,
    saves: 89,
  },
  {
    name: "Tue",
    reach: 15600,
    impressions: 28400,
    engagement: 2340,
    clicks: 420,
    shares: 156,
    saves: 112,
  },
  {
    name: "Wed",
    reach: 18900,
    impressions: 34200,
    engagement: 2890,
    clicks: 510,
    shares: 198,
    saves: 145,
  },
  {
    name: "Thu",
    reach: 14200,
    impressions: 25800,
    engagement: 1980,
    clicks: 380,
    shares: 134,
    saves: 98,
  },
  {
    name: "Fri",
    reach: 21300,
    impressions: 39800,
    engagement: 3560,
    clicks: 620,
    shares: 245,
    saves: 178,
  },
  {
    name: "Sat",
    reach: 24500,
    impressions: 45200,
    engagement: 4120,
    clicks: 780,
    shares: 289,
    saves: 210,
  },
  {
    name: "Sun",
    reach: 19800,
    impressions: 36700,
    engagement: 3240,
    clicks: 590,
    shares: 210,
    saves: 165,
  },
];

const MONTHLY_DATA: ChartDataPoint[] = [
  {
    name: "Week 1",
    reach: 89000,
    impressions: 165000,
    engagement: 14200,
    clicks: 2800,
    shares: 980,
    saves: 720,
  },
  {
    name: "Week 2",
    reach: 102000,
    impressions: 189000,
    engagement: 16800,
    clicks: 3200,
    shares: 1150,
    saves: 890,
  },
  {
    name: "Week 3",
    reach: 115000,
    impressions: 212000,
    engagement: 19500,
    clicks: 3800,
    shares: 1380,
    saves: 1050,
  },
  {
    name: "Week 4",
    reach: 128000,
    impressions: 238000,
    engagement: 22400,
    clicks: 4200,
    shares: 1560,
    saves: 1200,
  },
];

const QUARTERLY_DATA: ChartDataPoint[] = [
  {
    name: "Jan",
    reach: 420000,
    impressions: 780000,
    engagement: 68000,
    clicks: 12500,
    shares: 4500,
    saves: 3400,
  },
  {
    name: "Feb",
    reach: 385000,
    impressions: 720000,
    engagement: 62000,
    clicks: 11200,
    shares: 4100,
    saves: 3100,
  },
  {
    name: "Mar",
    reach: 510000,
    impressions: 950000,
    engagement: 89000,
    clicks: 16800,
    shares: 5800,
    saves: 4500,
  },
];

const CONTENT_TYPE_DATA: ContentTypePerformance[] = [
  {
    type: "Reels",
    reach: 245000,
    engagement: 34200,
    posts: 12,
    avgEngagementRate: 13.96,
  },
  {
    type: "Carousels",
    reach: 189000,
    engagement: 21800,
    posts: 8,
    avgEngagementRate: 11.53,
  },
  {
    type: "Single Image",
    reach: 156000,
    engagement: 12400,
    posts: 15,
    avgEngagementRate: 7.95,
  },
  {
    type: "Stories",
    reach: 98000,
    engagement: 8900,
    posts: 24,
    avgEngagementRate: 9.08,
  },
  {
    type: "Videos",
    reach: 198000,
    engagement: 25600,
    posts: 6,
    avgEngagementRate: 12.93,
  },
];

const PLATFORM_DATA: PlatformPerformance[] = [
  {
    platform: "Instagram",
    reach: 320000,
    engagement: 45200,
    followers: 45000,
    growth: 12.5,
  },
  {
    platform: "Facebook",
    reach: 180000,
    engagement: 21800,
    followers: 28000,
    growth: 8.3,
  },
  {
    platform: "TikTok",
    reach: 210000,
    engagement: 38900,
    followers: 32000,
    growth: 24.7,
  },
  {
    platform: "LinkedIn",
    reach: 89000,
    engagement: 12400,
    followers: 15000,
    growth: 15.2,
  },
  {
    platform: "Twitter",
    reach: 56000,
    engagement: 6700,
    followers: 12000,
    growth: -2.1,
  },
];

const INSIGHTS: InsightItem[] = [
  {
    type: "positive",
    title: "Reels Dominate Engagement",
    description:
      "Reels outperformed all other content types with a 42% higher engagement rate compared to static posts.",
    metric: "+42%",
    change: 42,
    icon: TrendingUp,
  },
  {
    type: "positive",
    title: "Engagement Surge",
    description:
      "Overall engagement increased by 18% compared to the previous period, driven by video content.",
    metric: "+18%",
    change: 18,
    icon: ArrowUpRight,
  },
  {
    type: "positive",
    title: "TikTok Growth Accelerating",
    description:
      "TikTok follower growth reached 24.7% this quarter, the highest across all platforms.",
    metric: "+24.7%",
    change: 24.7,
    icon: Target,
  },
  {
    type: "negative",
    title: "Twitter Performance Declining",
    description:
      "Twitter engagement dropped by 2.1% this period. Consider adjusting content strategy.",
    metric: "-2.1%",
    change: -2.1,
    icon: TrendingDown,
  },
  {
    type: "neutral",
    title: "Optimal Posting Time",
    description:
      "Friday and Saturday posts received 35% more reach than weekday content.",
    metric: "Fri-Sat",
    change: 35,
    icon: Clock,
  },
  {
    type: "positive",
    title: "Profile Visit Conversion",
    description:
      "Profile visits from content increased by 28%, indicating stronger brand interest.",
    metric: "+28%",
    change: 28,
    icon: Users,
  },
];

const PIE_COLORS = [
  "#430062",
  "#7c3aed",
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#ef4444",
];
const AREA_COLORS = {
  reach: "#430062",
  impressions: "#7c3aed",
  engagement: "#10b981",
  clicks: "#0ea5e9",
};

/* ───────── HELPERS ───────── */
const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

const formatPercent = (num: number): string =>
  `${num >= 0 ? "+" : ""}${num.toFixed(1)}%`;

/* ───────── CUSTOM TOOLTIP ───────── */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white p-3 shadow-lg ring-1 ring-black/[0.03]">
      <p className="text-xs font-semibold text-zinc-900 mb-2">{label}</p>
      {payload.map((entry: any, idx: number) => (
        <div key={idx} className="flex items-center gap-2 text-xs">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-zinc-600">{entry.name}:</span>
          <span className="font-semibold text-zinc-900 tabular-nums">
            {formatNumber(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

/* ───────── MAIN COMPONENT ───────── */
export default function ReportsModule() {
  const [activeTab, setActiveTab] = useState<
    "weekly" | "monthly" | "quarterly"
  >("weekly");
  const [clientFilter, setClientFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [dateRange, setDateRange] = useState("last30");
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /* ───────── DATA SELECTION ───────── */
  const chartData = useMemo(() => {
    switch (activeTab) {
      case "weekly":
        return WEEKLY_DATA;
      case "monthly":
        return MONTHLY_DATA;
      case "quarterly":
        return QUARTERLY_DATA;
      default:
        return WEEKLY_DATA;
    }
  }, [activeTab]);

  /* ───────── AGGREGATES ───────── */
  const aggregates = useMemo(() => {
    const totalReach = chartData.reduce((s, d) => s + d.reach, 0);
    const totalImpressions = chartData.reduce((s, d) => s + d.impressions, 0);
    const totalEngagement = chartData.reduce((s, d) => s + d.engagement, 0);
    const totalClicks = chartData.reduce((s, d) => s + d.clicks, 0);
    const engagementRate = (totalEngagement / totalReach) * 100;
    const prevEngagementRate = engagementRate - 2.3; // Mock previous

    return {
      totalReach,
      totalImpressions,
      totalEngagement,
      totalClicks,
      engagementRate,
      engagementGrowth:
        ((engagementRate - prevEngagementRate) / prevEngagementRate) * 100,
      bestContentType: CONTENT_TYPE_DATA.reduce((a, b) =>
        a.avgEngagementRate > b.avgEngagementRate ? a : b,
      ),
      bestPlatform: PLATFORM_DATA.reduce((a, b) =>
        a.growth > b.growth ? a : b,
      ),
    };
  }, [chartData]);

  /* ───────── HANDLERS ───────── */
  const handleExport = (format: "pdf" | "csv" | "pptx") => {
    setIsExportOpen(false);
    // Implement export logic
    console.log(`Exporting as ${format}...`);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  };

  /* ───────── RENDER ───────── */
  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      {/* ═══════ PERIOD TABS ═══════ */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as typeof activeTab)}
        className="w-full"
      >
        <TabsList className="flex h-auto w-full flex-wrap gap-1 rounded-xl border border-zinc-200/80 bg-white/90 p-1 shadow-sm ring-1 ring-black/[0.03] md:w-fit">
          {[
            { value: "weekly", label: "Weekly Report", icon: Calendar },
            { value: "monthly", label: "Monthly Report", icon: BarChart3 },
            { value: "quarterly", label: "Quarterly Report", icon: PieIcon },
          ].map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="flex-1 justify-center rounded-lg px-4 py-2.5 text-xs data-[state=active]:bg-[#430062]/10 data-[state=active]:text-[#430062] data-[state=active]:shadow-sm sm:flex-none sm:px-6 sm:text-sm"
            >
              <Icon className="mr-2 h-4 w-4 flex-shrink-0" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ═══════ FILTERS BAR ═══════ */}
        <div className="mt-6 rounded-2xl border border-zinc-200/80 bg-white/90 p-4 shadow-sm ring-1 ring-black/[0.03] sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Select value={clientFilter} onValueChange={setClientFilter}>
                <SelectTrigger className="h-10 w-full rounded-xl border-zinc-200/80 bg-white sm:w-44">
                  <SelectValue placeholder="All Clients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  <SelectItem value="acme">Acme Corp</SelectItem>
                  <SelectItem value="globex">Globex Inc</SelectItem>
                  <SelectItem value="stark">Stark Industries</SelectItem>
                </SelectContent>
              </Select>

              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger className="h-10 w-full rounded-xl border-zinc-200/80 bg-white sm:w-44">
                  <SelectValue placeholder="All Platforms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="h-10 w-full rounded-xl border-zinc-200/80 bg-white sm:w-44">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last7">Last 7 Days</SelectItem>
                  <SelectItem value="last30">Last 30 Days</SelectItem>
                  <SelectItem value="last90">Last 90 Days</SelectItem>
                  <SelectItem value="ytd">Year to Date</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
                className="h-10 rounded-xl border-zinc-200/80 hover:border-zinc-300 hover:bg-zinc-50"
              >
                <Clock
                  className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>

              <Button
                size="sm"
                onClick={() => setIsExportOpen(true)}
                className="h-10 rounded-xl bg-[#430062] text-white shadow-md shadow-[#430062]/20 hover:bg-[#5a0080]"
              >
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            </div>
          </div>
        </div>

        {/* ═══════ SUMMARY CARDS ═══════ */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 sm:gap-4 lg:gap-6">
          {[
            {
              label: "Total Reach",
              value: formatNumber(aggregates.totalReach),
              change: "+12.5%",
              positive: true,
              icon: Eye,
              color: "#430062",
            },
            {
              label: "Impressions",
              value: formatNumber(aggregates.totalImpressions),
              change: "+8.3%",
              positive: true,
              icon: BarChart3,
              color: "#7c3aed",
            },
            {
              label: "Engagement",
              value: formatNumber(aggregates.totalEngagement),
              change: formatPercent(aggregates.engagementGrowth),
              positive: aggregates.engagementGrowth > 0,
              icon: Heart,
              color: "#10b981",
            },
            {
              label: "Eng. Rate",
              value: `${aggregates.engagementRate.toFixed(2)}%`,
              change: "+0.8%",
              positive: true,
              icon: Target,
              color: "#0ea5e9",
            },
            {
              label: "Best Content",
              value: aggregates.bestContentType.type,
              change: `${aggregates.bestContentType.avgEngagementRate.toFixed(1)}%`,
              positive: true,
              icon: Award,
              color: "#f59e0b",
            },
            {
              label: "Top Platform",
              value: aggregates.bestPlatform.platform,
              change: `+${aggregates.bestPlatform.growth}%`,
              positive: true,
              icon: TrendingUp,
              color: "#ef4444",
            },
          ].map((card, idx) => (
            <Card
              key={idx}
              className="rounded-2xl border-zinc-200/80 bg-white shadow-sm ring-1 ring-black/[0.03] overflow-hidden"
            >
              <div
                className="h-1 w-full"
                style={{ backgroundColor: card.color }}
              />
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${card.color}15` }}
                  >
                    <card.icon
                      className="h-4 w-4"
                      style={{ color: card.color }}
                    />
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-semibold ${
                      card.positive
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-red-200 bg-red-50 text-red-700"
                    }`}
                  >
                    {card.change}
                  </Badge>
                </div>
                <p className="text-xs text-zinc-500 mb-1">{card.label}</p>
                <p className="text-lg sm:text-xl font-bold text-zinc-900 truncate">
                  {card.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ═══════ MAIN CHARTS SECTION ═══════ */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Primary Chart - Reach & Engagement Trend */}
          <Card className="lg:col-span-2 rounded-2xl border-zinc-200/80 bg-white shadow-sm ring-1 ring-black/[0.03]">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base sm:text-lg font-semibold text-zinc-900">
                    Performance Overview
                  </CardTitle>
                  <p className="text-sm text-zinc-500 mt-1">
                    Reach vs Engagement vs Impressions
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className="text-xs bg-zinc-100 text-zinc-600"
                >
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[320px] sm:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="reachGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={AREA_COLORS.reach}
                          stopOpacity={0.15}
                        />
                        <stop
                          offset="95%"
                          stopColor={AREA_COLORS.reach}
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient id="engGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor={AREA_COLORS.engagement}
                          stopOpacity={0.15}
                        />
                        <stop
                          offset="95%"
                          stopColor={AREA_COLORS.engagement}
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient id="impGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor={AREA_COLORS.impressions}
                          stopOpacity={0.1}
                        />
                        <stop
                          offset="95%"
                          stopColor={AREA_COLORS.impressions}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#71717a", fontSize: 12 }}
                      axisLine={{ stroke: "#e4e4e7" }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#71717a", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => formatNumber(v)}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="impressions"
                      stroke={AREA_COLORS.impressions}
                      strokeWidth={2}
                      fill="url(#impGrad)"
                      name="Impressions"
                    />
                    <Area
                      type="monotone"
                      dataKey="reach"
                      stroke={AREA_COLORS.reach}
                      strokeWidth={2}
                      fill="url(#reachGrad)"
                      name="Reach"
                    />
                    <Area
                      type="monotone"
                      dataKey="engagement"
                      stroke={AREA_COLORS.engagement}
                      strokeWidth={2}
                      fill="url(#engGrad)"
                      name="Engagement"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Secondary Chart - Content Type Distribution */}
          <Card className="rounded-2xl border-zinc-200/80 bg-white shadow-sm ring-1 ring-black/[0.03]">
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg font-semibold text-zinc-900">
                Content Type Performance
              </CardTitle>
              <p className="text-sm text-zinc-500 mt-1">
                Reach distribution by format
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] sm:h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={CONTENT_TYPE_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="reach"
                      nameKey="type"
                    >
                      {CONTENT_TYPE_DATA.map((_, idx) => (
                        <Cell
                          key={idx}
                          fill={PIE_COLORS[idx % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [
                        formatNumber(Number(value)),
                        "Reach",
                      ]}
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #e4e4e7",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {CONTENT_TYPE_DATA.map((item, idx) => (
                  <div
                    key={item.type}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: PIE_COLORS[idx] }}
                      />
                      <span className="text-zinc-700">{item.type}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-zinc-500 text-xs">
                        {item.posts} posts
                      </span>
                      <span className="font-semibold text-zinc-900 tabular-nums">
                        {item.avgEngagementRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ═══════ PLATFORM & ENGAGEMENT BREAKDOWN ═══════ */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Platform Performance */}
          <Card className="rounded-2xl border-zinc-200/80 bg-white shadow-sm ring-1 ring-black/[0.03]">
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg font-semibold text-zinc-900">
                Platform Performance
              </CardTitle>
              <p className="text-sm text-zinc-500 mt-1">
                Growth rate across all channels
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={PLATFORM_DATA}
                    layout="vertical"
                    margin={{ left: 0, right: 20 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f4f4f5"
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      tick={{ fill: "#71717a", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => formatNumber(v)}
                    />
                    <YAxis
                      type="category"
                      dataKey="platform"
                      tick={{ fill: "#71717a", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      width={80}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="reach"
                      fill={`${CONTENT_BRAND}20`}
                      radius={[0, 6, 6, 0]}
                      name="Reach"
                    />
                    <Bar
                      dataKey="engagement"
                      fill={CONTENT_BRAND}
                      radius={[0, 6, 6, 0]}
                      name="Engagement"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-5 gap-2">
                {PLATFORM_DATA.map((p) => (
                  <div key={p.platform} className="text-center">
                    <p className="text-xs text-zinc-500 mb-1">{p.platform}</p>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${
                        p.growth >= 0
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-red-200 bg-red-50 text-red-700"
                      }`}
                    >
                      {p.growth >= 0 ? "+" : ""}
                      {p.growth}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Engagement Composition */}
          <Card className="rounded-2xl border-zinc-200/80 bg-white shadow-sm ring-1 ring-black/[0.03]">
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg font-semibold text-zinc-900">
                Engagement Composition
              </CardTitle>
              <p className="text-sm text-zinc-500 mt-1">
                Breakdown of interaction types
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#71717a", fontSize: 12 }}
                      axisLine={{ stroke: "#e4e4e7" }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#71717a", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => formatNumber(v)}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }}
                    />
                    <Bar
                      dataKey="likes"
                      stackId="a"
                      fill="#ef4444"
                      radius={[0, 0, 0, 0]}
                      name="Likes"
                    />
                    <Bar
                      dataKey="comments"
                      stackId="a"
                      fill="#8b5cf6"
                      radius={[0, 0, 0, 0]}
                      name="Comments"
                    />
                    <Bar
                      dataKey="shares"
                      stackId="a"
                      fill="#0ea5e9"
                      radius={[0, 0, 0, 0]}
                      name="Shares"
                    />
                    <Bar
                      dataKey="saves"
                      stackId="a"
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                      name="Saves"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ═══════ INSIGHT BLOCKS ═══════ */}
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-[#430062]" />
            <h2 className="text-lg font-semibold text-zinc-900">
              Key Insights
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {INSIGHTS.map((insight, idx) => (
              <Card
                key={idx}
                className={`rounded-2xl border shadow-sm ring-1 transition-all hover:shadow-md ${
                  insight.type === "positive"
                    ? "border-emerald-200/80 bg-emerald-50/30 ring-emerald-500/10"
                    : insight.type === "negative"
                      ? "border-red-200/80 bg-red-50/30 ring-red-500/10"
                      : "border-amber-200/80 bg-amber-50/30 ring-amber-500/10"
                }`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        insight.type === "positive"
                          ? "bg-emerald-100 text-emerald-700"
                          : insight.type === "negative"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      <insight.icon className="h-5 w-5" />
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs font-bold ${
                        insight.type === "positive"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : insight.type === "negative"
                            ? "border-red-200 bg-red-50 text-red-700"
                            : "border-amber-200 bg-amber-50 text-amber-700"
                      }`}
                    >
                      {insight.metric}
                    </Badge>
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-900 mb-2">
                    {insight.title}
                  </h3>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    {insight.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* ═══════ EXECUTIVE SUMMARY ═══════ */}
        <Card className="mt-6 rounded-2xl border-zinc-200/80 bg-gradient-to-br from-[#430062]/[0.03] to-white shadow-sm ring-1 ring-black/[0.03]">
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="h-5 w-5 text-[#430062]" />
              <h2 className="text-lg font-semibold text-zinc-900">
                Executive Summary
              </h2>
            </div>
            <div className="prose prose-zinc max-w-none">
              <p className="text-sm sm:text-base text-zinc-700 leading-relaxed">
                This <strong>{activeTab}</strong> period shows strong
                performance across organic channels. Total reach of{" "}
                <strong>{formatNumber(aggregates.totalReach)}</strong>{" "}
                represents a significant audience exposure, with an engagement
                rate of <strong>{aggregates.engagementRate.toFixed(2)}%</strong>{" "}
                indicating healthy audience interaction.
              </p>
              <p className="text-sm sm:text-base text-zinc-700 leading-relaxed mt-3">
                <strong>{aggregates.bestContentType.type}</strong> continues to
                be the top-performing content format, achieving{" "}
                <strong>
                  {aggregates.bestContentType.avgEngagementRate.toFixed(1)}%
                </strong>{" "}
                average engagement.
                <strong> {aggregates.bestPlatform.platform}</strong> leads
                platform growth at{" "}
                <strong>+{aggregates.bestPlatform.growth}%</strong>, suggesting
                strategic focus here would yield maximum ROI.
              </p>
              <p className="text-sm sm:text-base text-zinc-700 leading-relaxed mt-3">
                Key recommendation: Increase{" "}
                <strong>{aggregates.bestContentType.type}</strong> production by
                25% next period and investigate underperforming Twitter content
                for optimization opportunities.
              </p>
            </div>
          </CardContent>
        </Card>
      </Tabs>

      {/* ═══════ EXPORT DIALOG ═══════ */}
      <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
        <DialogContent className="rounded-2xl border-zinc-200/80 p-0 shadow-2xl sm:max-w-md">
          <DialogHeader className="border-b border-zinc-100 px-6 py-5">
            <DialogTitle className="text-lg font-semibold text-zinc-900">
              Export Report
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 space-y-4">
            <p className="text-sm text-zinc-500">
              Choose your preferred export format for the {activeTab} report.
            </p>
            <div className="grid grid-cols-1 gap-3">
              <Button
                variant="outline"
                onClick={() => handleExport("pdf")}
                className="h-14 justify-start gap-4 rounded-xl border-zinc-200/80 hover:bg-zinc-50 hover:border-zinc-300"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
                  <FileText className="h-5 w-5 text-red-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-zinc-900">
                    PDF Report
                  </p>
                  <p className="text-xs text-zinc-500">
                    Presentation-ready document
                  </p>
                </div>
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExport("csv")}
                className="h-14 justify-start gap-4 rounded-xl border-zinc-200/80 hover:bg-zinc-50 hover:border-zinc-300"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
                  <BarChart3 className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-zinc-900">
                    CSV Data
                  </p>
                  <p className="text-xs text-zinc-500">Raw data for analysis</p>
                </div>
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExport("pptx")}
                className="h-14 justify-start gap-4 rounded-xl border-zinc-200/80 hover:bg-zinc-50 hover:border-zinc-300"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
                  <Award className="h-5 w-5 text-amber-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-zinc-900">
                    PowerPoint
                  </p>
                  <p className="text-xs text-zinc-500">
                    Slides for stakeholder meetings
                  </p>
                </div>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
