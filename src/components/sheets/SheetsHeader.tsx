import React from "react";
import { XCircle } from "lucide-react";

interface SheetsHeaderProps {
  selectedCount: number;
  onCancel: () => void;
  onStartIndexing: () => void;
  handleClearIndexing: () => Promise<void>;
  openConfirmPopup: (message: string, onConfirm: () => void) => void;
  closeConfirmPopup: () => void;
}

const SheetsHeader: React.FC<SheetsHeaderProps> = ({
  selectedCount,
  onCancel,
  onStartIndexing,
  handleClearIndexing,
  openConfirmPopup,
  closeConfirmPopup,
}) => {
  return (
    <div
      className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-6"
    >
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
        Sheets Manager
      </h1>
      <div className="flex flex-wrap gap-2">
        {/* Tombol Cancel Selection */}
        <button
          onClick={onCancel}
          disabled={!selectedCount}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium shadow transition ${
            selectedCount
              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          <XCircle className="w-4 h-4" />
          Batalkan Pilihan
        </button>

        {/* Tombol Indexing */}
        <button
          onClick={onStartIndexing}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium shadow hover:bg-blue-700 transition"
        >
          Mulai Indexing
        </button>
        <button
          onClick={() =>
            openConfirmPopup("Clear semua indexing di server?", async () => {
              await handleClearIndexing();
              closeConfirmPopup();
            })
          }
          className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium shadow hover:opacity-95 transition"
        >
          ✨ Clear
        </button>
      </div>
    </div>
  );
};

export default SheetsHeader;
