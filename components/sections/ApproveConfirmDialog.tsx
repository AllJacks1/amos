"use client";

import React, { useState } from "react";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ContentModalHeader,
  ContentModalShell,
  ContentPreviewCard,
} from "./content-ui";

interface ApproveConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  contentTitle?: string;
  platforms?: string[];
  clientName?: string;
  brandColor?: string;
}

export default function ApproveConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  contentTitle = "Untitled Content",
  platforms = [],
  clientName = "Client",
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

  return (
    <ContentModalShell onClose={handleClose} maxWidth="max-w-md">
      <ContentModalHeader
        icon={CheckCircle2}
        title="Approve content?"
        subtitle="This marks the piece as approved and moves it toward scheduling."
        onClose={handleClose}
        disabled={isApproving}
      />

      <div className="space-y-4 px-6 pb-2 sm:px-8">
        <ContentPreviewCard>
          <p className="mb-3 line-clamp-2 text-sm font-semibold text-zinc-900">
            {contentTitle}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {platforms.length > 0 ? (
              platforms.map((platform) => (
                <Badge
                  key={platform}
                  variant="outline"
                  className="border-zinc-200/80 text-xs"
                >
                  {platform}
                </Badge>
              ))
            ) : (
              <Badge variant="outline" className="text-xs">
                No platform
              </Badge>
            )}
            {clientName ? (
              <span className="ml-auto text-xs text-zinc-500">{clientName}</span>
            ) : null}
          </div>
        </ContentPreviewCard>

        {error ? (
          <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-3">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
            <p className="text-xs text-red-600">{error}</p>
          </div>
        ) : null}
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-zinc-100 bg-zinc-50/50 p-6 sm:flex-row">
        <Button
          variant="outline"
          onClick={handleClose}
          disabled={isApproving}
          className="h-11 flex-1 rounded-xl"
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={isApproving}
          className="h-11 flex-1 rounded-xl bg-[#430062] font-semibold text-white shadow-md shadow-[#430062]/20 hover:bg-[#5a0080] disabled:opacity-50"
        >
          {isApproving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Approving...
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Yes, approve
            </>
          )}
        </Button>
      </div>
    </ContentModalShell>
  );
}
