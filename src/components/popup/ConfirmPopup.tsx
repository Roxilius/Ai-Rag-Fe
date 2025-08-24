import React from "react";
import { motion } from "framer-motion";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 8 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-6"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Konfirmasi</h3>
        <p className="text-gray-600">{message}</p>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:opacity-90 transition"
          >
            Ya, lanjut
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmPopup;
