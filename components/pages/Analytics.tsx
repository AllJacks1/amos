"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search,
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MousePointer,
  UserCheck,
  BarChart3,
  Clock,
  Timer,
  Video,
  Filter,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Calendar,
  Download,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InstagramIcon } from "../icons/Instagram";
import { FacebookIcon } from "../icons/Facebook";
import { LinkedInIcon } from "../icons/LinkedIn";
import { XIcon } from "../icons/X";
import { TikTokIcon } from "../icons/TikTok";

const CONTENT_BRAND = "#430062";

/* ───────── TYPES ───────── */
interface OrganicPost {
  id: string;
  contentTitle: string;
  platform: "instagram" | "facebook" | "linkedin" | "twitter" | "tiktok";
  contentType: "image" | "video" | "carousel" | "reel" | "story";
  publishDate: string;
  
  // Core Metrics
  reach: number;
  impressions: number;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  clicks: number;
  profileVisits: number;
  
  // Video Metrics (optional for non-video)
  watchTimeSeconds?: number;
  avgWatchTimeSeconds?: number;
  
  // Auto-calculated
  interactions: number; // likes + comments + shares + saves + clicks
  engagementRate: number; // (interactions / reach) * 100
}

/* ───────── PLATFORM CONFIG ───────── */
const PLATFORM_CONFIG = {
  instagram: { label: "Instagram", icon: InstagramIcon, color: "#E4405F" },
  facebook: { label: "Facebook", icon: FacebookIcon, color: "#1877F2" },
  linkedin: { label: "LinkedIn", icon: LinkedInIcon, color: "#0A66C2" },
  twitter: { label: "Twitter", icon: XIcon, color: "#1DA1F2" },
  tiktok: { label: "TikTok", icon: TikTokIcon, color: "#000000" },
} as const;

const CONTENT_TYPE_CONFIG = {
  image: { label: "Image", color: "#0ea5e9" },
  video: { label: "Video", color: "#ef4444" },
  carousel: { label: "Carousel", color: "#8b5cf6" },
  reel: { label: "Reel", color: "#f59e0b" },
  story: { label: "Story", color: "#10b981" },
} as const;

