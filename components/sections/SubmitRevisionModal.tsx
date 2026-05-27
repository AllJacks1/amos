"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Pencil,
  Send,
  Loader2,
  AlertCircle,
  Link2,
  Plus,
  Trash2,
  FileText,
  Calendar,
  Tag,
  Monitor,
  Type,
  AlignLeft,
  User,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/store/useAuthStore";

interface ContentItem {
  id: string;
  title: string;
  caption: string;
  platform: string;
  contentType: string;
  status: "review" | "revise" | "approved" | "scheduled" | "posted";
  publishDate: string;
  client: string;
  assignedTo: string;
  driveLinks: string[];
  pillar: string;
  priority?: string | null;
  revisionDueDate?: string | null;
  revisionCount?: number;
  revisionNotes?: {
    commenter: string;
    comment: string;
    created_at: string;
  }[];
}

interface SubmitRevisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (update: {
    id: string;
    content_title: string;
    caption: string;
    platform: string;
    content_type: string;
    content_pillar: string;
    publish_date: string;
    gdrive_links: string[];
    status: "review";
    revision_notes: {
      commenter: string;
      comment: string;
      created_at: string;
    }[];
  }) => void;
  content: ContentItem | null;
  brandColor?: string;
  adminName?: string;
}

const platforms = [
  "Instagram",
  "Facebook",
  "TikTok",
  "LinkedIn",
  "Twitter/X",
  "YouTube",
  "Pinterest",
  "Threads",
];

const contentTypes = [
  "Carousel",
  "Reel",
  "Story",
  "Static Post",
  "Video",
  "Blog",
  "Newsletter",
  "Ad Creative",
];

const pillars = [
  "Brand Awareness",
  "Education",
  "Engagement",
  "Conversion",
  "Community",
  "Product",
  "Behind the Scenes",
];

