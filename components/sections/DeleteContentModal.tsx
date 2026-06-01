"use client";

import React, { useState } from "react";
import { AlertTriangle, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface DeleteContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
  contentTitle: string;
  contentId: string;
  isDeleting?: boolean;
}

export default function DeleteContentModal({
  isOpen,
  onClose,
  onConfirm,
  contentTitle,
  contentId,
  isDeleting = false,
}: DeleteContentModalProps) {
  const [confirmText, setConfirmText] = useState("");

  const handleConfirm = () => {
    onConfirm(contentId);
    // Reset input after confirm
    setConfirmText("");
  };

  const isConfirmed = confirmText.toLowerCase() === "delete";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="gap-0 overflow-hidden border-zinc-200/80 p-0 shadow-2xl sm:max-w-[420px]">
        <DialogHeader className="relative bg-gradient-to-b from-red-50/90 to-white p-6 pb-5">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-red-500 via-rose-400 to-orange-300" />
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-white shadow-sm border border-red-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle
                className="h-5 w-5 text-red-500"
                strokeWidth={2.5}
              />
            </div>
            <div className="space-y-1 pt-0.5">
              <DialogTitle className="text-lg font-semibold text-zinc-900 leading-tight">
                Delete Content
              </DialogTitle>
              <DialogDescription className="text-sm text-zinc-500 leading-relaxed">
                This action cannot be undone. Please confirm you want to
                proceed.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="p-6 pt-2 space-y-5">
          {/* Content preview card */}
          <div className="bg-zinc-50/80 border border-zinc-200/80 rounded-xl p-4 relative overflow-hidden group">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-400 rounded-l-xl" />
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
              Item to delete
            </p>
            <p className="font-semibold text-zinc-800 text-sm leading-snug break-all">
              "{contentTitle}"
            </p>
          </div>

          {/* Confirmation input */}
          <div className="space-y-2.5">
            <label className="text-sm font-medium text-zinc-700 flex items-center gap-2">
              Type to{" "}
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-red-50 text-red-600 text-xs font-mono font-bold border border-red-100">
                DELETE
              </span>{" "}
              confirm.
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE here..."
              className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all duration-200"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
            />
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="border-t border-zinc-100 bg-zinc-50/50 p-6">
          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 h-11 rounded-xl border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 hover:border-zinc-300 transition-all duration-200 font-medium"
            >
              Cancel
            </Button>

            <Button
              onClick={handleConfirm}
              disabled={!isConfirmed || isDeleting}
              className="flex-1 h-11 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800/20 text-white transition-all duration-200 font-medium shadow-sm shadow-red-500/20 disabled:opacity-40 disabled:shadow-none"
            >
              {isDeleting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete Content
                </span>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
