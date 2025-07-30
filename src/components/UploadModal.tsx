import React, { useRef, useState } from "react";
import toast from "react-hot-toast"; // ✅ import toast

type UploadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[]) => void;
};

const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

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
    fileInputRef.current!.value = "";
    onClose();
  };

  const handleRemoveFile = (index: number) => {
    const updated = [...selectedFiles];
    updated.splice(index, 1);
    setSelectedFiles(updated);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-60 flex items-center justify-center z-50 font-sans">
      <div className="bg-transparent w-full max-w-lg p-6">
        <div className="bg-white rounded-xl shadow-xl border border-gray-300 p-6 relative">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
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
