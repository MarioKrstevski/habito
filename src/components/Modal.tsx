import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ModalProps {
  title: string;
  description?: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  className?: string;
  children?: React.ReactNode;
  innerScroll?: boolean;
  footerJSX?: React.ReactNode;
  confirmLabel?: string;
}

export const Modal: React.FC<ModalProps> = ({
  title,
  description,
  isOpen,
  onClose,
  onConfirm,
  className = "",
  children,
  footerJSX,
  confirmLabel = "Save",
  innerScroll = false,
}) => {
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} modal onOpenChange={onChange}>
      <DialogContent
        className={cn(" max-h-[95dvh] w-full ", className)}
      >
        <DialogHeader className="h-max ">
          <DialogTitle className="h-7 items-center flex">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>
        <div
          className={cn(
            "overflow-y-hidden ",
            innerScroll && "max-h-[calc(95dvh-150px)] overflow-y-auto"
          )}
        >
          {children}
        </div>
        {(onConfirm || footerJSX) && (
          <DialogFooter>
            {footerJSX ? (
              footerJSX
            ) : (
              <Button type="submit" onClick={onConfirm}>
                {confirmLabel}
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
