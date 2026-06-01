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
  CheckCircle,
  LinkIcon,
  ListOrdered,
  List,
  Heading2,
  Heading1,
  Italic,
  Bold,
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
import { ContentModalShell } from "./content-ui";
import { cn } from "@/lib/utils";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import CharacterCount from "@tiptap/extension-character-count";

interface ContentItem {
  id: string;
  title: string;
  caption: string;
  platforms: string[]; // ← Updated
  contentTypes: string[]; // ← Updated
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
    platforms: string[]; // ← Updated
    content_types: string[]; // ← Updated
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

const platformsList = [
  "Instagram",
  "Facebook",
  "TikTok",
  "LinkedIn",
  "Twitter/X",
  "YouTube",
  "Pinterest",
  "Threads",
];

const contentTypesList = [
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
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [contentTypes, setContentTypes] = useState<string[]>([]);
  const [pillar, setPillar] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [driveLinks, setDriveLinks] = useState<string[]>([""]);
  const [adminNote, setAdminNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeSection, setActiveSection] = useState<"edit" | "note">("edit");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2] },
        bulletList: { HTMLAttributes: { class: "list-disc pl-6" } },
        orderedList: { HTMLAttributes: { class: "list-decimal pl-6" } },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline hover:text-blue-700",
        },
      }),
      CharacterCount,
    ],
    content: caption,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setCaption(html);
    },
  });

  // Initialize form
  useEffect(() => {
    if (content) {
      setTitle(content.title || "");
      setCaption(content.caption || "");
      setPlatforms(content.platforms || []);
      setContentTypes(content.contentTypes || []);
      setPillar(content.pillar || "");
      setPublishDate(content.publishDate || "");
      setDriveLinks(content.driveLinks?.length > 0 ? content.driveLinks : [""]);
      setAdminNote("");
      setErrors({});
      setActiveSection("edit");
    }
  }, [content]);

  useEffect(() => {
  if (editor && caption !== editor.getHTML()) {
    editor.commands.setContent(caption);
  }
}, [caption, editor]);

