"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  FileText,
  Calendar,
  User,
  Building2,
  Link2,
  Tag,
  Check,
  Loader2,
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  LinkIcon,
  Globe,
  Video,
  LayoutGrid,
  FileImage,
  Image,
  Type,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClientStore } from "@/store/clientStore";
import { useUsersStore } from "@/store/useUsersStore";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import CharacterCount from "@tiptap/extension-character-count";
import { Badge } from "../ui/badge";

interface EditContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (
    id: string,
    content: {
      title: string;
      caption: string;
      platforms: string[];
      contentTypes: string[];
      publishDate: string;
      client: string;
      assignedTo: string;
      driveLinks: string[];
      pillar: string;
      status: string;
    },
  ) => void;
  content: {
    id: string;
    title: string;
    caption: string;
    platforms: string[];
    contentTypes: string[];
    publishDate: string;
    client: string;
    assignedTo: string;
    driveLinks: string[];
    pillar: string;
    status: string;
  };
  brandColor?: string;
}

const platforms = [
  { value: "Instagram", label: "Instagram", icon: Globe, color: "#E4405F" },
  { value: "LinkedIn", label: "LinkedIn", icon: Globe, color: "#0A66C2" },
  { value: "Facebook", label: "Facebook", icon: Globe, color: "#1877F2" },
  { value: "Twitter", label: "Twitter / X", icon: Globe, color: "#000000" },
  { value: "TikTok", label: "TikTok", icon: Video, color: "#000000" },
  { value: "YouTube", label: "YouTube", icon: Video, color: "#FF0000" },
  {
    value: "Google Business",
    label: "Google Business",
    icon: Globe,
    color: "#F4B400",
  },
];

const contentTypes = [
  { value: "Reel", label: "Reel", icon: Video },
  { value: "Carousel", label: "Carousel", icon: LayoutGrid },
  { value: "Static", label: "Static Post", icon: Image },
  { value: "Story", label: "Story", icon: FileImage },
  { value: "Text", label: "Text Post", icon: Type },
  { value: "Video", label: "Video", icon: Video },
];

const pillars = [
  "Product Launch",
  "Thought Leadership",
  "Educational",
  "Behind the Scenes",
  "User Generated",
  "Promotional",
  "Seasonal",
  "Community",
  "Brand Positioning",
  "Others",
];

