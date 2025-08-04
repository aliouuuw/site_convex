import { ReactNode } from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <div className="text-gray-600 mb-6">
          {typeof message === 'string' ? <p>{message}</p> : message}
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="btn btn-secondary"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`btn ${
              isDestructive
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'btn-primary'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