export default function SubmitRevisionModal({
  isOpen,
  onClose,
  onSubmit,
  content,
  brandColor = "#430062",
  adminName = "Admin",
}: SubmitRevisionModalProps) {
  const user = useAuthStore((state) => state.user);

  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [platform, setPlatform] = useState("");
  const [contentType, setContentType] = useState("");
  const [pillar, setPillar] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [driveLinks, setDriveLinks] = useState<string[]>([""]);
  const [adminNote, setAdminNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeSection, setActiveSection] = useState<"edit" | "note">("edit");

  // Initialize form when content changes
  useEffect(() => {
    if (content) {
      setTitle(content.title || "");
      setCaption(content.caption || "");
      setPlatform(content.platform || "");
      setContentType(content.contentType || "");
      setPillar(content.pillar || "");
      setPublishDate(content.publishDate || "");
      setDriveLinks(content.driveLinks?.length > 0 ? content.driveLinks : [""]);
      setAdminNote("");
      setErrors({});
      setActiveSection("edit");
    }
  }, [content]);

  if (!isOpen || !content) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!caption.trim()) newErrors.caption = "Caption is required";
    if (!platform) newErrors.platform = "Platform is required";
    if (!contentType) newErrors.contentType = "Content type is required";
    if (!pillar) newErrors.pillar = "Content pillar is required";
    if (!publishDate) newErrors.publishDate = "Publish date is required";
    if (!adminNote.trim())
      newErrors.adminNote = "Please add a note about what was revised";

    // Validate drive links (at least one non-empty or all empty)
    const validLinks = driveLinks.filter((l) => l.trim() !== "");
    if (validLinks.length === 0) {
      newErrors.driveLinks = "At least one drive link is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddLink = () => {
    setDriveLinks([...driveLinks, ""]);
  };

  const handleRemoveLink = (index: number) => {
    if (driveLinks.length === 1) {
      setDriveLinks([""]);
      return;
    }
    setDriveLinks(driveLinks.filter((_, i) => i !== index));
  };

  const handleLinkChange = (index: number, value: string) => {
    const updated = [...driveLinks];
    updated[index] = value;
    setDriveLinks(updated);
    if (errors.driveLinks) setErrors((prev) => ({ ...prev, driveLinks: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Build revision notes: keep existing + add admin note
    const existingNotes = content.revisionNotes || [];
    const newNote = {
      commenter: adminName,
      comment: adminNote,
      created_at: new Date().toISOString(),
    };

    const updatePayload = {
      id: content.id,
      content_title: title.trim(),
      caption: caption.trim(),
      platform,
      content_type: contentType,
      content_pillar: pillar,
      publish_date: publishDate,
      gdrive_links: driveLinks.filter((l) => l.trim() !== ""),
      status: "review" as const,
      revision_notes: [...existingNotes, newNote],
      adminName: user?.fullname || "Admin",
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      onSubmit(updatePayload);
      resetForm();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setAdminNote("");
    setErrors({});
    setActiveSection("edit");
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  const isGoogleDriveLink = (url: string) => {
    return url.includes("drive.google.com") || url.includes("docs.google.com");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl shadow-black/10 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 sm:px-8 pt-6 pb-5 border-b border-zinc-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: `${brandColor}15` }}
              >
                <Pencil className="h-5 w-5" style={{ color: brandColor }} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-zinc-900">
                  Submit Revision
                </h2>
                <p className="text-sm text-zinc-500 mt-0.5">
                  Update content and send back for review
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors disabled:opacity-50"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content Preview Card */}
          <div className="mt-4 flex items-center gap-3 p-3 bg-zinc-50 rounded-2xl border border-zinc-100">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${brandColor}15` }}
            >
              <span className="text-sm font-bold" style={{ color: brandColor }}>
                {content.title?.slice(0, 2).toUpperCase() || "RV"}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-zinc-900 truncate">
                {content.title}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge
                  variant="outline"
                  className="text-[10px] px-1.5 py-0 border-rose-200 text-rose-600 bg-rose-50"
                >
                  For Revision
                </Badge>
                <span className="text-xs text-zinc-400">
                  {content.client} • Rev #{content.revisionCount || 1}
                </span>
              </div>
            </div>
          </div>

          {/* Section Tabs */}
          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={() => setActiveSection("edit")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeSection === "edit"
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit Content
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("note")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeSection === "note"
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              Revision Note
              {adminNote && (
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              )}
            </button>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6"
        >
          {activeSection === "edit" ? (
            <div className="space-y-5">
              {/* Title */}
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-sm font-medium text-zinc-700 flex items-center gap-2"
                >
                  <Type className="h-3.5 w-3.5 text-zinc-400" />
                  Content Title
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title)
                      setErrors((prev) => ({ ...prev, title: "" }));
                  }}
                  placeholder="Enter content title..."
                  className={`rounded-2xl h-11 ${
                    errors.title
                      ? "border-red-300 focus-visible:ring-red-200"
                      : ""
                  }`}
                />
                {errors.title && (
                  <p className="text-xs text-red-500 ml-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Caption */}
              <div className="space-y-2">
                <Label
                  htmlFor="caption"
                  className="text-sm font-medium text-zinc-700 flex items-center gap-2"
                >
                  <AlignLeft className="h-3.5 w-3.5 text-zinc-400" />
                  Caption / Copy
                </Label>
                <Textarea
                  id="caption"
                  value={caption}
                  onChange={(e) => {
                    setCaption(e.target.value);
                    if (errors.caption)
                      setErrors((prev) => ({ ...prev, caption: "" }));
                  }}
                  placeholder="Enter caption or copy..."
                  className={`rounded-2xl min-h-[100px] resize-none ${
                    errors.caption
                      ? "border-red-300 focus-visible:ring-red-200"
                      : ""
                  }`}
                />
                {errors.caption && (
                  <p className="text-xs text-red-500 ml-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.caption}
                  </p>
                )}
              </div>

              {/* Platform & Content Type Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-zinc-700 flex items-center gap-2">
                    <Monitor className="h-3.5 w-3.5 text-zinc-400" />
                    Platform
                  </Label>
                  <Select
                    value={platform}
                    onValueChange={(v) => {
                      setPlatform(v);
                      if (errors.platform)
                        setErrors((prev) => ({ ...prev, platform: "" }));
                    }}
                  >
                    <SelectTrigger
                      className={`rounded-2xl h-11 ${
                        errors.platform
                          ? "border-red-300 focus:ring-red-200"
                          : ""
                      }`}
                    >
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      {platforms.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.platform && (
                    <p className="text-xs text-red-500 ml-1">
                      {errors.platform}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-zinc-700 flex items-center gap-2">
                    <Tag className="h-3.5 w-3.5 text-zinc-400" />
                    Content Type
                  </Label>
                  <Select
                    value={contentType}
                    onValueChange={(v) => {
                      setContentType(v);
                      if (errors.contentType)
                        setErrors((prev) => ({ ...prev, contentType: "" }));
                    }}
                  >
                    <SelectTrigger
                      className={`rounded-2xl h-11 ${
                        errors.contentType
                          ? "border-red-300 focus:ring-red-200"
                          : ""
                      }`}
                    >
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      {contentTypes.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.contentType && (
                    <p className="text-xs text-red-500 ml-1">
                      {errors.contentType}
                    </p>
                  )}
                </div>
              </div>

              {/* Pillar & Publish Date Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-zinc-700 flex items-center gap-2">
                    <Tag className="h-3.5 w-3.5 text-zinc-400" />
                    Content Pillar
                  </Label>
                  <Select
                    value={pillar}
                    onValueChange={(v) => {
                      setPillar(v);
                      if (errors.pillar)
                        setErrors((prev) => ({ ...prev, pillar: "" }));
                    }}
                  >
                    <SelectTrigger
                      className={`rounded-2xl h-11 ${
                        errors.pillar ? "border-red-300 focus:ring-red-200" : ""
                      }`}
                    >
                      <SelectValue placeholder="Select pillar" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      {pillars.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.pillar && (
                    <p className="text-xs text-red-500 ml-1">{errors.pillar}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="publishDate"
                    className="text-sm font-medium text-zinc-700 flex items-center gap-2"
                  >
                    <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                    Publish Date
                  </Label>
                  <Input
                    id="publishDate"
                    type="date"
                    value={publishDate}
                    onChange={(e) => {
                      setPublishDate(e.target.value);
                      if (errors.publishDate)
                        setErrors((prev) => ({ ...prev, publishDate: "" }));
                    }}
                    className={`rounded-2xl h-11 ${
                      errors.publishDate
                        ? "border-red-300 focus-visible:ring-red-200"
                        : ""
                    }`}
                  />
                  {errors.publishDate && (
                    <p className="text-xs text-red-500 ml-1">
                      {errors.publishDate}
                    </p>
                  )}
                </div>
              </div>

              <Separator className="my-2" />

              {/* Google Drive Links */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-zinc-700 flex items-center gap-2">
                    <Link2 className="h-3.5 w-3.5 text-zinc-400" />
                    Google Drive Links
                  </Label>
                  <span className="text-xs text-zinc-400">
                    {driveLinks.filter((l) => l.trim()).length} link(s)
                  </span>
                </div>

                <div className="space-y-2">
                  {driveLinks.map((link, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="relative flex-1">
                        <Link2
                          className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${
                            isGoogleDriveLink(link)
                              ? "text-amber-500"
                              : "text-zinc-400"
                          }`}
                        />
                        <Input
                          value={link}
                          onChange={(e) =>
                            handleLinkChange(index, e.target.value)
                          }
                          placeholder="https://drive.google.com/..."
                          className={`pl-10 rounded-2xl h-11 ${
                            errors.driveLinks && index === 0
                              ? "border-red-300 focus-visible:ring-red-200"
                              : ""
                          }`}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveLink(index)}
                        className="w-11 h-11 rounded-2xl border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddLink}
                  className="w-full h-10 rounded-2xl border-dashed border-zinc-300 text-zinc-600 hover:border-zinc-400 hover:bg-zinc-50"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Another Link
                </Button>

                {errors.driveLinks && (
                  <p className="text-xs text-red-500 ml-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.driveLinks}
                  </p>
                )}
              </div>
            </div>
          ) : (
            /* Revision Note Section */
            <div className="space-y-5">
              {/* Revision Context */}
              {content.revisionNotes && content.revisionNotes.length > 0 && (
                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-3">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Previous Revision Requests
                  </p>
                  <div className="space-y-3 max-h-[200px] overflow-y-auto">
                    {content.revisionNotes.map((note, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white rounded-xl border border-zinc-100"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-[10px] bg-zinc-100">
                                {note.commenter
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium text-zinc-900">
                              {note.commenter}
                            </span>
                          </div>
                          <span className="text-[10px] text-zinc-400">
                            {new Date(note.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-zinc-600 pl-8">
                          {note.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator className="my-2" />

              {/* Admin Note Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="adminNote"
                    className="text-sm font-medium text-zinc-700 flex items-center gap-2"
                  >
                    <FileText className="h-3.5 w-3.5 text-zinc-400" />
                    Your Revision Note
                  </Label>
                  <span
                    className={`text-xs ${
                      adminNote.length > 800 ? "text-red-400" : "text-zinc-400"
                    }`}
                  >
                    {adminNote.length}/1000
                  </span>
                </div>
                <Textarea
                  id="adminNote"
                  value={adminNote}
                  onChange={(e) => {
                    setAdminNote(e.target.value);
                    if (errors.adminNote)
                      setErrors((prev) => ({ ...prev, adminNote: "" }));
                  }}
                  placeholder="Describe what changes you made in this revision. Be specific about what was updated, added, or fixed so the reviewer knows what to check..."
                  className={`rounded-2xl min-h-[160px] resize-none ${
                    errors.adminNote
                      ? "border-red-300 focus-visible:ring-red-200"
                      : ""
                  }`}
                  maxLength={1000}
                />
                {errors.adminNote && (
                  <p className="text-xs text-red-500 ml-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.adminNote}
                  </p>
                )}
              </div>

              {/* Status Change Preview */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-emerald-900">
                      Status will change to &quot;For Review&quot;
                    </p>
                    <p className="text-xs text-emerald-600 mt-0.5">
                      This content will be sent back to the review pipeline
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="border-t bg-white p-6 sm:p-8 flex-shrink-0">
          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="w-full sm:flex-1 h-11 rounded-2xl font-medium"
            >
              Cancel
            </Button>
            {activeSection === "edit" ? (
              <Button
                type="button"
                onClick={() => setActiveSection("note")}
                className="w-full sm:flex-1 h-11 rounded-2xl font-semibold text-white shadow-lg transition-all active:scale-[0.985]"
                style={{
                  backgroundColor: brandColor,
                  boxShadow: `0 4px 14px ${brandColor}25`,
                }}
              >
                Continue to Note
                <Send className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="w-full sm:flex-1 h-11 rounded-2xl font-semibold text-white shadow-lg transition-all active:scale-[0.985] disabled:opacity-50"
                style={{
                  backgroundColor: brandColor,
                  boxShadow: `0 4px 14px ${brandColor}25`,
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit for Review
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
