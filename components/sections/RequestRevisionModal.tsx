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
  contentPlatform?: string;
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
  contentPlatform = "Instagram",
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl shadow-black/10 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 sm:px-8 pt-6 pb-5 border-b border-zinc-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: `${brandColor}15` }}
              >
                <MessageSquare
                  className="h-5 w-5"
                  style={{ color: brandColor }}
                />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-zinc-900">
                  Request Revision
                </h2>
                <p className="text-sm text-zinc-500 mt-0.5">
                  Send feedback to {assignedTo}
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

          {/* Content Preview */}
          <div className="mt-4 flex items-center gap-2 p-3 bg-zinc-50 rounded-2xl border border-zinc-100">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${brandColor}15` }}
            >
              <span className="text-xs font-bold" style={{ color: brandColor }}>
                {contentTitle.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-zinc-900 truncate">
                {contentTitle}
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  {contentPlatform}
                </Badge>
                <span className="text-xs text-zinc-400">{assignedTo}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6"
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
                    className={`
                      relative flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all duration-200
                      ${
                        isSelected
                          ? `${p.border} ${p.bg} ${p.text}`
                          : "border-zinc-200 hover:border-zinc-300 text-zinc-600 hover:bg-zinc-50"
                      }
                    `}
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
                onClick={() => {
                  setDueDate(getTomorrow());
                  if (errors.dueDate)
                    setErrors((prev) => ({ ...prev, dueDate: "" }));
                }}
                className="px-4 h-11 rounded-2xl border border-zinc-200 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors whitespace-nowrap"
              >
                Tomorrow
              </button>
              <button
                type="button"
                onClick={() => {
                  setDueDate(getThreeDays());
                  if (errors.dueDate)
                    setErrors((prev) => ({ ...prev, dueDate: "" }));
                }}
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
                if (e.target.value.length > 0) setShowQuickFeedback(false);
                if (e.target.value.length === 0) setShowQuickFeedback(true);
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

          {/* Quick Feedback Chips */}
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
                Request Preview
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
                <div className="flex items-center gap-2 pl-10">
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
            <Button
              type="submit"
              disabled={isSubmitting || !comment.trim()}
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
      </div>
    </div>
  );
}
