"use client";

import React, { useState } from "react";
import {
  X,
  MessageSquare,
  Send,
  Loader2,
  AlertCircle,
  Clock,
  CheckCircle,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/useAuthStore";
import {
  ContentModalHeader,
  ContentModalShell,
  ContentPreviewCard,
} from "./content-ui";

interface RequestRevisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (revisionRequest: {
    comment: string;
    priority: "low" | "medium" | "high";
    dueDate: string;
    clientName: string;
  }) => void;
  contentTitle?: string;
  contentPlatforms?: string[]; // ← Changed to array
  contentTypes?: string[]; // ← Added
  assignedTo?: string;
  brandColor?: string;
}

const priorities = [
  {
    value: "low" as const,
    label: "Low",
    description: "When you have time",
    color: "#22c55e",
    border: "border-emerald-200",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
  },
  {
    value: "medium" as const,
    label: "Medium",
    description: "Standard turnaround",
    color: "#f59e0b",
    border: "border-amber-200",
    bg: "bg-amber-50",
    text: "text-amber-700",
  },
  {
    value: "high" as const,
    label: "High",
    description: "Urgent - ASAP",
    color: "#ef4444",
    border: "border-rose-200",
    bg: "bg-rose-50",
    text: "text-rose-700",
  },
];

const quickFeedback = [
  "Update brand colors to match guidelines",
  "Add logo watermark to all frames",
  "Shorten caption - too wordy",
  "Replace music track - not on-brand",
  "Fix typo in slide 3",
  "Make CTA more prominent",
  "Adjust aspect ratio for Stories",
  "Add alt text for accessibility",
];

