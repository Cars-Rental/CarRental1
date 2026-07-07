"use client";

import { FormEvent, useState } from "react";
import { Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RejectionReasonDialogProps {
  open: boolean;
  title: string;
  description: string;
  label: string;
  placeholder: string;
  errorMessage: string;
  cancelLabel: string;
  confirmLabel: string;
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
}

export function RejectionReasonDialog({
  open,
  title,
  description,
  label,
  placeholder,
  errorMessage,
  cancelLabel,
  confirmLabel,
  isSubmitting,
  onOpenChange,
  onConfirm,
}: RejectionReasonDialogProps) {
  const [reason, setReason] = useState("");
  const [showError, setShowError] = useState(false);

  function resetForm() {
    setReason("");
    setShowError(false);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      resetForm();
    }
    onOpenChange(nextOpen);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedReason = reason.trim();
    if (!trimmedReason) {
      setShowError(true);
      return;
    }

    onConfirm(trimmedReason);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 sm:max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-5">
          <DialogHeader>
            <div className="mb-1 flex size-11 items-center justify-center rounded-full bg-rose-50 text-destructive dark:bg-rose-500/10 dark:text-rose-300">
              <XCircle className="size-5" />
            </div>
            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {title}
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400">
              {description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <label
              htmlFor="rejectionReason"
              className="text-sm font-semibold text-slate-700 dark:text-slate-200"
            >
              {label}
            </label>
            <textarea
              id="rejectionReason"
              value={reason}
              onChange={(event) => {
                setReason(event.target.value);
                if (showError && event.target.value.trim()) {
                  setShowError(false);
                }
              }}
              placeholder={placeholder}
              rows={4}
              disabled={isSubmitting}
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
            {showError && (
              <p className="text-xs font-semibold text-destructive dark:text-rose-300">
                {errorMessage}
              </p>
            )}
          </div>

          <DialogFooter className="dark:border-slate-800 dark:bg-slate-950/40">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => handleOpenChange(false)}
            >
              {cancelLabel}
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={isSubmitting}
              className="gap-2"
            >
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              {confirmLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
