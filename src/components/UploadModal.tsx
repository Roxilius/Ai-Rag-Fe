import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import type { FileType } from "../utils/types";
import { deleteIndexing } from "../api/api";


type UploadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[]) => void;
  onIndexing: (fileIds: string[]) => void;
  onDelete: (fileIds: string[]) => void;
  serverFiles: FileType[];
};

const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  onIndexing,
  onDelete,
  serverFiles,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedForIndexing, setSelectedForIndexing] = useState<Set<string>>(
    new Set()
  );

  const allowedExtensions = [".xlsx", ".xls", ".csv", ".pdf", ".json"];

  const isFileAllowed = (fileName: string) => {
    const lower = fileName.toLowerCase();
    return allowedExtensions.some((ext) => lower.endsWith(ext));
  };

  const handleAddFiles = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);

    const validNewFiles = newFiles.filter((file) => {
      if (!isFileAllowed(file.name)) {
        toast.error(`File "${file.name}" tidak diperbolehkan.`);
        return false;
      }
      return true;
    });

    const uniqueNewFiles = validNewFiles.filter((newFile) => {
      return !selectedFiles.some(
        (existingFile) =>
          existingFile.name === newFile.name &&
          existingFile.size === newFile.size
      );
    });

    const combinedFiles = [...selectedFiles, ...uniqueNewFiles];

    if (combinedFiles.length > 10) {
      toast.error("Maksimal hanya boleh upload 10 file!");
      return;
    }

    setSelectedFiles(combinedFiles);
    fileInputRef.current!.value = "";
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      toast.error("Silakan pilih minimal 1 file.");
      return;
    }

    onUpload(selectedFiles);
    setSelectedFiles([]);
    fileInputRef.current!.value = "";
    onClose();
  };

  const handleCancel = () => {
    setSelectedFiles([]);
    setSelectedForIndexing(new Set());
    fileInputRef.current!.value = "";
    onClose();
  };

  const handleRemoveFile = (index: number) => {
    const updated = [...selectedFiles];
    updated.splice(index, 1);
    setSelectedFiles(updated);
  };

  const toggleFileSelection = (id: string) => {
    const file = serverFiles.find((f) => f.id === id);
    if (!file || file.indexed) return;

    const newSet = new Set(selectedForIndexing);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedForIndexing(newSet);
  };

  const handleIndexing = () => {
    if (selectedForIndexing.size === 0) return;
    onIndexing(Array.from(selectedForIndexing));
    setSelectedForIndexing(new Set());
  };

  const handleDelete = () => {
    if (selectedForIndexing.size === 0) return;
    onDelete(Array.from(selectedForIndexing));
    setSelectedForIndexing(new Set());
  };

  if (!isOpen) return null;

  const handleClearIndexing = () => {
    deleteIndexing();
  };

  return (
    <div className="fixed inset-0  bg-opacity-60 flex items-center justify-center z-50 font-sans">
      <div className="bg-white w-full max-w-5xl rounded-xl shadow-xl border border-gray-300 p-6 relative flex gap-6">
        {/* KIRI: FILE DARI SERVER */}
        <div className="w-1/2 border-r pr-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">File dari Server</h2>
          {serverFiles.map((file) => (
            <li key={file.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedForIndexing.has(file.id)}
                onChange={() => toggleFileSelection(file.id)}
                disabled={file.indexed}
              />
              <span className={file.indexed ? "text-gray-400 line-through" : ""}>
                {file.filename}
              </span>
              {file.indexed && (
                <span className="text-xs text-green-600 ml-2">(indexed)</span>
              )}
            </li>
          ))}

          <div className="mt-4 flex gap-3">
            <button
              disabled={selectedForIndexing.size === 0}
              onClick={handleIndexing}
              className={`px-4 py-2 rounded bg-blue-600 text-white text-sm transition ${selectedForIndexing.size === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700"
                }`}
            >
              Indexing
            </button>

            <button
              disabled={selectedForIndexing.size === 0}
              onClick={handleDelete}
              className={`px-4 py-2 rounded bg-red-600 text-white text-sm transition ${selectedForIndexing.size === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-red-700"
                }`}
            >
              Delete
            </button>

            <button
              onClick={() => handleClearIndexing()}
              className="w-full bg-[#ED1C24] hover:bg-red-700 text-white text-sm py-2 rounded-md"
            >
              Clear Indexing Files
            </button>
          </div>
        </div>

        {/* KANAN: UPLOAD FILE */}
        <div className="w-1/2 pl-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Upload File (max 10)
          </h2>

          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept=".xlsx,.xls,.csv,.pdf,.json"
            className="hidden"
            onChange={handleFileChange}
          />

          <button
            onClick={handleAddFiles}
            className="px-4 py-2 mb-4 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition"
          >
            Tambah File
          </button>

          {selectedFiles.length > 0 && (
            <ul className="mb-4 text-sm text-gray-800 list-disc pl-5 space-y-1">
              {selectedFiles.map((file, index) => (
                <li
                  key={`${file.name}-${file.size}`}
                  className="flex justify-between items-center"
                >
                  {file.name}
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="text-red-500 text-xs hover:underline ml-2"
                  >
                    Hapus
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="flex justify-end space-x-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 rounded-md text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              className="px-4 py-2 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition"
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
