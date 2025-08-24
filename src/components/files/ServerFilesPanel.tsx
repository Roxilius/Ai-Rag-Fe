import React from "react";
import { motion } from "framer-motion";
import type { FileServer } from "../../types/types";
import Pagination from "../Pagination";

type Props = {
  serverFiles: FileServer | null;
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  selectedForIndexing: Set<string>;
  toggleFileSelection: (id: string) => void;
  openConfirmPopup: (message: string, onConfirm: () => void) => void;
  handleDelete: () => Promise<void>;
  handleClearIndexing: () => Promise<void>;
  setChoicePopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  closeConfirmPopup: () => void;
};

const listVariants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

const ServerFilesPanel: React.FC<Props> = ({
  serverFiles,
  isLoading,
  currentPage,
  totalPages,
  setCurrentPage,
  selectedForIndexing,
  toggleFileSelection,
  openConfirmPopup,
  handleDelete,
  handleClearIndexing,
  setChoicePopupOpen,
  closeConfirmPopup,
}) => {
  const hasData = Boolean(serverFiles?.data?.length);

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="w-full flex flex-col rounded-xl border border-purple-100 bg-gradient-to-br from-white to-purple-50 p-3 sm:p-4 shadow"
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold text-gray-800">📂 Files</h2>
        <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-gray-50 text-gray-600 border border-gray-200">
          {isLoading ? "Loading..." : `Total: ${serverFiles?.pagination?.totalItems ?? 0}`}
        </span>
      </div>

      {/* File List */}
      <motion.ul
        variants={listVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 overflow-y-auto max-h-[36vh] sm:max-h-[46vh] lg:max-h-[52vh] space-y-1 pr-1"
      >
        {hasData ? (
          serverFiles!.data.map((file) => {
            const isChecked = selectedForIndexing.has(String(file.id));
            const disabled = !!file.indexed;
            return (
              <motion.li
                key={String(file.id)}
                variants={itemVariants}
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-2 py-1 shadow-sm hover:shadow transition text-xs sm:text-sm"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleFileSelection(String(file.id))}
                  disabled={disabled}
                  className="w-3.5 h-3.5 accent-purple-600 disabled:opacity-40"
                />
                <div className="truncate flex-1">
                  <p
                    className={`truncate font-medium ${
                      disabled ? "text-gray-400 line-through" : "text-gray-800"
                    }`}
                    title={file.filename}
                  >
                    {file.filename}
                  </p>
                </div>
                {file.indexed && (
                  <span className="text-[9px] sm:text-[10px] rounded-full px-2 py-0.5 bg-green-50 text-green-700 border border-green-200">
                    indexed
                  </span>
                )}
              </motion.li>
            );
          })
        ) : (
          <li className="rounded-lg border border-dashed border-gray-200 bg-white text-gray-500 px-3 py-6 text-center text-xs">
            Tidak ada file.
          </li>
        )}
      </motion.ul>

      {/* Pagination */}
      <div className="mt-3">
        <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
      </div>

      {/* Action Buttons */}
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs sm:text-sm">
        <button
          disabled={!selectedForIndexing.size}
          onClick={() => setChoicePopupOpen(true)}
          className="px-2.5 py-1.5 rounded-lg bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition disabled:opacity-50"
        >
          🚀 Index
        </button>
        <button
          disabled={!selectedForIndexing.size}
          onClick={() =>
            openConfirmPopup("Yakin ingin menghapus file terpilih?", async () => {
              await handleDelete();
              closeConfirmPopup();
            })
          }
          className="px-2.5 py-1.5 rounded-lg bg-rose-600 text-white font-medium shadow hover:bg-rose-700 transition disabled:opacity-50"
        >
          🗑️ Delete
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
    </motion.div>
  );
};

export default ServerFilesPanel;
