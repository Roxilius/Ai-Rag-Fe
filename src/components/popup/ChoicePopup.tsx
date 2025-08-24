import React from "react";
import { motion, AnimatePresence } from "framer-motion";

type ChoicePopupProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
};

const ChoicePopup: React.FC<ChoicePopupProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-6"
          >
            {title && (
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                {title}
              </h3>
            )}

            <div className="flex justify-center gap-3">{children}</div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ChoicePopup;
