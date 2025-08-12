import React from "react";

type ChoicePopupProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
};

const ChoicePopup: React.FC<ChoicePopupProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/65 bg-opacity-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
        {title && <div className="mb-4 text-center font-semibold">{title}</div>}
        <div className="flex justify-center gap-4">{children}</div>
        <div className="mt-4 flex justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChoicePopup;
