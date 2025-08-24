import React, { useState, type DragEvent } from "react";
import { motion } from "framer-motion";

type Props = {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  selectedFiles: File[];
  handleAddFiles: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveFile: (idx: number) => void;
  handleUpload: () => void;
};

const UploadPanel: React.FC<Props> = ({
  fileInputRef,
  selectedFiles,
  handleAddFiles,
  handleFileChange,
  handleRemoveFile,
  handleUpload,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const fakeEvent = {
        target: { files: e.dataTransfer.files },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(fakeEvent);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="w-full flex flex-col rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-4 sm:p-6 shadow-md"
    >
      <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
        📤 Upload File (max 10)
      </h2>

      {/* Input Hidden */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".xlsx,.xls,.csv,.pdf,.json"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Drag & Drop / Picker Section */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`mb-4 flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all cursor-pointer
          ${isDragging ? "border-indigo-500 bg-indigo-50" : "border-gray-300 bg-white hover:border-indigo-400"}`}
        onClick={handleAddFiles}
      >
        <div className="py-10 px-4 text-center">
          <p className="text-sm text-gray-600">
            {isDragging
              ? "Lepaskan file di sini 📂"
              : "Tarik file ke sini atau klik untuk memilih"}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Format: .xlsx .xls .csv .pdf .json
          </p>
        </div>
      </div>

      {/* Selected files */}
      {selectedFiles.length > 0 && (
        <ul className="mb-4 space-y-2 max-h-[34vh] overflow-y-auto rounded-xl border border-gray-200 bg-white p-2">
          {selectedFiles.map((file, idx) => (
            <motion.li
              key={`${file.name}-${file.size}-${idx}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 hover:bg-gray-50 transition"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-800">
                  {file.name}
                </p>
                <p className="text-[11px] text-gray-500">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                onClick={() => handleRemoveFile(idx)}
                className="text-rose-600 text-xs font-medium hover:underline"
              >
                Hapus
              </button>
            </motion.li>
          ))}
        </ul>
      )}

      {/* Upload Button */}
      <div className="mt-auto">
        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
          onClick={handleUpload}
          className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
                     text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition"
        >
          🚀 Upload File
        </motion.button>
      </div>
    </motion.div>
  );
};

export default UploadPanel;
