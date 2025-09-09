import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./dialog";

interface NotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  hideAction?: boolean;
  children?: React.ReactNode;
}

export const NotificationDialog: React.FC<NotificationDialogProps> = ({
  open,
  onOpenChange,
  title,
  message,
  actionLabel = "Close",
  onAction,
  hideAction = false,
  children,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <div className="py-4">{message}</div>
      {children}
      {!hideAction && (
        <DialogFooter>
          <button
            className="bg-accent-50 text-black px-4 py-2 rounded w-full"
            onClick={() => {
              onOpenChange(false);
              if (onAction) onAction();
            }}
          >
            {actionLabel}
          </button>
        </DialogFooter>
      )}
    </DialogContent>
  </Dialog>
);