export default function EditContentModal({
  isOpen,
  onClose,
  onUpdate,
  content,
  brandColor = "#430062",
}: EditContentModalProps) {
  const [formData, setFormData] = useState({
    ...content,

    platforms: content?.platforms || [],
    contentTypes: content?.contentTypes || [],
    driveLinks: content?.driveLinks || [],

    caption: content?.caption || "",
    title: content?.title || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(1);

  const { clients, fetchClients } = useClientStore();
  const { users, fetchUsers } = useUsersStore();

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

    content: content?.caption || "",

    onUpdate: ({ editor }) => {
      setFormData((prev) => ({
        ...prev,
        caption: editor.getHTML(),
      }));
    },
  });

  useEffect(() => {
    if (editor && content?.caption) {
      editor.commands.setContent(content.caption);
    }
  }, [editor, content]);

  // Reset form when content changes or modal opens
  useEffect(() => {
    if (isOpen && content) {
      setFormData({
        ...content,

        platforms: content?.platforms || [],
        contentTypes: content?.contentTypes || [],
        driveLinks: content?.driveLinks || [],

        caption: content?.caption || "",
        title: content?.title || "",
      });
      setStep(1);
      setErrors({});
      editor?.commands.setContent(content.caption || "");
    }
  }, [isOpen, content, editor]);

  useEffect(() => {
    if (isOpen) {
      fetchClients();
      fetchUsers();
    }
  }, [isOpen, fetchClients, fetchUsers]);

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if ((formData.platforms || []).length === 0)
      newErrors.platform = "At least one platform is required";
    if ((formData.contentTypes || []).length === 0)
      newErrors.contentType = "At least one content type is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.client) newErrors.client = "Client is required";
    if (!formData.assignedTo) newErrors.assignedTo = "Assignee is required";
    if (!formData.pillar) newErrors.pillar = "Content pillar is required";
    if (!formData.publishDate)
      newErrors.publishDate = "Publish date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (validateStep1()) setStep(2);
      return;
    }
    if (!validateStep2()) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    const cleanLinks = formData.driveLinks.filter((link) => link.trim() !== "");

    onUpdate(content.id, {
      ...formData,
      driveLinks: cleanLinks,
      caption: formData.caption || "<p></p>",
    });

    setIsSubmitting(false);
    onClose();
  };

  const handleClose = () => {
    if (!isSubmitting) onClose();
  };

  const selectedPlatformObjects = platforms.filter(
    (p) =>
      Array.isArray(formData?.platforms) &&
      formData.platforms.includes(p.value),
  );

  const addDriveLink = () => {
    setFormData((prev) => ({ ...prev, driveLinks: [...prev.driveLinks, ""] }));
  };

  const removeDriveLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      driveLinks: prev.driveLinks.filter((_, i) => i !== index),
    }));
  };

  const updateDriveLink = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      driveLinks: prev.driveLinks.map((link, i) =>
        i === index ? value : link,
      ),
    }));
  };

  const togglePlatform = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(value)
        ? prev.platforms.filter((p) => p !== value)
        : [...prev.platforms, value],
    }));
  };

  const toggleContentType = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      contentTypes: prev.contentTypes.includes(value)
        ? prev.contentTypes.filter((t) => t !== value)
        : [...prev.contentTypes, value],
    }));
  };

  if (!isOpen) return null;

  const clientsList = clients ?? [];
  const usersList = users ?? [];
  
  const characterCount = editor?.storage.characterCount?.characters() ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 sm:px-8 pt-6 pb-5 border-b border-zinc-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: `${brandColor}15` }}
              >
                <FileText className="h-5 w-5" style={{ color: brandColor }} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-zinc-900">
                  Edit Content
                </h2>
                <p className="text-sm text-zinc-500 mt-0.5">Step {step} of 2</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 flex gap-2">
            <div
              className="h-1.5 flex-1 rounded-full"
              style={{ backgroundColor: brandColor }}
            />
            <div
              className="h-1.5 flex-1 rounded-full"
              style={{ backgroundColor: step >= 2 ? brandColor : "#e4e4e7" }}
            />
          </div>
        </div>

        {/* Form Content - Same structure as Add modal */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6"
        >
          {step === 1 ? (
            <>
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-sm font-medium text-zinc-700"
                >
                  Content Title
                </Label>
                <Input
                  id="title"
                  placeholder="e.g. Summer Collection Launch Reel"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, title: e.target.value }));
                    if (errors.title)
                      setErrors((prev) => ({ ...prev, title: "" }));
                  }}
                  className={`rounded-2xl h-11 ${errors.title ? "border-red-300 focus-visible:ring-red-200" : ""}`}
                />
                {errors.title && (
                  <p className="text-xs text-red-500 ml-1">{errors.title}</p>
                )}
              </div>

              {/* Caption */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-zinc-700">
                  Caption
                </Label>

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
                    onClick={() =>
                      editor?.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                    className={
                      editor?.isActive("heading", { level: 1 })
                        ? "bg-zinc-200"
                        : ""
                    }
                  >
                    <Heading1 className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      editor?.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    className={
                      editor?.isActive("heading", { level: 2 })
                        ? "bg-zinc-200"
                        : ""
                    }
                  >
                    <Heading2 className="h-4 w-4" />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      editor?.chain().focus().toggleBulletList().run()
                    }
                    className={
                      editor?.isActive("bulletList") ? "bg-zinc-200" : ""
                    }
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      editor?.chain().focus().toggleOrderedList().run()
                    }
                    className={
                      editor?.isActive("orderedList") ? "bg-zinc-200" : ""
                    }
                  >
                    <ListOrdered className="h-4 w-4" />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const url = prompt("Enter URL:");
                      if (url)
                        editor?.chain().focus().setLink({ href: url }).run();
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

              {/* Platform */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-zinc-700">
                  Platforms{" "}
                  <span className="text-zinc-400 text-xs">
                    (multiple allowed)
                  </span>
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {platforms.map((platform) => {
                    const Icon = platform.icon;

                    const isSelected = (formData.platforms || []).includes(
                      platform.value,
                    );

                    return (
                      <button
                        key={platform.value}
                        type="button"
                        onClick={() => togglePlatform(platform.value)}
                        className={`
          flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-200 relative
          ${
            isSelected
              ? "border-violet-500 bg-violet-50 text-violet-700"
              : "border-zinc-200 hover:border-zinc-300 text-zinc-600 hover:bg-zinc-50"
          }
        `}
                      >
                        <Icon
                          className="h-5 w-5"
                          style={{ color: isSelected ? brandColor : undefined }}
                        />

                        <span className="text-xs font-medium">
                          {platform.label}
                        </span>

                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5">
                            <Check className="h-3 w-3 text-violet-600" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                {errors.platform && (
                  <p className="text-xs text-red-500 ml-1">{errors.platform}</p>
                )}
              </div>

              {/* Content Type */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-zinc-700">
                  Content Types{" "}
                  <span className="text-zinc-400 text-xs">
                    (multiple allowed)
                  </span>
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {contentTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = (formData.contentTypes || []).includes(
                      type.value,
                    );
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => toggleContentType(type.value)}
                        className={`
                            flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-200 relative
                            ${
                              isSelected
                                ? "border-violet-500 bg-violet-50 text-violet-700"
                                : "border-zinc-200 hover:border-zinc-300 text-zinc-600 hover:bg-zinc-50"
                            }
                          `}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-xs font-medium">
                          {type.label}
                        </span>
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5">
                            <Check className="h-3 w-3 text-violet-600" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                {errors.contentType && (
                  <p className="text-xs text-red-500 ml-1">
                    {errors.contentType}
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Client */}
              <div className="space-y-2">
                <Label
                  htmlFor="client"
                  className="text-sm font-medium text-zinc-700"
                >
                  Client
                </Label>
                <Select
                  value={formData.client}
                  onValueChange={(value) => {
                    setFormData((prev) => ({ ...prev, client: value }));
                    if (errors.client)
                      setErrors((prev) => ({ ...prev, client: "" }));
                  }}
                >
                  <SelectTrigger
                    id="client"
                    className={`rounded-2xl h-11 ${errors.client ? "border-red-300 focus-visible:ring-red-200" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-zinc-400" />
                      <SelectValue placeholder="Select client" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {clientsList.map((client) => (
                      <SelectItem key={client.id} value={String(client.id)}>
                        {client.company_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.client && (
                  <p className="text-xs text-red-500 ml-1">{errors.client}</p>
                )}
              </div>

              {/* Assigned To */}
              <div className="space-y-2">
                <Label
                  htmlFor="assignedTo"
                  className="text-sm font-medium text-zinc-700"
                >
                  Assigned To
                </Label>
                <Select
                  value={formData.assignedTo}
                  onValueChange={(value) => {
                    setFormData((prev) => ({ ...prev, assignedTo: value }));
                    if (errors.assignedTo)
                      setErrors((prev) => ({ ...prev, assignedTo: "" }));
                  }}
                >
                  <SelectTrigger
                    id="assignedTo"
                    className={`rounded-2xl h-11 ${errors.assignedTo ? "border-red-300 focus-visible:ring-red-200" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-zinc-400" />
                      <SelectValue placeholder="Select team member" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {usersList.map((user) => (
                      <SelectItem key={user.id} value={String(user.id)}>
                        {user.fullname}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.assignedTo && (
                  <p className="text-xs text-red-500 ml-1">
                    {errors.assignedTo}
                  </p>
                )}
              </div>

              {/* Pillar */}
              <div className="space-y-2">
                <Label
                  htmlFor="pillar"
                  className="text-sm font-medium text-zinc-700"
                >
                  Content Pillar
                </Label>
                <Select
                  value={formData.pillar}
                  onValueChange={(value) => {
                    setFormData((prev) => ({ ...prev, pillar: value }));
                    if (errors.pillar)
                      setErrors((prev) => ({ ...prev, pillar: "" }));
                  }}
                >
                  <SelectTrigger
                    id="pillar"
                    className={`rounded-2xl h-11 ${errors.pillar ? "border-red-300 focus-visible:ring-red-200" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-zinc-400" />
                      <SelectValue placeholder="Select pillar" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    {pillars.map((pillar) => (
                      <SelectItem
                        key={pillar}
                        value={pillar}
                        className="rounded-xl cursor-pointer"
                      >
                        {pillar}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.pillar && (
                  <p className="text-xs text-red-500 ml-1">{errors.pillar}</p>
                )}
              </div>

              {/* Publish Date */}
              <div className="space-y-2">
                <Label
                  htmlFor="publishDate"
                  className="text-sm font-medium text-zinc-700"
                >
                  Publish Date
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <Input
                    id="publishDate"
                    type="date"
                    value={formData.publishDate}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        publishDate: e.target.value,
                      }));
                      if (errors.publishDate)
                        setErrors((prev) => ({ ...prev, publishDate: "" }));
                    }}
                    className={`pl-10 rounded-2xl h-11 ${errors.publishDate ? "border-red-300 focus-visible:ring-red-200" : ""}`}
                  />
                </div>
                {errors.publishDate && (
                  <p className="text-xs text-red-500 ml-1">
                    {errors.publishDate}
                  </p>
                )}
              </div>

              {/* Drive Links */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-zinc-700">
                  Google Drive Links
                </Label>
                <div className="space-y-2">
                  {(formData.driveLinks || []).map((link, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="relative flex-1">
                        <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <Input
                          placeholder="https://drive.google.com/..."
                          value={link}
                          onChange={(e) =>
                            updateDriveLink(index, e.target.value)
                          }
                          className="pl-10 rounded-2xl h-11"
                        />
                      </div>
                      {formData.driveLinks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeDriveLink(index)}
                          className="w-11 h-11 rounded-2xl border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addDriveLink}
                  className="text-sm font-medium flex items-center gap-1.5 hover:underline"
                  style={{ color: brandColor }}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add another link
                </button>
              </div>
            </>
          )}

          {(formData.title ||
            (formData.platforms || []).length > 0 ||
            formData.caption) && (
            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                Preview
              </p>

              <div className="flex items-start gap-3">
                {/* Platform Icons */}
                <div className="flex -space-x-2">
                  {selectedPlatformObjects.slice(0, 3).map((p, i) => (
                    <div
                      key={i}
                      className="w-9 h-9 rounded-xl flex items-center justify-center border-2 border-white"
                      style={{ backgroundColor: `${p.color}15` }}
                    >
                      <p.icon className="h-4 w-4" style={{ color: p.color }} />
                    </div>
                  ))}
                  {selectedPlatformObjects.length > 3 && (
                    <div className="w-9 h-9 rounded-xl bg-zinc-200 flex items-center justify-center text-xs font-medium border-2 border-white">
                      +{selectedPlatformObjects.length - 3}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-zinc-900 truncate">
                    {formData.title || "Untitled Content"}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {(formData.platforms || []).map((p) => (
                      <Badge key={p} variant="outline" className="text-[10px]">
                        {p}
                      </Badge>
                    ))}
                    {(formData.contentTypes || []).map((t) => (
                      <Badge key={t} variant="outline" className="text-[10px]">
                        {t}
                      </Badge>
                    ))}
                  </div>

                  {/* Updated Caption Preview with HTML rendering */}
                  {formData.caption && (
                    <div
                      className="text-sm text-zinc-600 mt-3 line-clamp-3 prose prose-sm prose-zinc max-w-none"
                      dangerouslySetInnerHTML={{ __html: formData.caption }}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="border-t bg-white p-6 sm:p-8 flex-shrink-0">
          <div className="flex flex-col-reverse sm:flex-row gap-3">
            {step === 2 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="w-full sm:flex-1 h-11 rounded-2xl"
              >
                Back
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="w-full sm:flex-1 h-11 rounded-2xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full sm:flex-1 h-11 rounded-2xl font-semibold text-white"
              style={{ backgroundColor: brandColor }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : step === 1 ? (
                "Next"
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
