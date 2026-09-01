"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Trash2,
  Video,
  Image,
  Layers,
  Film,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MousePointer,
  UserCheck,
  BarChart3,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Timer,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { InstagramIcon } from "../icons/Instagram";
import { FacebookIcon } from "../icons/Facebook";
import { LinkedInIcon } from "../icons/LinkedIn";
import { XIcon } from "../icons/X";
import { TikTokIcon } from "../icons/TikTok";
import { MetaIcon } from "../icons/Meta";
import { GoogleIcon } from "../icons/Google";

const CONTENT_BRAND = "#430062";

/* ───────── TYPES ───────── */
interface OrganicPostFormData {
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

  // Video Metrics (optional)
  isVideoContent: boolean;
  watchTimeSeconds: number;
  avgWatchTimeSeconds: number;
}

/* ───────── PLATFORM CONFIG ───────── */
const PLATFORM_CONFIG = {
  instagram: { label: "Google Business", icon: GoogleIcon, color: "#E4405F" },
  facebook: { label: "Meta", icon: MetaIcon, color: "#1877F2" },
  linkedin: { label: "LinkedIn", icon: LinkedInIcon, color: "#0A66C2" },
  twitter: { label: "Twitter", icon: XIcon, color: "#1DA1F2" },
  tiktok: { label: "TikTok", icon: TikTokIcon, color: "#000000" },
} as const;

const CONTENT_TYPE_CONFIG = {
  image: { label: "Image", icon: Image, color: "#0ea5e9" },
  video: { label: "Video", icon: Film, color: "#ef4444" },
  carousel: { label: "Carousel", icon: Layers, color: "#8b5cf6" },
  reel: { label: "Reel", icon: Video, color: "#f59e0b" },
  story: { label: "Story", icon: Clock, color: "#10b981" },
} as const;

/* ───────── PROPS ───────── */
interface AddOrganicPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: OrganicPostFormData) => Promise<void>;
  brandColor?: string;
}

/* ───────── INITIAL FORM STATE ───────── */
const INITIAL_FORM: OrganicPostFormData = {
  contentTitle: "",
  platform: "instagram",
  contentType: "image",
  publishDate: new Date().toISOString().split("T")[0],

  reach: 0,
  impressions: 0,
  views: 0,
  likes: 0,
  comments: 0,
  shares: 0,
  saves: 0,
  clicks: 0,
  profileVisits: 0,

  isVideoContent: false,
  watchTimeSeconds: 0,
  avgWatchTimeSeconds: 0,
};

/* ───────── VALIDATION ───────── */
interface FormErrors {
  [key: string]: string;
}

