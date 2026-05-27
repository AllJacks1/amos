"use client";

import React, { useState } from "react";
import { CheckCircle2, X, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ApproveConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  contentTitle?: string;
  platforms?: string[]; // ← Updated to array
  clientName?: string;
  brandColor?: string;
}

export default function ApproveConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  contentTitle = "Untitled Content",
  platforms = [], // ← Default to empty array
  clientName = "Client",
  brandColor = "#430062",
}: ApproveConfirmDialogProps) {
  const [isApproving, setIsApproving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsApproving(true);
    setError(null);

    try {
      await onConfirm();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to approve content",
      );
    } finally {
      setIsApproving(false);
    }
  };

  const handleClose = () => {
    if (!isApproving) {
      setError(null);
      onClose();
    }
  };

  // Format platforms for display
  const displayPlatforms =
    platforms.length > 0 ? platforms.join(" • ") : "No platform specified";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-black/10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 text-center">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: `${brandColor}15` }}
          >
            <CheckCircle2 className="h-7 w-7" style={{ color: brandColor }} />
          </div>

          <h2 className="text-xl font-semibold text-zinc-900">
            Approve Content?
          </h2>
          <p className="text-sm text-zinc-500 mt-1.5">
            This action will mark the content as approved and move it to the
            scheduled pipeline.
          </p>
        </div>

        {/* Content Preview */}
        <div className="mx-6 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
          <p className="text-sm font-medium text-zinc-900 line-clamp-2 mb-3">
            {contentTitle}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {platforms.length > 0 ? (
              platforms.map((platform, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs px-2.5 py-0.5 border-zinc-200"
                >
                  {platform}
                </Badge>
              ))
            ) : (
              <Badge variant="outline" className="text-xs px-2.5 py-0.5">
                {displayPlatforms}
              </Badge>
            )}

            {clientName && (
              <span className="text-xs text-zinc-400 ml-auto">
                {clientName}
              </span>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="p-6 pt-5 flex flex-col-reverse sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isApproving}
            className="w-full sm:flex-1 h-11 rounded-2xl font-medium"
          >
            Cancel
          </Button>

          <Button
            onClick={handleConfirm}
            disabled={isApproving}
            className="w-full sm:flex-1 h-11 rounded-2xl font-semibold text-white shadow-lg transition-all active:scale-[0.985] disabled:opacity-50"
            style={{
              backgroundColor: brandColor,
              boxShadow: `0 4px 14px ${brandColor}25`,
            }}
          >
            {isApproving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Approving...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Yes, Approve Content
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