export default function RequestRevisionModal({
  isOpen,
  onClose,
  onSubmit,
  contentTitle = "Untitled Content",
  contentPlatforms = [], // ← Default empty array
  contentTypes = [], // ← Added
  assignedTo = "Team Member",
  brandColor = "#430062",
}: RequestRevisionModalProps) {
  const user = useAuthStore((state) => state.user);

  const [comment, setComment] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [dueDate, setDueDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showQuickFeedback, setShowQuickFeedback] = useState(true);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!comment.trim())
      newErrors.comment = "Please describe what needs to be revised";
    if (!dueDate) newErrors.dueDate = "Please set a due date";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    onSubmit({
      comment,
      priority,
      dueDate,
      clientName: user?.primary_contact_name?.toString() || "Client",
    });

    setIsSubmitting(false);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setComment("");
    setPriority("medium");
    setDueDate("");
    setErrors({});
    setShowQuickFeedback(true);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  const addQuickFeedback = (text: string) => {
    setComment((prev) => (prev ? `${prev}\n• ${text}` : `• ${text}`));
    setShowQuickFeedback(false);
  };

  const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const getThreeDays = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toISOString().split("T")[0];
  };

  if (!isOpen) return null;

  const selectedPriority = priorities.find((p) => p.value === priority);

  return (
    <ContentModalShell onClose={handleClose} maxWidth="max-w-xl">
        <ContentModalHeader
          icon={MessageSquare}
          title="Request Revision"
          subtitle={`Send feedback to ${assignedTo}`}
          onClose={handleClose}
          disabled={isSubmitting}
        />

          <ContentPreviewCard className="mx-6 mt-4 sm:mx-8">
            <div className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: `${brandColor}15` }}
              >
                <span
                  className="text-xs font-bold"
                  style={{ color: brandColor }}
                >
                  {contentTitle.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-zinc-900 truncate">
                  {contentTitle}
                </p>

                {/* Multiple Platforms & Content Types */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {contentPlatforms.length > 0 &&
                    contentPlatforms.map((platform) => (
                      <Badge
                        key={platform}
                        variant="outline"
                        className="text-[10px] px-2 py-0"
                      >
                        {platform}
                      </Badge>
                    ))}

                  {contentTypes.length > 0 &&
                    contentTypes.map((type) => (
                      <Badge
                        key={type}
                        variant="secondary"
                        className="text-[10px] px-2 py-0 bg-zinc-100"
                      >
                        {type}
                      </Badge>
                    ))}
                </div>

                <p className="text-xs text-zinc-400 mt-1">{assignedTo}</p>
              </div>
            </div>
          </ContentPreviewCard>

        <form
          onSubmit={handleSubmit}
          className="flex-1 space-y-6 overflow-y-auto overscroll-y-contain px-6 py-6 sm:px-8"
        >
          {/* Priority Selector */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-zinc-700">
              Revision Priority
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {priorities.map((p) => {
                const isSelected = priority === p.value;
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPriority(p.value)}
                    className={`relative flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all duration-200 ${
                      isSelected
                        ? `${p.border} ${p.bg} ${p.text}`
                        : "border-zinc-200 hover:border-zinc-300 text-zinc-600 hover:bg-zinc-50"
                    }`}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: isSelected ? p.color : "#d4d4d8",
                      }}
                    />
                    <span className="text-sm font-semibold">{p.label}</span>
                    <span className="text-[10px] text-center leading-tight opacity-80">
                      {p.description}
                    </span>
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5">
                        <CheckCircle
                          className="h-3.5 w-3.5"
                          style={{ color: p.color }}
                        />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label
              htmlFor="dueDate"
              className="text-sm font-medium text-zinc-700"
            >
              Revision Due Date
            </Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => {
                    setDueDate(e.target.value);
                    if (errors.dueDate)
                      setErrors((prev) => ({ ...prev, dueDate: "" }));
                  }}
                  className={`pl-10 rounded-2xl h-11 ${errors.dueDate ? "border-red-300 focus-visible:ring-red-200" : ""}`}
                />
              </div>
              <button
                type="button"
                onClick={() => setDueDate(getTomorrow())}
                className="px-4 h-11 rounded-2xl border border-zinc-200 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors whitespace-nowrap"
              >
                Tomorrow
              </button>
              <button
                type="button"
                onClick={() => setDueDate(getThreeDays())}
                className="px-4 h-11 rounded-2xl border border-zinc-200 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors whitespace-nowrap"
              >
                3 Days
              </button>
            </div>
            {errors.dueDate && (
              <p className="text-xs text-red-500 ml-1">{errors.dueDate}</p>
            )}
          </div>

          <Separator className="my-2" />

          {/* Revision Comment */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="comment"
                className="text-sm font-medium text-zinc-700"
              >
                Revision Notes
              </Label>
              <span
                className={`text-xs ${comment.length > 500 ? "text-red-400" : "text-zinc-400"}`}
              >
                {comment.length}/1000
              </span>
            </div>
            <Textarea
              id="comment"
              placeholder="Describe what needs to be changed... Be specific about colors, text, layout, or timing."
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                if (errors.comment)
                  setErrors((prev) => ({ ...prev, comment: "" }));
                setShowQuickFeedback(e.target.value.length === 0);
              }}
              className={`rounded-2xl min-h-[140px] resize-none ${errors.comment ? "border-red-300 focus-visible:ring-red-200" : ""}`}
              maxLength={1000}
            />
            {errors.comment && (
              <p className="text-xs text-red-500 ml-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.comment}
              </p>
            )}
          </div>

          {/* Quick Feedback */}
          {showQuickFeedback && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-zinc-500">
                Quick suggestions
              </p>
              <div className="flex flex-wrap gap-2">
                {quickFeedback.map((text) => (
                  <button
                    key={text}
                    type="button"
                    onClick={() => addQuickFeedback(text)}
                    className="text-xs px-3 py-1.5 rounded-full border border-zinc-200 text-zinc-600 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 transition-all"
                  >
                    + {text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Request Preview */}
          {comment && (
            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                REQUEST PREVIEW
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs bg-zinc-200">
                      YO
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-zinc-900">
                      Your request
                    </p>
                    <p className="text-xs text-zinc-500">To: {assignedTo}</p>
                  </div>
                </div>
                <div className="pl-10">
                  <p className="text-sm text-zinc-700 whitespace-pre-wrap">
                    {comment}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 pl-10">
                  {selectedPriority && (
                    <Badge
                      variant="outline"
                      className="text-[10px]"
                      style={{
                        borderColor: selectedPriority.color,
                        color: selectedPriority.color,
                      }}
                    >
                      {selectedPriority.label} Priority
                    </Badge>
                  )}
                  {dueDate && (
                    <Badge
                      variant="outline"
                      className="text-[10px] text-zinc-500"
                    >
                      Due{" "}
                      {new Date(dueDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}
        </form>

        <div className="shrink-0 border-t border-zinc-100 bg-zinc-50/50 p-6 sm:p-8">
          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="h-11 w-full rounded-xl font-medium sm:flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !comment.trim()}
              onClick={handleSubmit}
              className="h-11 w-full rounded-xl bg-[#430062] font-semibold text-white shadow-md shadow-[#430062]/20 hover:bg-[#5a0080] active:scale-[0.99] disabled:opacity-50 sm:flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Revision Request
                </>
              )}
            </Button>
          </div>
        </div>
    </ContentModalShell>
  );
}
