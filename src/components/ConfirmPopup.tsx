import React from "react";

type ConfirmPopupProps = {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmPopup: React.FC<ConfirmPopupProps> = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/65 bg-opacity-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
        <p className="mb-4 text-center">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Yes
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded text-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPopup;