/* ───────── MOCK DATA ───────── */
const MOCK_POSTS: OrganicPost[] = [
  {
    id: "post_001",
    contentTitle: "Summer Campaign Launch",
    platform: "instagram",
    contentType: "reel",
    publishDate: "2026-06-01T10:00:00+08:00",
    reach: 15420,
    impressions: 28300,
    views: 22100,
    likes: 1845,
    comments: 127,
    shares: 89,
    saves: 234,
    clicks: 456,
    profileVisits: 312,
    watchTimeSeconds: 184500,
    avgWatchTimeSeconds: 8,
    interactions: 2751,
    engagementRate: 17.84,
  },
  {
    id: "post_002",
    contentTitle: "Product Tutorial Series #3",
    platform: "tiktok",
    contentType: "video",
    publishDate: "2026-05-30T14:30:00+08:00",
    reach: 45200,
    impressions: 89100,
    views: 67800,
    likes: 5200,
    comments: 340,
    shares: 890,
    saves: 120,
    clicks: 780,
    profileVisits: 650,
    watchTimeSeconds: 542400,
    avgWatchTimeSeconds: 8,
    interactions: 7330,
    engagementRate: 16.22,
  },
  {
    id: "post_003",
    contentTitle: "Behind the Scenes: Office Culture",
    platform: "linkedin",
    contentType: "carousel",
    publishDate: "2026-05-28T09:00:00+08:00",
    reach: 8200,
    impressions: 15600,
    views: 9800,
    likes: 456,
    comments: 89,
    shares: 67,
    saves: 45,
    clicks: 234,
    profileVisits: 178,
    interactions: 891,
    engagementRate: 10.87,
  },
  {
    id: "post_004",
    contentTitle: "Customer Testimonial: Sarah's Story",
    platform: "facebook",
    contentType: "video",
    publishDate: "2026-05-25T16:00:00+08:00",
    reach: 12300,
    impressions: 22100,
    views: 18900,
    likes: 890,
    comments: 156,
    shares: 234,
    saves: 67,
    clicks: 345,
    profileVisits: 289,
    watchTimeSeconds: 189000,
    avgWatchTimeSeconds: 10,
    interactions: 1692,
    engagementRate: 13.76,
  },
  {
    id: "post_005",
    contentTitle: "Weekly Tips: Content Strategy",
    platform: "instagram",
    contentType: "carousel",
    publishDate: "2026-05-22T11:00:00+08:00",
    reach: 9800,
    impressions: 18200,
    views: 14500,
    likes: 678,
    comments: 45,
    shares: 34,
    saves: 189,
    clicks: 267,
    profileVisits: 198,
    interactions: 1213,
    engagementRate: 12.38,
  },
  {
    id: "post_006",
    contentTitle: "New Feature Announcement",
    platform: "twitter",
    contentType: "image",
    publishDate: "2026-05-20T08:00:00+08:00",
    reach: 5600,
    impressions: 12400,
    views: 8900,
    likes: 234,
    comments: 45,
    shares: 123,
    saves: 12,
    clicks: 189,
    profileVisits: 145,
    interactions: 603,
    engagementRate: 10.77,
  },
  {
    id: "post_007",
    contentTitle: "Holiday Special Preview",
    platform: "instagram",
    contentType: "story",
    publishDate: "2026-05-18T20:00:00+08:00",
    reach: 6700,
    impressions: 13400,
    views: 11200,
    likes: 345,
    comments: 12,
    shares: 23,
    saves: 8,
    clicks: 156,
    profileVisits: 98,
    interactions: 544,
    engagementRate: 8.12,
  },
  {
    id: "post_008",
    contentTitle: "CEO Interview: Future Vision",
    platform: "linkedin",
    contentType: "video",
    publishDate: "2026-05-15T10:00:00+08:00",
    reach: 18900,
    impressions: 34200,
    views: 28700,
    likes: 1234,
    comments: 234,
    shares: 456,
    saves: 89,
    clicks: 567,
    profileVisits: 445,
    watchTimeSeconds: 430200,
    avgWatchTimeSeconds: 15,
    interactions: 2580,
    engagementRate: 13.65,
  },
  {
    id: "post_009",
    contentTitle: "User-Generated Content Spotlight",
    platform: "instagram",
    contentType: "image",
    publishDate: "2026-05-12T14:00:00+08:00",
    reach: 11200,
    impressions: 20800,
    views: 16500,
    likes: 1567,
    comments: 89,
    shares: 45,
    saves: 234,
    clicks: 378,
    profileVisits: 267,
    interactions: 2313,
    engagementRate: 20.65,
  },
  {
    id: "post_010",
    contentTitle: "Product Demo: New Dashboard",
    platform: "tiktok",
    contentType: "video",
    publishDate: "2026-05-10T09:30:00+08:00",
    reach: 32100,
    impressions: 67800,
    views: 54200,
    likes: 3400,
    comments: 278,
    shares: 567,
    saves: 89,
    clicks: 890,
    profileVisits: 712,
    watchTimeSeconds: 325600,
    avgWatchTimeSeconds: 6,
    interactions: 5224,
    engagementRate: 16.27,
  },
  {
    id: "post_011",
    contentTitle: "Team Spotlight: Design Department",
    platform: "facebook",
    contentType: "carousel",
    publishDate: "2026-05-08T11:00:00+08:00",
    reach: 7800,
    impressions: 14500,
    views: 11200,
    likes: 456,
    comments: 67,
    shares: 34,
    saves: 23,
    clicks: 189,
    profileVisits: 156,
    interactions: 769,
    engagementRate: 9.86,
  },
  {
    id: "post_012",
    contentTitle: "Industry Trends Report 2026",
    platform: "linkedin",
    contentType: "image",
    publishDate: "2026-05-05T08:00:00+08:00",
    reach: 15400,
    impressions: 28900,
    views: 22300,
    likes: 890,
    comments: 156,
    shares: 234,
    saves: 67,
    clicks: 445,
    profileVisits: 334,
    interactions: 1792,
    engagementRate: 11.64,
  },
];

/* ───────── HELPERS ───────── */
const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

