'use client';

import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type AppFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
  title: string;
  description?: string;
  icon?: LucideIcon;
  size?: 'md' | 'lg';
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function AppFormModal({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  icon: Icon,
  size = 'md',
  children,
  footer,
}: AppFormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger ? <DialogTrigger>{trigger}</DialogTrigger> : null}
      <DialogContent
        className={cn(
          'gap-0 overflow-hidden p-0',
          size === 'lg' ? 'sm:max-w-lg' : 'sm:max-w-md',
        )}
      >
        <div className="border-b border-border/50 bg-gradient-to-br from-lime/25 via-white to-surface/80 px-6 py-5">
          <DialogHeader className="gap-0 text-left">
            <div className="flex items-start gap-3.5">
              {Icon ? (
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-lime/50 shadow-sm ring-1 ring-lime/30">
                  <Icon size={20} className="text-gray-900" />
                </div>
              ) : null}
              <div className="min-w-0 pt-0.5">
                <DialogTitle className="text-lg font-bold tracking-tight text-gray-900">
                  {title}
                </DialogTitle>
                {description ? (
                  <DialogDescription className="mt-1.5 text-sm leading-relaxed">
                    {description}
                  </DialogDescription>
                ) : null}
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="px-6 py-5">{children}</div>

        {footer ? (
          <DialogFooter className="border-t border-border/50 bg-surface/40 px-6 py-4">
            {footer}
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export function FormField({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</Label>
      {children}
      {hint ? <p className="text-xs leading-relaxed text-muted">{hint}</p> : null}
    </div>
  );
}

export function ModalAlert({
  variant = 'warning',
  children,
}: {
  variant?: 'warning' | 'danger' | 'info';
  children: React.ReactNode;
}) {
  const styles = {
    warning: 'border-amber-200/80 bg-amber-50 text-amber-900',
    danger: 'border-red-200/80 bg-red-50 text-red-800',
    info: 'border-primary/20 bg-primary/5 text-gray-800',
  }[variant];

  return (
    <div className={cn('rounded-xl border px-3.5 py-3 text-sm leading-relaxed', styles)}>
      {children}
    </div>
  );
}

export function ModalActions({
  onCancel,
  submitLabel,
  isSubmitting,
  submitDisabled,
  formId,
  loadingLabel = 'Saving…',
}: {
  onCancel: () => void;
  submitLabel: string;
  isSubmitting?: boolean;
  submitDisabled?: boolean;
  formId?: string;
  loadingLabel?: string;
}) {
  return (
    <>
      <Button type="button" variant="outline" onClick={onCancel} className="sm:min-w-[100px]">
        Cancel
      </Button>
      <Button
        type="submit"
        form={formId}
        disabled={isSubmitting || submitDisabled}
        className="sm:min-w-[140px] bg-lime text-gray-900 shadow-[0_4px_14px_rgba(232,255,87,0.35)] hover:bg-lime/90 hover:text-gray-900"
      >
        {isSubmitting ? loadingLabel : submitLabel}
      </Button>
    </>
  );
}
