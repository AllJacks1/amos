"use client";

import React from "react";
import type { LucideIcon } from "lucide-react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const CONTENT_BRAND = "#430062";
export const CONTENT_BRAND_MID = "#6b1a8f";
export const CONTENT_BRAND_LIGHT = "#c4b5fd";

export const contentStatusStyles: Record<string, string> = {
  review: "bg-amber-50 text-amber-800 ring-1 ring-amber-200/80",
  revise: "bg-rose-50 text-rose-800 ring-1 ring-rose-200/80",
  approved: "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200/80",
  scheduled: "bg-blue-50 text-blue-800 ring-1 ring-blue-200/80",
  posted: "bg-violet-50 text-violet-800 ring-1 ring-violet-200/80",
};

export const contentStatusLabels: Record<string, string> = {
  review: "For Review",
  revise: "For Revision",
  approved: "Approved",
  scheduled: "Scheduled",
  posted: "Posted",
};

export const contentInputClass =
  "h-11 rounded-xl border-zinc-200/80 bg-white shadow-sm focus-visible:border-[#430062]/40 focus-visible:ring-[#430062]/15";

export const contentLabelClass = "text-sm font-medium text-zinc-700";

export function ContentSectionLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function ContentModalOverlay({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <div
      className="absolute inset-0 bg-[#14061c]/55 backdrop-blur-md"
      onClick={onClick}
      aria-hidden
    />
  );
}

export function ContentModalShell({
  children,
  className,
  maxWidth = "max-w-lg",
  onClose,
}: {
  children: React.ReactNode;
  className?: string;
  maxWidth?: string;
  onClose?: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overscroll-contain p-4 sm:p-6">
      {onClose ? <ContentModalOverlay onClick={onClose} /> : null}
      <div
        className={cn(
          "relative flex max-h-[min(92vh,900px)] w-full flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-2xl shadow-zinc-900/10 ring-1 ring-black/[0.04] animate-in fade-in zoom-in-95 duration-200",
          maxWidth,
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function ContentModalHeader({
  icon: Icon,
  title,
  subtitle,
  onClose,
  disabled,
  progress,
}: {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  onClose: () => void;
  disabled?: boolean;
  progress?: { step: number; total: number };
}) {
  return (
    <div className="relative shrink-0 border-b border-zinc-100 bg-gradient-to-b from-[#430062]/[0.07] to-white px-6 pb-5 pt-6 sm:px-8">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#430062] via-[#6b1a8f] to-[#a855f7]" />
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#430062]/10 ring-1 ring-[#430062]/15">
            <Icon className="h-5 w-5 text-[#430062]" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl">
              {title}
            </h2>
            {subtitle ? (
              <p className="mt-0.5 text-sm text-zinc-500">{subtitle}</p>
            ) : null}
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          disabled={disabled}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-50"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      {progress ? (
        <div className="mt-4 flex gap-2">
          {Array.from({ length: progress.total }, (_, i) => (
            <div
              key={i}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors duration-300",
                i < progress.step ? "bg-[#430062]" : "bg-zinc-200",
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function ContentPreviewCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-zinc-200/80 bg-zinc-50/80 p-4 ring-1 ring-black/[0.02]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function ContentPrimaryButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl bg-[#430062] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#430062]/20 transition-all hover:bg-[#5a0080] hover:shadow-lg active:scale-[0.99] disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
