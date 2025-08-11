/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import type { FileServer } from "../utils/types";
import { deleteIndexing, getFiles } from "../api/api";

type UploadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[]) => void;
  onIndexing: (fileIds: string[]) => void;
  onDelete: (fileIds: string[]) => void;
};

const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  onIndexing,
  onDelete,
}) => {
  const [serverFiles, setServerFiles] = useState<FileServer | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedForIndexing, setSelectedForIndexing] = useState<Set<string>>(new Set());

  const allowedExtensions = [".xlsx", ".xls", ".csv", ".pdf", ".json"];

  const isFileAllowed = (fileName: string) =>
    allowedExtensions.some((ext) => fileName.toLowerCase().endsWith(ext));

  const totalPages = serverFiles?.pagination?.totalPages || 1;

  useEffect(() => {
    if (!isOpen) return;

    const getServerFile = async () => {
      try {
        const res = await getFiles(currentPage);
        setServerFiles(res);
      } catch (err) {
        toast.error("Gagal mengambil file dari server");
      }
    };

    getServerFile();
  }, [currentPage, isOpen]);

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

    const uniqueNewFiles = validNewFiles.filter(
      (newFile) =>
        !selectedFiles.some(
          (existingFile) =>
            existingFile.name === newFile.name && existingFile.size === newFile.size
        )
    );

    const combinedFiles = [...selectedFiles, ...uniqueNewFiles];
    if (combinedFiles.length > 10) {
      toast.error("Maksimal hanya boleh upload 10 file!");
      return;
    }

    setSelectedFiles(combinedFiles);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      toast.error("Silakan pilih minimal 1 file.");
      return;
    }
    onUpload(selectedFiles);
    setSelectedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onClose();
  };

  const handleCancel = () => {
    setSelectedFiles([]);
    setSelectedForIndexing(new Set());
    if (fileInputRef.current) fileInputRef.current.value = "";
    onClose();
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleFileSelection = (id: string) => {
    if (!serverFiles) return;
    const file = serverFiles.data?.find((f) => f.id === id);
    if (!file || file.indexed) return;

    setSelectedForIndexing((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleIndexing = async () => {
    if (selectedForIndexing.size === 0) return;

    const idsToIndex = Array.from(selectedForIndexing);

    // Step 1: Ubah status jadi "Indexing..."
    setServerFiles(prev =>
      prev
        ? {
          ...prev,
          data: prev.data?.map(file =>
            idsToIndex.includes(String(file.id))
              ? { ...file, status: "Indexing..." }
              : file
          )
        }
        : prev
    );

    try {
      // Step 2: Tunggu proses indexing
      await onIndexing(idsToIndex);

      // Step 3: Setelah sukses, update indexed = true
      setServerFiles(prev =>
        prev
          ? {
            ...prev,
            data: prev.data?.map(file =>
              idsToIndex.includes(String(file.id))
                ? { ...file, indexed: true, status: undefined }
                : file
            )
          }
          : prev
      );

      // Step 4: Clear pilihan
      setSelectedForIndexing(new Set());

      toast.success("Indexing berhasil!");
    } catch (err) {
      toast.error("Indexing gagal, silakan coba lagi.");
    }
  };


  const handleDelete = () => {
    if (selectedForIndexing.size === 0) return;

    const idsToDelete = Array.from(selectedForIndexing);
    onDelete(idsToDelete);

    setServerFiles(prev =>
      prev
        ? {
          ...prev,
          data: prev.data?.filter(file => !idsToDelete.includes(String(file.id))) || []
        }
        : prev
    );

    setSelectedForIndexing(new Set());
  };

  const handleClearIndexing = async () => {
    await deleteIndexing();
    setServerFiles((prev) =>
      prev
        ? { ...prev, data: prev.data?.map((file) => ({ ...file, indexed: false })) || [] }
        : prev
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 font-sans p-2">
      <div className="bg-white w-full max-w-5xl rounded-xl shadow-xl border border-gray-300 p-4 sm:p-6 relative flex flex-col md:flex-row gap-6 max-h-[90vh] overflow-y-auto">

        {/* Bagian Kiri - File dari Server */}
        <div className="md:w-1/2 w-full border-b md:border-b-0 md:border-r pb-4 md:pb-0 md:pr-4">
          <h2 className="text-base sm:text-lg font-semibold mb-4 text-gray-800">
            File dari Server
          </h2>

          <ul className="max-h-[50vh] overflow-y-auto pr-1 space-y-1">
            {serverFiles?.data?.length ? (
              serverFiles.data.map((file) => (
                <li
                  key={String(file.id)}
                  className="flex items-center gap-2 text-sm break-words"
                >
                  <input
                    type="checkbox"
                    checked={selectedForIndexing.has(String(file.id))}
                    onChange={() => toggleFileSelection(String(file.id))}
                    disabled={file.indexed}
                  />
                  <span className={file.indexed ? "text-gray-400 line-through" : ""}>
                    {file.filename}
                  </span>
                  {file.indexed && (
                    <span className="text-xs text-green-600 ml-1">(indexed)</span>
                  )}
                </li>
              ))
            ) : (
              <li className="text-gray-500 text-sm">Tidak ada file.</li>
            )}
          </ul>

          {totalPages > 1 && (
            <div className="flex justify-center mt-3 gap-2 text-sm">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span className="self-center">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              disabled={selectedForIndexing.size === 0}
              onClick={handleIndexing}
              className={`px-4 py-2 rounded bg-blue-600 text-white text-sm transition flex-1 sm:flex-none ${selectedForIndexing.size === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700"
                }`}
            >
              Indexing
            </button>

            <button
              disabled={selectedForIndexing.size === 0}
              onClick={handleDelete}
              className={`px-4 py-2 rounded bg-red-600 text-white text-sm transition flex-1 sm:flex-none ${selectedForIndexing.size === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-red-700"
                }`}
            >
              Delete
            </button>

            <button
              onClick={handleClearIndexing}
              className="px-4 py-2 rounded bg-[#ED1C24] hover:bg-red-700 text-white text-sm flex-1 sm:flex-none"
            >
              Clear Indexing
            </button>
          </div>
        </div>

        {/* Bagian Kanan - Upload File */}
        <div className="md:w-1/2 w-full md:pl-4">
          <h2 className="text-base sm:text-lg font-semibold mb-4 text-gray-800">
            Upload File (max 10)
          </h2>
          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept={allowedExtensions.join(",")}
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            onClick={handleAddFiles}
            className="px-4 py-2 mb-4 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition w-full sm:w-auto"
          >
            Tambah File
          </button>

          {selectedFiles.length > 0 && (
            <ul className="mb-4 text-sm text-gray-800 space-y-1">
              {selectedFiles.map((file, index) => (
                <li
                  key={`${file.name}-${file.size}`}
                  className="flex justify-between items-center break-words"
                >
                  <span className="truncate max-w-[80%]">{file.name}</span>
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

          <div className="flex flex-col sm:flex-row justify-end gap-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 rounded-md text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-100 transition w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              className="px-4 py-2 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition w-full sm:w-auto"
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
