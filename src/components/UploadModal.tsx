import React from "react";
import { useUploadModal } from "../hooks/useUploadModal";

type UploadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[]) => void;
  onIndexing: (fileIds: string[]) => Promise<void> | void;
  onDelete: (fileIds: string[]) => void;
};

const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  onIndexing,
  onDelete,
}) => {
  const {
    serverFiles,
    currentPage,
    totalPages,
    setCurrentPage,
    isLoadingServerFiles,
    fileInputRef,
    selectedFiles,
    selectedForIndexing,
    handleAddFiles,
    handleFileChange,
    handleUpload,
    handleCancel,
    handleRemoveFile,
    toggleFileSelection,
    handleIndexing,
    handleDelete,
    handleClearIndexing,
  } = useUploadModal({ isOpen, onUpload, onIndexing, onDelete });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-2">
      <div className="bg-white w-full max-w-5xl rounded-xl shadow-xl p-4 sm:p-6 flex flex-col md:flex-row gap-6 max-h-[90vh] overflow-y-auto">
        {/* LEFT: Server Files */}
        <div className="md:w-1/2 w-full border-b md:border-b-0 md:border-r pb-4 md:pr-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">File dari Server</h2>
            <div className="text-sm text-gray-500">{isLoadingServerFiles ? "Loading..." : ""}</div>
          </div>

          <ul className="max-h-[50vh] overflow-y-auto space-y-1 pr-2">
            {serverFiles?.data?.length ? (
              serverFiles.data.map((file) => (
                <li key={String(file.id)} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedForIndexing.has(String(file.id))}
                    onChange={() => toggleFileSelection(String(file.id))}
                    disabled={Boolean(file.indexed)}
                    aria-label={`select-${file.filename}`}
                  />
                  <span className={file.indexed ? "text-gray-400 line-through" : ""}>
                    {file.filename}
                  </span>
                  {file.indexed && <span className="text-xs text-green-600 ml-1">(indexed)</span>}
                  {file.indexed && <span className="text-xs text-gray-600 ml-2">• {file.indexed}</span>}
                </li>
              ))
            ) : (
              <li className="text-gray-500 text-sm">Tidak ada file.</li>
            )}
          </ul>

          {/* Pagination */}
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
              disabled={!selectedForIndexing.size}
              onClick={handleIndexing}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              Indexing
            </button>
            <button
              disabled={!selectedForIndexing.size}
              onClick={() => {
                if (!confirm("Yakin ingin menghapus file terpilih?")) return;
                handleDelete();
              }}
              className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
            >
              Delete
            </button>
            <button
              onClick={() => {
                if (!confirm("Clear semua indexing di server?")) return;
                handleClearIndexing();
              }}
              className="px-4 py-2 bg-[#ED1C24] text-white rounded"
            >
              Clear Indexing
            </button>
          </div>
        </div>

        {/* RIGHT: Upload */}
        <div className="md:w-1/2 w-full md:pl-4">
          <h2 className="text-lg font-semibold mb-4">Upload File (max 10)</h2>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".xlsx,.xls,.csv,.pdf,.json"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="mb-4">
            <button
              onClick={handleAddFiles}
              className="px-4 py-2 mb-2 bg-red-600 text-white rounded"
            >
              Tambah File
            </button>
            <div className="text-xs text-gray-500">Format: .xlsx .xls .csv .pdf .json</div>
          </div>

          {selectedFiles.length > 0 && (
            <ul className="mb-4 space-y-1 text-sm">
              {selectedFiles.map((file, idx) => (
                <li key={`${file.name}-${file.size}`} className="flex justify-between items-center">
                  <span className="truncate max-w-[80%]">{file.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</span>
                    <button
                      onClick={() => handleRemoveFile(idx)}
                      className="text-red-500 text-xs hover:underline"
                    >
                      Hapus
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="flex gap-2 flex-col sm:flex-row justify-end">
            <button
              onClick={() => {
                handleCancel();
                onClose();
              }}
              className="px-4 py-2 border rounded text-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                handleUpload();
                onClose();
              }}
              className="px-4 py-2 bg-red-600 text-white rounded"
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
