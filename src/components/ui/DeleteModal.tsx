import { Modal } from "./Modal";
import { Button } from "./Button";
import { AlertTriangle, Loader2 } from "lucide-react";

interface DeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  isDeleting?: boolean;
}

export function DeleteModal({
  open,
  onClose,
  onConfirm,
  title,
  description = "Are you sure you want to delete this item? This action cannot be undone.",
  isDeleting = false,
}: DeleteModalProps) {
  return (
    <Modal open={open} onClose={onClose} size="sm" persistent={isDeleting}>
      <div className="flex flex-col items-center text-center space-y-4 pt-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-500" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>

        <div className="flex w-full flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 gap-3 sm:gap-0 mt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isDeleting}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={onConfirm}
            disabled={isDeleting}
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