const formatDuration = (seconds?: number): string => {
  if (!seconds) return "—";
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

const formatDate = (dateStr: string): string => {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      timeZone: "Asia/Manila",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const getPlatformIcon = (platform: string) => {
  const cfg = PLATFORM_CONFIG[platform as keyof typeof PLATFORM_CONFIG];
  if (!cfg) return null;
  const Icon = cfg.icon;
  return <Icon className="h-4 w-4" style={{ color: cfg.color }} />;
};

const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

/* ───────── MAIN COMPONENT ───────── */
export default function OrganicPerformanceTracker() {
  const [posts, setPosts] = useState<OrganicPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [contentTypeFilter, setContentTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState<keyof OrganicPost>("publishDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  /* ───────── FETCH DATA ───────── */
  const fetchPosts = async () => {
    setLoading(true);
    try {
      // Replace with: const res = await fetch("/api/organic-performance");
      await new Promise((resolve) => setTimeout(resolve, 800));
      setPosts(MOCK_POSTS);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  /* ───────── AGGREGATE METRICS ───────── */
  const aggregateMetrics = useMemo(() => {
    if (!posts.length) return null;

    const totalReach = posts.reduce((sum, p) => sum + p.reach, 0);
    const totalImpressions = posts.reduce((sum, p) => sum + p.impressions, 0);
    const totalViews = posts.reduce((sum, p) => sum + p.views, 0);
    const totalLikes = posts.reduce((sum, p) => sum + p.likes, 0);
    const totalComments = posts.reduce((sum, p) => sum + p.comments, 0);
    const totalShares = posts.reduce((sum, p) => sum + p.shares, 0);
    const totalSaves = posts.reduce((sum, p) => sum + p.saves, 0);
    const totalClicks = posts.reduce((sum, p) => sum + p.clicks, 0);
    const totalProfileVisits = posts.reduce((sum, p) => sum + p.profileVisits, 0);
    const totalInteractions = posts.reduce((sum, p) => sum + p.interactions, 0);
    const avgEngagementRate = posts.reduce((sum, p) => sum + p.engagementRate, 0) / posts.length;

    // Video-specific
    const videoPosts = posts.filter((p) => p.watchTimeSeconds);
    const totalWatchTime = videoPosts.reduce((sum, p) => sum + (p.watchTimeSeconds || 0), 0);
    const avgWatchTime = videoPosts.length
      ? videoPosts.reduce((sum, p) => sum + (p.avgWatchTimeSeconds || 0), 0) / videoPosts.length
      : 0;

    return {
      totalReach,
      totalImpressions,
      totalViews,
      totalLikes,
      totalComments,
      totalShares,
      totalSaves,
      totalClicks,
      totalProfileVisits,
      totalInteractions,
      avgEngagementRate,
      totalWatchTime,
      avgWatchTime,
      videoCount: videoPosts.length,
    };
  }, [posts]);

  /* ───────── FILTERING & SORTING ───────── */
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // Search
    const searchValue = String(searchTerm ?? "").toLowerCase().trim();
    if (searchValue) {
      result = result.filter((p) => {
        const title = String(p.contentTitle).toLowerCase();
        const platform = String(p.platform).toLowerCase();
        return title.includes(searchValue) || platform.includes(searchValue);
      });
    }

    // Platform filter
    if (platformFilter !== "all") {
      result = result.filter((p) => p.platform === platformFilter);
    }

    // Content type filter
    if (contentTypeFilter !== "all") {
      result = result.filter((p) => p.contentType === contentTypeFilter);
    }

    // Sort
    result.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sortOrder === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

    return result;
  }, [posts, searchTerm, platformFilter, contentTypeFilter, sortBy, sortOrder]);

  /* ───────── PAGINATION ───────── */
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, platformFilter, contentTypeFilter]);

  const handleSort = (column: keyof OrganicPost) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  /* ───────── RENDER ───────── */
  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      {/* ═══════ HEADER ═══════ */}
      <div className="rounded-2xl border border-zinc-200/80 bg-white/90 p-4 shadow-sm ring-1 ring-black/[0.03] backdrop-blur-sm sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${CONTENT_BRAND}15` }}
            >
              <TrendingUp className="h-5 w-5" style={{ color: CONTENT_BRAND }} />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-zinc-900 sm:text-xl">
                Organic Performance Tracker
              </h1>
              <p className="text-sm text-zinc-500">
                Track all organic content performance metrics
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 shrink-0 text-zinc-400" />
              <Input
                placeholder="Search posts..."
                className="h-10 w-full rounded-xl border-zinc-200/80 bg-zinc-50/50 pl-10 shadow-sm focus-visible:ring-[#430062]/15 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchPosts}
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

      {/* ═══════ AGGREGATE KPI CARDS ═══════ */}
      {aggregateMetrics && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4 lg:gap-6">
          {/* Reach */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white/90 p-4 shadow-sm ring-1 ring-black/[0.03] sm:p-5">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50">
                <Eye className="h-4 w-4 text-violet-600" />
              </div>
              <span className="text-xs font-medium text-zinc-600 sm:text-sm">
                Total Reach
              </span>
            </div>
            <div className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 tabular-nums sm:text-3xl">
              {formatNumber(aggregateMetrics.totalReach)}
            </div>
          </div>

          {/* Impressions */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white/90 p-4 shadow-sm ring-1 ring-black/[0.03] sm:p-5">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                <BarChart3 className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-zinc-600 sm:text-sm">
                Impressions
              </span>
            </div>
            <div className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 tabular-nums sm:text-3xl">
              {formatNumber(aggregateMetrics.totalImpressions)}
            </div>
          </div>

          {/* Views */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white/90 p-4 shadow-sm ring-1 ring-black/[0.03] sm:p-5">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50">
                <Video className="h-4 w-4 text-cyan-600" />
              </div>
              <span className="text-xs font-medium text-zinc-600 sm:text-sm">
                Total Views
              </span>
            </div>
            <div className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 tabular-nums sm:text-3xl">
              {formatNumber(aggregateMetrics.totalViews)}
            </div>
          </div>

          {/* Engagement Rate */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white/90 p-4 shadow-sm ring-1 ring-black/[0.03] sm:p-5">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
                <Activity className="h-4 w-4 text-emerald-600" />
              </div>
              <span className="text-xs font-medium text-zinc-600 sm:text-sm">
                Avg Engagement
              </span>
            </div>
            <div className="mt-3 text-2xl font-bold tracking-tight text-emerald-600 tabular-nums sm:text-3xl">
              {aggregateMetrics.avgEngagementRate.toFixed(2)}%
            </div>
          </div>

          {/* Interactions */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white/90 p-4 shadow-sm ring-1 ring-black/[0.03] sm:p-5">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
                <MousePointer className="h-4 w-4 text-amber-600" />
              </div>
              <span className="text-xs font-medium text-zinc-600 sm:text-sm">
                Interactions
              </span>
            </div>
            <div className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 tabular-nums sm:text-3xl">
              {formatNumber(aggregateMetrics.totalInteractions)}
            </div>
          </div>

          {/* Likes */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white/90 p-4 shadow-sm ring-1 ring-black/[0.03] sm:p-5">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50">
                <Heart className="h-4 w-4 text-rose-600" />
              </div>
              <span className="text-xs font-medium text-zinc-600 sm:text-sm">
                Likes
              </span>
            </div>
            <div className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 tabular-nums sm:text-3xl">
              {formatNumber(aggregateMetrics.totalLikes)}
            </div>
          </div>

          {/* Comments */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white/90 p-4 shadow-sm ring-1 ring-black/[0.03] sm:p-5">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
                <MessageCircle className="h-4 w-4 text-indigo-600" />
              </div>
              <span className="text-xs font-medium text-zinc-600 sm:text-sm">
                Comments
              </span>
            </div>
            <div className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 tabular-nums sm:text-3xl">
              {formatNumber(aggregateMetrics.totalComments)}
            </div>
          </div>

          {/* Shares + Saves */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white/90 p-4 shadow-sm ring-1 ring-black/[0.03] sm:p-5">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50">
                <Share2 className="h-4 w-4 text-teal-600" />
              </div>
              <span className="text-xs font-medium text-zinc-600 sm:text-sm">
                Shares & Saves
              </span>
            </div>
            <div className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 tabular-nums sm:text-3xl">
              {formatNumber(aggregateMetrics.totalShares + aggregateMetrics.totalSaves)}
            </div>
          </div>
        </div>
      )}

      {/* ═══════ VIDEO METRICS STRIP ═══════ */}
      {aggregateMetrics && aggregateMetrics.videoCount > 0 && (
        <div className="rounded-2xl border border-zinc-200/80 bg-gradient-to-r from-amber-50/50 to-orange-50/50 p-4 shadow-sm ring-1 ring-black/[0.03] sm:p-5">
          <div className="flex items-center gap-2 mb-4">
            <Video className="h-5 w-5 text-amber-600" />
            <h2 className="text-base font-semibold text-zinc-900 sm:text-lg">
              Video Performance
            </h2>
            <Badge variant="secondary" className="text-xs bg-white text-zinc-600">
              {aggregateMetrics.videoCount} video posts
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-zinc-500 mb-1">
                Total Watch Time
              </p>
              <p className="text-xl font-bold text-zinc-900 tabular-nums sm:text-2xl">
                {formatDuration(aggregateMetrics.totalWatchTime)}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-widest text-zinc-500 mb-1">
                Avg Watch Time
              </p>
              <p className="text-xl font-bold text-zinc-900 tabular-nums sm:text-2xl">
                {aggregateMetrics.avgWatchTime.toFixed(1)}s
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-widest text-zinc-500 mb-1">
                Profile Visits
              </p>
              <p className="text-xl font-bold text-zinc-900 tabular-nums sm:text-2xl">
                {formatNumber(aggregateMetrics.totalProfileVisits)}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-widest text-zinc-500 mb-1">
                Clicks
              </p>
              <p className="text-xl font-bold text-zinc-900 tabular-nums sm:text-2xl">
                {formatNumber(aggregateMetrics.totalClicks)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ FILTERS ═══════ */}
      <div className="rounded-2xl border border-zinc-200/80 bg-white/90 p-4 shadow-sm ring-1 ring-black/[0.03] sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <Filter className="h-4 w-4" />
            <span>Filters:</span>
          </div>
          
          <Select value={platformFilter} onValueChange={setPlatformFilter}>
            <SelectTrigger className="h-10 w-full rounded-xl border-zinc-200/80 bg-white sm:w-44">
              <SelectValue placeholder="All Platforms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              {Object.entries(PLATFORM_CONFIG).map(([key, cfg]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center gap-2">
                    <cfg.icon className="h-4 w-4" style={{ color: cfg.color }} />
                    {cfg.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={contentTypeFilter} onValueChange={setContentTypeFilter}>
            <SelectTrigger className="h-10 w-full rounded-xl border-zinc-200/80 bg-white sm:w-44">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Content Types</SelectItem>
              {Object.entries(CONTENT_TYPE_CONFIG).map(([key, cfg]) => (
                <SelectItem key={key} value={key}>
                  <span
                    className="inline-block h-2 w-2 rounded-full mr-2"
                    style={{ backgroundColor: cfg.color }}
                  />
                  {cfg.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ═══════ DATA TABLE ═══════ */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm ring-1 ring-black/[0.03]">
        <div className="border-b border-zinc-100 px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-zinc-900 sm:text-lg">
                Post Performance
              </h2>
              <p className="text-sm text-zinc-500">
                Detailed metrics per post · Auto-calculated engagement rate
              </p>
            </div>
            <Badge
              variant="secondary"
              className="text-xs bg-zinc-100 text-zinc-600"
            >
              {filteredPosts.length} post
              {filteredPosts.length !== 1 ? "s" : ""}
            </Badge>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-zinc-100 bg-zinc-50 hover:bg-zinc-50">
                {[
                  { key: "contentTitle", label: "Content", width: "w-64" },
                  { key: "platform", label: "Platform", width: "w-32" },
                  { key: "reach", label: "Reach", width: "w-24" },
                  { key: "impressions", label: "Impressions", width: "w-28" },
                  { key: "views", label: "Views", width: "w-24" },
                  { key: "interactions", label: "Interactions", width: "w-28" },
                  { key: "engagementRate", label: "Eng. Rate", width: "w-24" },
                  { key: "likes", label: "Likes", width: "w-20" },
                  { key: "comments", label: "Comments", width: "w-24" },
                  { key: "shares", label: "Shares", width: "w-20" },
                  { key: "saves", label: "Saves", width: "w-20" },
                  { key: "clicks", label: "Clicks", width: "w-20" },
                  { key: "profileVisits", label: "Profile", width: "w-20" },
                  { key: "watchTimeSeconds", label: "Watch Time", width: "w-28" },
                  { key: "avgWatchTimeSeconds", label: "Avg Watch", width: "w-24" },
                  { key: "publishDate", label: "Date", width: "w-32" },
                ].map((col) => (
                  <TableHead
                    key={col.key}
                    className={`py-3 px-3 sm:py-4 sm:px-4 text-xs font-medium text-zinc-500 whitespace-nowrap cursor-pointer hover:text-zinc-700 ${col.width}`}
                    onClick={() => handleSort(col.key as keyof OrganicPost)}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {sortBy === col.key && (
                        sortOrder === "asc" ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3" />
                        )
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={16} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="h-8 w-8 animate-spin rounded-full border-3 border-zinc-200 border-t-[#430062]" />
                      <p className="text-sm text-zinc-400">
                        Loading performance data…
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : paginatedPosts.length > 0 ? (
                paginatedPosts.map((post) => {
                  const platformCfg = PLATFORM_CONFIG[post.platform];
                  const typeCfg = CONTENT_TYPE_CONFIG[post.contentType];
                  const isVideo = !!post.watchTimeSeconds;

                  return (
                    <TableRow
                      key={post.id}
                      className="border-b border-zinc-100 transition-colors hover:bg-zinc-50"
                    >
                      {/* Content Title */}
                      <TableCell className="py-3 px-3 sm:py-4 sm:px-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-medium text-zinc-900 line-clamp-1">
                            {post.contentTitle}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0"
                              style={{
                                borderColor: `${typeCfg.color}30`,
                                color: typeCfg.color,
                                backgroundColor: `${typeCfg.color}10`,
                              }}
                            >
                              {typeCfg.label}
                            </Badge>
                            {isVideo && (
                              <Badge
                                variant="outline"
                                className="text-[10px] px-1.5 py-0 border-amber-200 bg-amber-50 text-amber-700"
                              >
                                <Video className="h-3 w-3 mr-0.5" />
                                Video
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Platform */}
                      <TableCell className="py-3 px-3 sm:py-4 sm:px-4">
                        <div className="flex items-center gap-2">
                          {platformCfg && (
                            <platformCfg.icon
                              className="h-4 w-4"
                              style={{ color: platformCfg.color }}
                            />
                          )}
                          <span className="text-xs sm:text-sm text-zinc-700">
                            {platformCfg?.label || post.platform}
                          </span>
                        </div>
                      </TableCell>

                      {/* Reach */}
                      <TableCell className="py-3 px-3 sm:py-4 sm:px-4">
                        <span className="text-xs sm:text-sm font-medium text-zinc-900 tabular-nums">
                          {formatNumber(post.reach)}
                        </span>
                      </TableCell>

                      {/* Impressions */}
                      <TableCell className="py-3 px-3 sm:py-4 sm:px-4">
                        <span className="text-xs sm:text-sm font-medium text-zinc-900 tabular-nums">
                          {formatNumber(post.impressions)}
                        </span>
                      </TableCell>

                      {/* Views */}
                      <TableCell className="py-3 px-3 sm:py-4 sm:px-4">
                        <span className="text-xs sm:text-sm font-medium text-zinc-900 tabular-nums">
                          {formatNumber(post.views)}
                        </span>
                      </TableCell>

                      {/* Interactions */}
                      <TableCell className="py-3 px-3 sm:py-4 sm:px-4">
                        <span className="text-xs sm:text-sm font-semibold text-violet-700 tabular-nums bg-violet-50 px-2 py-0.5 rounded-md">
                          {formatNumber(post.interactions)}
                        </span>
                      </TableCell>

                      {/* Engagement Rate - Auto Calculated */}
                      <TableCell className="py-3 px-3 sm:py-4 sm:px-4">
                        <div className="flex items-center gap-1">
                          <span
                            className={`text-xs sm:text-sm font-bold tabular-nums ${
                              post.engagementRate >= 15
                                ? "text-emerald-600"
                                : post.engagementRate >= 10
                                ? "text-amber-600"
                                : "text-zinc-600"
                            }`}
                          >
                            {post.engagementRate.toFixed(2)}%
                          </span>
                          {post.engagementRate >= 15 && (
                            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                          )}
                        </div>
                      </TableCell>

                      {/* Likes */}
                      <TableCell className="py-3 px-3 sm:py-4 sm:px-4">
                        <span className="text-xs sm:text-sm text-zinc-700 tabular-nums">
                          {formatNumber(post.likes)}
                        </span>
                      </TableCell>

                      {/* Comments */}
                      <TableCell className="py-3 px-3 sm:py-4 sm:px-4">
                        <span className="text-xs sm:text-sm text-zinc-700 tabular-nums">
                          {formatNumber(post.comments)}
                        </span>
                      </TableCell>

                      {/* Shares */}
                      <TableCell className="py-3 px-3 sm:py-4 sm:px-4">
                        <span className="text-xs sm:text-sm text-zinc-700 tabular-nums">
                          {formatNumber(post.shares)}
                        </span>
                      </TableCell>

                      {/* Saves */}
                      <TableCell className="py-3 px-3 sm:py-4 sm:px-4">
                        <span className="text-xs sm:text-sm text-zinc-700 tabular-nums">
                          {formatNumber(post.saves)}
                        </span>
                      </TableCell>

                      {/* Clicks */}
                      <TableCell className="py-3 px-3 sm:py-4 sm:px-4">
                        <span className="text-xs sm:text-sm text-zinc-700 tabular-nums">
                          {formatNumber(post.clicks)}
                        </span>
                      </TableCell>

                      {/* Profile Visits */}
                      <TableCell className="py-3 px-3 sm:py-4 sm:px-4">
                        <span className="text-xs sm:text-sm text-zinc-700 tabular-nums">
                          {formatNumber(post.profileVisits)}
                        </span>
                      </TableCell>

                      {/* Watch Time */}
                      <TableCell className="py-3 px-3 sm:py-4 sm:px-4">
                        <span className="text-xs sm:text-sm text-zinc-700 tabular-nums">
                          {formatDuration(post.watchTimeSeconds)}
                        </span>
                      </TableCell>

                      {/* Avg Watch Time */}
                      <TableCell className="py-3 px-3 sm:py-4 sm:px-4">
                        <span className="text-xs sm:text-sm text-zinc-700 tabular-nums">
                          {post.avgWatchTimeSeconds ? `${post.avgWatchTimeSeconds}s` : "—"}
                        </span>
                      </TableCell>

                      {/* Date */}
                      <TableCell className="py-3 px-3 sm:py-4 sm:px-4">
                        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-zinc-500">
                          <Calendar className="h-3.5 w-3.5" />
                          <span className="whitespace-nowrap">
                            {formatDate(post.publishDate)}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={16} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100">
                        <BarChart3 className="h-8 w-8 text-zinc-300" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-zinc-800">
                        No posts found
                      </h3>
                      <p className="mt-1 text-sm text-zinc-400">
                        Try adjusting your filters or search term
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        {filteredPosts.length > itemsPerPage && (
          <div className="flex items-center justify-between border-t border-zinc-100 px-4 py-4 sm:px-6">
            <div className="text-sm text-zinc-500">
              Showing{" "}
              <span className="font-medium text-zinc-700">
                {startIndex + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium text-zinc-700">
                {Math.min(endIndex, filteredPosts.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-zinc-700">
                {filteredPosts.length}
              </span>{" "}
              posts
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.max(prev - 1, 1))
                }
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
                  )
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

      {/* ═══════ ENGAGEMENT RATE FORMULA REFERENCE ═══════ */}
      <div className="rounded-2xl border border-zinc-200/80 bg-white/90 p-4 shadow-sm ring-1 ring-black/[0.03] sm:p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 shrink-0">
            <Activity className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">
              Engagement Rate Formula
            </h3>
            <p className="mt-1 text-sm text-zinc-600">
              <code className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-mono text-zinc-700">
                Engagement Rate = (Interactions / Reach) × 100
              </code>
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              Where <strong>Interactions</strong> = Likes + Comments + Shares + Saves + Clicks
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}