if (!isOpen || !content) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = "Title is required";
    if (!caption.trim()) newErrors.caption = "Caption is required";
    if (platforms.length === 0)
      newErrors.platforms = "At least one platform is required";
    if (contentTypes.length === 0)
      newErrors.contentTypes = "At least one content type is required";
    if (!pillar) newErrors.pillar = "Content pillar is required";
    if (!publishDate) newErrors.publishDate = "Publish date is required";
    if (!adminNote.trim()) newErrors.adminNote = "Please add a revision note";

    const validLinks = driveLinks.filter((l) => l.trim() !== "");
    if (validLinks.length === 0) {
      newErrors.driveLinks = "At least one drive link is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddLink = () => setDriveLinks([...driveLinks, ""]);

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

  const addPlatform = (platform: string) => {
    if (!platforms.includes(platform)) {
      setPlatforms([...platforms, platform]);
    }
    if (errors.platforms) setErrors((prev) => ({ ...prev, platforms: "" }));
  };

  const removePlatform = (platform: string) => {
    setPlatforms(platforms.filter((p) => p !== platform));
  };

  const addContentType = (type: string) => {
    if (!contentTypes.includes(type)) {
      setContentTypes([...contentTypes, type]);
    }
    if (errors.contentTypes)
      setErrors((prev) => ({ ...prev, contentTypes: "" }));
  };

  const removeContentType = (type: string) => {
    setContentTypes(contentTypes.filter((t) => t !== type));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const existingNotes = content.revisionNotes || [];
    const newNote = {
      commenter: adminName,
      comment: adminNote.trim(),
      created_at: new Date().toISOString(),
    };

    const updatePayload = {
      id: content.id,
      content_title: title.trim(),
      caption: caption.trim(),
      platforms, // ← Updated
      content_types: contentTypes, // ← Updated
      content_pillar: pillar,
      publish_date: publishDate,
      gdrive_links: driveLinks.filter((l) => l.trim() !== ""),
      status: "review" as const,
      revision_notes: [...existingNotes, newNote],
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      onSubmit(updatePayload);
      onClose();
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isGoogleDriveLink = (url: string) =>
    url.includes("drive.google.com") || url.includes("docs.google.com");

  const characterCount = editor?.storage.characterCount?.characters() ?? 0;

  return (
    <ContentModalShell onClose={onClose} maxWidth="max-w-2xl">
        <div className="relative shrink-0 border-b border-zinc-100 bg-gradient-to-b from-[#430062]/[0.06] to-white px-6 pb-5 pt-6 sm:px-8">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#430062] via-[#6b1a8f] to-[#a855f7]" />
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
              onClick={onClose}
              disabled={isSubmitting}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content Preview */}
          <div className="mt-4 p-3 bg-zinc-50 rounded-2xl border border-zinc-100 flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${brandColor}15` }}
            >
              <span className="text-sm font-bold" style={{ color: brandColor }}>
                {content.title?.slice(0, 2).toUpperCase() || "RV"}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-zinc-900 truncate">
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

          {/* Tabs */}
          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={() => setActiveSection("edit")}
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all",
                activeSection === "edit"
                  ? "bg-[#430062] text-white shadow-sm"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200",
              )}
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit Content
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("note")}
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all",
                activeSection === "note"
                  ? "bg-[#430062] text-white shadow-sm"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200",
              )}
            >
              <FileText className="h-3.5 w-3.5" />
              Revision Note
              {adminNote && (
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              )}
            </button>
          </div>
        </div>

        {/* Form Content */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6"
        >
          {activeSection === "edit" ? (
            <div className="space-y-5">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center gap-2">
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
                  className={`rounded-2xl h-11 ${errors.title ? "border-red-300" : ""}`}
                />
                {errors.title && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Caption */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-zinc-700">Caption</Label>

                {/* Toolbar */}
                <div className="flex flex-wrap gap-1 border border-zinc-200 bg-zinc-50 p-2 rounded-2xl">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={editor?.isActive("bold") ? "bg-zinc-200" : ""}
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={editor?.isActive("italic") ? "bg-zinc-200" : ""}
                  >
                    <Italic className="h-4 w-4" />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={editor?.isActive("heading", { level: 1 }) ? "bg-zinc-200" : ""}
                  >
                    <Heading1 className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor?.isActive("heading", { level: 2 }) ? "bg-zinc-200" : ""}
                  >
                    <Heading2 className="h-4 w-4" />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    className={editor?.isActive("bulletList") ? "bg-zinc-200" : ""}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                    className={editor?.isActive("orderedList") ? "bg-zinc-200" : ""}
                  >
                    <ListOrdered className="h-4 w-4" />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const url = prompt("Enter URL:");
                      if (url) editor?.chain().focus().setLink({ href: url }).run();
                    }}
                  >
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </div>

                {/* Editor Content */}
                <div className="min-h-[140px] border border-zinc-200 rounded-2xl p-4 focus-within:border-violet-500 transition-colors bg-white">
                  <EditorContent
                    editor={editor}
                    className="prose prose-sm max-w-none focus:outline-none min-h-[120px]"
                  />
                </div>

                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Rich text supported</span>
                  <span>{characterCount} characters</span>
                </div>
              </div>

              {/* Platforms - Multi Select */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Monitor className="h-3.5 w-3.5 text-zinc-400" />
                  Platforms
                </Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {platforms.map((plat) => (
                    <Badge
                      key={plat}
                      variant="secondary"
                      className="pl-3 pr-2 py-1"
                    >
                      {plat}
                      <button
                        type="button"
                        onClick={() => removePlatform(plat)}
                        className="ml-2 text-zinc-500 hover:text-red-500"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <Select onValueChange={addPlatform} value="">
                  <SelectTrigger
                    className={`rounded-2xl h-11 ${errors.platforms ? "border-red-300" : ""}`}
                  >
                    <SelectValue placeholder="Add platform..." />
                  </SelectTrigger>
                  <SelectContent>
                    {platformsList
                      .filter((p) => !platforms.includes(p))
                      .map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {errors.platforms && (
                  <p className="text-xs text-red-500">{errors.platforms}</p>
                )}
              </div>

              {/* Content Types - Multi Select */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Tag className="h-3.5 w-3.5 text-zinc-400" />
                  Content Types
                </Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {contentTypes.map((type) => (
                    <Badge
                      key={type}
                      variant="secondary"
                      className="pl-3 pr-2 py-1"
                    >
                      {type}
                      <button
                        type="button"
                        onClick={() => removeContentType(type)}
                        className="ml-2 text-zinc-500 hover:text-red-500"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <Select onValueChange={addContentType} value="">
                  <SelectTrigger
                    className={`rounded-2xl h-11 ${errors.contentTypes ? "border-red-300" : ""}`}
                  >
                    <SelectValue placeholder="Add content type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {contentTypesList
                      .filter((t) => !contentTypes.includes(t))
                      .map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {errors.contentTypes && (
                  <p className="text-xs text-red-500">{errors.contentTypes}</p>
                )}
              </div>

              {/* Pillar & Publish Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Tag className="h-3.5 w-3.5 text-zinc-400" />
                    Content Pillar
                  </Label>
                  <Select value={pillar} onValueChange={setPillar}>
                    <SelectTrigger
                      className={`rounded-2xl h-11 ${errors.pillar ? "border-red-300" : ""}`}
                    >
                      <SelectValue placeholder="Select pillar" />
                    </SelectTrigger>
                    <SelectContent>
                      {pillars.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.pillar && (
                    <p className="text-xs text-red-500">{errors.pillar}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="publishDate"
                    className="flex items-center gap-2"
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
                    className={`rounded-2xl h-11 ${errors.publishDate ? "border-red-300" : ""}`}
                  />
                  {errors.publishDate && (
                    <p className="text-xs text-red-500">{errors.publishDate}</p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Drive Links */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="flex items-center gap-2">
                    <Link2 className="h-3.5 w-3.5 text-zinc-400" />
                    Google Drive Links
                  </Label>
                  <span className="text-xs text-zinc-400">
                    {driveLinks.filter((l) => l.trim()).length} link(s)
                  </span>
                </div>

                {driveLinks.map((link, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="relative flex-1">
                      <Link2
                        className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${isGoogleDriveLink(link) ? "text-amber-500" : "text-zinc-400"}`}
                      />
                      <Input
                        value={link}
                        onChange={(e) =>
                          handleLinkChange(index, e.target.value)
                        }
                        placeholder="https://drive.google.com/..."
                        className="pl-10 rounded-2xl h-11"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleRemoveLink(index)}
                      className="w-11 h-11 rounded-2xl hover:text-red-500 hover:border-red-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddLink}
                  className="w-full h-10 rounded-2xl border-dashed"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Another Link
                </Button>

                {errors.driveLinks && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.driveLinks}
                  </p>
                )}
              </div>
            </div>
          ) : (
            /* Revision Note Section */
            <div className="space-y-5">
              {content.revisionNotes && content.revisionNotes.length > 0 && (
                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-3">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Previous Revision Requests
                  </p>
                  <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2">
                    {content.revisionNotes.map((note, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white rounded-xl border border-zinc-100"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs bg-zinc-100">
                                {note.commenter
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-sm">
                              {note.commenter}
                            </span>
                          </div>
                          <span className="text-xs text-zinc-400">
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

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label
                    htmlFor="adminNote"
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-3.5 w-3.5 text-zinc-400" />
                    Your Revision Note
                  </Label>
                  <span
                    className={`text-xs ${adminNote.length > 800 ? "text-red-400" : "text-zinc-400"}`}
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
                  placeholder="Describe the changes you made in this revision..."
                  className={`min-h-[160px] rounded-2xl ${errors.adminNote ? "border-red-300" : ""}`}
                  maxLength={1000}
                />
                {errors.adminNote && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.adminNote}
                  </p>
                )}
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-emerald-900">
                      Status will change to "For Review"
                    </p>
                    <p className="text-xs text-emerald-600 mt-0.5">
                      Content will return to the review pipeline
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="border-t p-6 sm:p-8 bg-white flex-shrink-0">
          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-11 rounded-2xl"
            >
              Cancel
            </Button>

            {activeSection === "edit" ? (
              <Button
                type="button"
                onClick={() => setActiveSection("note")}
                className="h-11 rounded-xl bg-[#430062] font-semibold text-white shadow-md shadow-[#430062]/20 hover:bg-[#5a0080]"
              >
                Continue to Note <Send className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="h-11 rounded-xl bg-[#430062] font-semibold text-white shadow-md shadow-[#430062]/20 hover:bg-[#5a0080] disabled:opacity-70"
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
    </ContentModalShell>
  );
}