/* ───────── MAIN COMPONENT ───────── */
export default function AddOrganicPostModal({
  isOpen,
  onClose,
  onAdd,
  brandColor = CONTENT_BRAND,
}: AddOrganicPostModalProps) {
  const [form, setForm] = useState<OrganicPostFormData>({ ...INITIAL_FORM });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState<
    "basic" | "metrics" | "video"
  >("basic");

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setForm({ ...INITIAL_FORM });
      setErrors({});
      setActiveSection("basic");
    }
  }, [isOpen]);

  useEffect(() => {
    if (!form.isVideoContent && activeSection === "video") {
      setActiveSection("metrics");
    }
  }, [form.isVideoContent, activeSection]);

  /* ───────── HANDLERS ───────── */
  const handleChange = (field: keyof OrganicPostFormData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleNumberChange = (
    field: keyof OrganicPostFormData,
    value: string,
  ) => {
    const num = value === "" ? 0 : parseInt(value.replace(/,/g, ""), 10);
    handleChange(field, isNaN(num) ? 0 : num);
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.contentTitle.trim()) {
      newErrors.contentTitle = "Content title is required";
    }
    if (!form.publishDate) {
      newErrors.publishDate = "Publish date is required";
    }
    if (form.reach < 0) {
      newErrors.reach = "Reach cannot be negative";
    }
    if (form.impressions < 0) {
      newErrors.impressions = "Impressions cannot be negative";
    }
    if (form.impressions < form.reach) {
      newErrors.impressions = "Impressions should be ≥ Reach";
    }

    // Video validation
    if (form.isVideoContent) {
      if (form.watchTimeSeconds <= 0) {
        newErrors.watchTimeSeconds = "Watch time is required for video content";
      }
      if (form.avgWatchTimeSeconds <= 0) {
        newErrors.avgWatchTimeSeconds = "Average watch time is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onAdd(form);
      onClose();
    } catch (error) {
      console.error("Failed to add post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-set content type based on platform selection
  const handlePlatformChange = (platform: OrganicPostFormData["platform"]) => {
    handleChange("platform", platform);
    // Suggest content type based on platform
    if (platform === "tiktok") {
      handleChange("contentType", "video");
      handleChange("isVideoContent", true);
    } else if (platform === "instagram" && form.contentType === "video") {
      handleChange("contentType", "reel");
    }
  };

  // Auto-toggle video metrics when content type changes
  const handleContentTypeChange = (
    type: OrganicPostFormData["contentType"],
  ) => {
    handleChange("contentType", type);
    const isVideo = type === "video" || type === "reel";
    handleChange("isVideoContent", isVideo);
  };

  /* ───────── CALCULATED PREVIEW ───────── */
  const interactions =
    form.likes + form.comments + form.shares + form.saves + form.clicks;
  const engagementRate =
    form.reach > 0 ? ((interactions / form.reach) * 100).toFixed(2) : "0.00";

  if (!isOpen) return null;

  const sections: Array<typeof activeSection> = form.isVideoContent
    ? ["basic", "metrics", "video"]
    : ["basic", "metrics"];

  const progressSteps = [
    { id: "basic", label: "Basic Info", icon: Layers },
    { id: "metrics", label: "Metrics", icon: BarChart3 },
    ...(form.isVideoContent
      ? [{ id: "video", label: "Video Data", icon: Video }]
      : []),
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        className="relative flex h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ═══════ HEADER ═══════ */}
        <div className="relative shrink-0 border-b border-zinc-200/80 bg-gradient-to-b from-[#430062]/[0.06] to-white px-6 py-5">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#430062] via-[#6b1a8f] to-[#a855f7]" />
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-zinc-900">
                Add Performance Data
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Input organic content metrics for tracking
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* ═══════ PROGRESS STEPS ═══════ */}
        <div className="shrink-0 border-b border-zinc-100 bg-zinc-50/50 px-6 py-3">
          <div className="flex items-center gap-2">
            {progressSteps.map((step, idx) => {
              const isActive = activeSection === step.id;
              const isPast = idx < sections.indexOf(activeSection);

              return (
                <React.Fragment key={step.id}>
                  {idx > 0 && (
                    <div
                      className={`h-px w-8 ${
                        isPast || isActive ? "bg-[#430062]" : "bg-zinc-300"
                      }`}
                    />
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      setActiveSection(step.id as typeof activeSection)
                    }
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-[#430062]/10 text-[#430062]"
                        : isPast
                          ? "text-zinc-600 hover:bg-zinc-100"
                          : "text-zinc-400"
                    }`}
                  >
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                        isActive
                          ? "bg-[#430062] text-white"
                          : isPast
                            ? "bg-emerald-500 text-white"
                            : "bg-zinc-200 text-zinc-500"
                      }`}
                    >
                      {isPast ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        idx + 1
                      )}
                    </div>
                    <span className="hidden sm:inline">{step.label}</span>
                  </button>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* ═══════ SCROLLABLE FORM ═══════ */}
        <form
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain bg-zinc-50/40"
        >
          <div className="space-y-8 p-6">
            {/* ───── SECTION: BASIC INFO ───── */}
            {activeSection === "basic" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900 mb-4">
                    Content Information
                  </h3>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {/* Content Title */}
                    <div className="sm:col-span-2 space-y-2">
                      <Label
                        htmlFor="contentTitle"
                        className="text-sm font-medium text-zinc-700"
                      >
                        Content Title <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="contentTitle"
                        placeholder="e.g., Summer Campaign Launch"
                        value={form.contentTitle}
                        onChange={(e) =>
                          handleChange("contentTitle", e.target.value)
                        }
                        className={`h-11 rounded-xl border-zinc-200/80 bg-white shadow-sm focus-visible:ring-[#430062]/20 ${
                          errors.contentTitle
                            ? "border-red-300 focus-visible:ring-red-200"
                            : ""
                        }`}
                      />
                      {errors.contentTitle && (
                        <p className="text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.contentTitle}
                        </p>
                      )}
                    </div>

                    {/* Platform */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-zinc-700">
                        Platform <span className="text-red-500">*</span>
                      </Label>
                      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                        {Object.entries(PLATFORM_CONFIG).map(([key, cfg]) => {
                          const Icon = cfg.icon;
                          const isSelected = form.platform === key;
                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() =>
                                handlePlatformChange(
                                  key as OrganicPostFormData["platform"],
                                )
                              }
                              className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-all ${
                                isSelected
                                  ? "border-[#430062]/30 bg-[#430062]/5 shadow-sm"
                                  : "border-zinc-200/80 bg-white hover:border-zinc-300 hover:bg-zinc-50"
                              }`}
                            >
                              <Icon
                                className="h-5 w-5"
                                style={{
                                  color: isSelected ? cfg.color : "#71717a",
                                }}
                              />
                              <span
                                className={`text-[11px] font-medium ${
                                  isSelected
                                    ? "text-[#430062]"
                                    : "text-zinc-500"
                                }`}
                              >
                                {cfg.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Content Type */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-zinc-700">
                        Content Type <span className="text-red-500">*</span>
                      </Label>
                      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                        {Object.entries(CONTENT_TYPE_CONFIG).map(
                          ([key, cfg]) => {
                            const Icon = cfg.icon;
                            const isSelected = form.contentType === key;
                            return (
                              <button
                                key={key}
                                type="button"
                                onClick={() =>
                                  handleContentTypeChange(
                                    key as OrganicPostFormData["contentType"],
                                  )
                                }
                                className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-all ${
                                  isSelected
                                    ? "border-[#430062]/30 bg-[#430062]/5 shadow-sm"
                                    : "border-zinc-200/80 bg-white hover:border-zinc-300 hover:bg-zinc-50"
                                }`}
                              >
                                <Icon
                                  className="h-5 w-5"
                                  style={{
                                    color: isSelected ? cfg.color : "#71717a",
                                  }}
                                />
                                <span
                                  className={`text-[11px] font-medium ${
                                    isSelected
                                      ? "text-[#430062]"
                                      : "text-zinc-500"
                                  }`}
                                >
                                  {cfg.label}
                                </span>
                              </button>
                            );
                          },
                        )}
                      </div>
                    </div>

                    {/* Publish Date */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="publishDate"
                        className="text-sm font-medium text-zinc-700"
                      >
                        Publish Date <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="publishDate"
                        type="date"
                        value={form.publishDate}
                        onChange={(e) =>
                          handleChange("publishDate", e.target.value)
                        }
                        className={`h-11 rounded-xl border-zinc-200/80 bg-white shadow-sm focus-visible:ring-[#430062]/20 ${
                          errors.publishDate ? "border-red-300" : ""
                        }`}
                      />
                      {errors.publishDate && (
                        <p className="text-xs text-red-600">
                          {errors.publishDate}
                        </p>
                      )}
                    </div>

                    {/* Video Toggle */}
                    <div className="flex items-center justify-between rounded-xl border border-zinc-200/80 bg-white p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
                          <Video className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-zinc-900">
                            Video Content
                          </p>
                          <p className="text-xs text-zinc-500">
                            Enable video-specific metrics
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={form.isVideoContent}
                        onCheckedChange={(checked) =>
                          handleChange("isVideoContent", checked)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ───── SECTION: METRICS ───── */}
            {activeSection === "metrics" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900 mb-4">
                    Performance Metrics
                  </h3>

                  {/* Live Preview */}
                  <div className="mb-6 rounded-xl border border-emerald-200/80 bg-emerald-50/40 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-900">
                          Live Preview
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className="border-emerald-200 bg-emerald-50 text-emerald-700"
                      >
                        Auto-calculated
                      </Badge>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
                      <div>
                        <p className="text-[11px] uppercase tracking-widest text-emerald-700/70">
                          Interactions
                        </p>
                        <p className="text-xl font-bold text-emerald-800 tabular-nums">
                          {interactions.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-widest text-emerald-700/70">
                          Engagement Rate
                        </p>
                        <p className="text-xl font-bold text-emerald-800 tabular-nums">
                          {engagementRate}%
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-[11px] uppercase tracking-widest text-emerald-700/70">
                          Formula
                        </p>
                        <p className="text-xs text-emerald-700 font-mono mt-1">
                          ({form.likes} + {form.comments} + {form.shares} +{" "}
                          {form.saves} + {form.clicks}) / {form.reach} × 100
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Reach */}
                    <MetricInput
                      label="Reach"
                      icon={Eye}
                      value={form.reach}
                      onChange={(v) => handleNumberChange("reach", v)}
                      error={errors.reach}
                      description="Unique accounts reached"
                      color="#430062"
                    />

                    {/* Impressions */}
                    <MetricInput
                      label="Impressions"
                      icon={BarChart3}
                      value={form.impressions}
                      onChange={(v) => handleNumberChange("impressions", v)}
                      error={errors.impressions}
                      description="Total times displayed"
                      color="#7c3aed"
                    />

                    {/* Views */}
                    <MetricInput
                      label="Views"
                      icon={Eye}
                      value={form.views}
                      onChange={(v) => handleNumberChange("views", v)}
                      description="Content views"
                      color="#0ea5e9"
                    />

                    {/* Likes */}
                    <MetricInput
                      label="Likes"
                      icon={Heart}
                      value={form.likes}
                      onChange={(v) => handleNumberChange("likes", v)}
                      description="Total likes received"
                      color="#ef4444"
                    />

                    {/* Comments */}
                    <MetricInput
                      label="Comments"
                      icon={MessageCircle}
                      value={form.comments}
                      onChange={(v) => handleNumberChange("comments", v)}
                      description="Comments on post"
                      color="#8b5cf6"
                    />

                    {/* Shares */}
                    <MetricInput
                      label="Shares"
                      icon={Share2}
                      value={form.shares}
                      onChange={(v) => handleNumberChange("shares", v)}
                      description="Times shared"
                      color="#0ea5e9"
                    />

                    {/* Saves */}
                    <MetricInput
                      label="Saves"
                      icon={Bookmark}
                      value={form.saves}
                      onChange={(v) => handleNumberChange("saves", v)}
                      description="Bookmarks/saves"
                      color="#10b981"
                    />

                    {/* Clicks */}
                    <MetricInput
                      label="Clicks"
                      icon={MousePointer}
                      value={form.clicks}
                      onChange={(v) => handleNumberChange("clicks", v)}
                      description="Link clicks"
                      color="#f59e0b"
                    />

                    {/* Profile Visits */}
                    <MetricInput
                      label="Profile Visits"
                      icon={UserCheck}
                      value={form.profileVisits}
                      onChange={(v) => handleNumberChange("profileVisits", v)}
                      description="Profile visits from post"
                      color="#06b6d4"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ───── SECTION: VIDEO METRICS ───── */}
            {activeSection === "video" && (
              <div className="space-y-6">
                {!form.isVideoContent ? (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-200/80 bg-zinc-50/50 py-16">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100">
                      <Video className="h-8 w-8 text-zinc-300" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-zinc-800">
                      Video Metrics Disabled
                    </h3>
                    <p className="mt-1 text-sm text-zinc-500 text-center max-w-sm">
                      Enable "Video Content" in the Basic Info section to input
                      watch time data
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-4 rounded-xl"
                      onClick={() => {
                        handleChange("isVideoContent", true);
                        handleChange("contentType", "video");
                      }}
                    >
                      Enable Video Metrics
                    </Button>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900 mb-4">
                      Video-Specific Metrics
                    </h3>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      {/* Watch Time */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-zinc-700">
                          Total Watch Time (seconds){" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <Clock className="h-4 w-4 text-zinc-400" />
                          </div>
                          <Input
                            type="number"
                            min="0"
                            placeholder="e.g., 184500"
                            value={form.watchTimeSeconds || ""}
                            onChange={(e) =>
                              handleNumberChange(
                                "watchTimeSeconds",
                                e.target.value,
                              )
                            }
                            className={`h-11 rounded-xl border-zinc-200/80 bg-white pl-10 shadow-sm focus-visible:ring-[#430062]/20 ${
                              errors.watchTimeSeconds ? "border-red-300" : ""
                            }`}
                          />
                        </div>
                        {form.watchTimeSeconds > 0 && (
                          <p className="text-xs text-zinc-500">
                            ≈ {Math.floor(form.watchTimeSeconds / 60)}m{" "}
                            {form.watchTimeSeconds % 60}s
                          </p>
                        )}
                        {errors.watchTimeSeconds && (
                          <p className="text-xs text-red-600">
                            {errors.watchTimeSeconds}
                          </p>
                        )}
                      </div>

                      {/* Average Watch Time */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-zinc-700">
                          Average Watch Time (seconds){" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <Timer className="h-4 w-4 text-zinc-400" />
                          </div>
                          <Input
                            type="number"
                            min="0"
                            step="0.1"
                            placeholder="e.g., 8.5"
                            value={form.avgWatchTimeSeconds || ""}
                            onChange={(e) =>
                              handleNumberChange(
                                "avgWatchTimeSeconds",
                                e.target.value,
                              )
                            }
                            className={`h-11 rounded-xl border-zinc-200/80 bg-white pl-10 shadow-sm focus-visible:ring-[#430062]/20 ${
                              errors.avgWatchTimeSeconds ? "border-red-300" : ""
                            }`}
                          />
                        </div>
                        {errors.avgWatchTimeSeconds && (
                          <p className="text-xs text-red-600">
                            {errors.avgWatchTimeSeconds}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Quick Presets */}
                    <div className="mt-6">
                      <p className="text-xs font-medium text-zinc-500 mb-3 uppercase tracking-wider">
                        Quick Presets
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { label: "15s Reel", watch: 15, avg: 8 },
                          { label: "30s Video", watch: 30, avg: 12 },
                          { label: "60s Reel", watch: 60, avg: 18 },
                          { label: "3min Tutorial", watch: 180, avg: 45 },
                          { label: "5min Long-form", watch: 300, avg: 90 },
                        ].map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => {
                              handleChange("watchTimeSeconds", preset.watch);
                              handleChange("avgWatchTimeSeconds", preset.avg);
                            }}
                            className="rounded-lg border border-zinc-200/80 bg-white px-3 py-2 text-xs font-medium text-zinc-600 hover:border-[#430062]/30 hover:text-[#430062] transition-colors"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </form>

        {/* ═══════ FOOTER ACTIONS ═══════ */}
        {/* ═══════ FOOTER ACTIONS ═══════ */}
        <div className="shrink-0 border-t border-zinc-200/80 bg-white/95 p-4 backdrop-blur-sm sm:p-6">
          <div className="flex items-center justify-between">
            {/* Left Button: Cancel on first step, Previous on others */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                if (activeSection === "basic") {
                  onClose();
                } else {
                  const currentIndex = sections.indexOf(activeSection);

                  if (currentIndex > 0) {
                    setActiveSection(sections[currentIndex - 1]);
                  }
                }
              }}
              className="h-10 rounded-xl border-zinc-200/80 text-sm hover:bg-zinc-50 hover:border-zinc-300"
            >
              {activeSection === "basic" ? (
                <>
                  <X className="mr-1.5 h-4 w-4" />
                  Cancel
                </>
              ) : (
                <>
                  <ChevronLeft className="mr-1.5 h-4 w-4" />
                  Previous
                </>
              )}
            </Button>

            {/* Right Button: Next on first two steps, Submit on last step */}
            <Button
              type={
                activeSection === "video" ||
                (!form.isVideoContent && activeSection === "metrics")
                  ? "submit"
                  : "button"
              }
              size="sm"
              disabled={isSubmitting}
              onClick={(e) => {
                if (
                  activeSection === "video" ||
                  (!form.isVideoContent && activeSection === "metrics")
                ) {
                  handleSubmit(e as any);
                  return;
                }

                const currentIndex = sections.indexOf(activeSection);

                if (currentIndex < sections.length - 1) {
                  setActiveSection(sections[currentIndex + 1]);
                }
              }}
              className="h-10 rounded-xl bg-[#430062] px-5 text-sm font-semibold text-white shadow-lg shadow-[#430062]/20 transition-all hover:bg-[#5a0080] active:scale-[0.99]"
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Saving...
                </>
              ) : activeSection === "video" ||
                (!form.isVideoContent && activeSection === "metrics") ? (
                <>
                  <Plus className="mr-1.5 h-4 w-4" />
                  Add Performance Data
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="ml-1.5 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────── SUB-COMPONENT: Metric Input ───────── */
interface MetricInputProps {
  label: string;
  icon: React.ElementType;
  value: number;
  onChange: (value: string) => void;
  error?: string;
  description?: string;
  color: string;
}

function MetricInput({
  label,
  icon: Icon,
  value,
  onChange,
  error,
  description,
  color,
}: MetricInputProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-zinc-700">{label}</Label>
      <div className="relative">
        <div
          className="absolute left-3 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-md"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="h-3.5 w-3.5" style={{ color }} />
        </div>
        <Input
          type="number"
          min="0"
          placeholder="0"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className={`h-11 rounded-xl border-zinc-200/80 bg-white pl-12 text-sm shadow-sm focus-visible:ring-[#430062]/20 tabular-nums ${
            error ? "border-red-300" : ""
          }`}
        />
      </div>
      {description && (
        <p className="text-[11px] text-zinc-500">{description}</p>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
