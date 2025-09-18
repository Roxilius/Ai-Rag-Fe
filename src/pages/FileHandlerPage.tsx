import React, { useCallback, useState } from "react";
import { useFileHandler } from "../hooks/useFileHandler";
import ConfirmPopup from "../components/popup/ConfirmPopup";
import ChoicePopup from "../components/popup/ChoicePopup";
import { motion } from "framer-motion";
import ServerFilesPanel from "../components/files/ServerFilesPanel";
import UploadPanel from "../components/files/UploadPanel";

const FilehandlerPage: React.FC = () => {
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
    handleRemoveFile,
    toggleFileSelection,
    handleIndexing,
    handleDelete,
    handleClearIndexing,
  } = useFileHandler(true);

  const [confirmPopup, setConfirmPopup] = useState<{
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, message: "", onConfirm: () => {} });

  const [choicePopupOpen, setChoicePopupOpen] = useState(false);

  const openConfirmPopup = useCallback((message: string, onConfirm: () => void) => {
    setConfirmPopup({ isOpen: true, message, onConfirm });
  }, []);

  const closeConfirmPopup = useCallback(() => {
    setConfirmPopup((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-2 sm:p-4 flex justify-center items-start"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="max-w-6xl w-full mx-auto bg-white rounded-2xl shadow-lg p-3 sm:p-5 lg:p-6 ring-1 ring-gray-100"
      >
        {/* Header kecil */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <motion.h1
                className="text-3xl sm:text-4xl font-extrabold mb-6 text-gray-900 tracking-wide drop-shadow-sm"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                📂 Files Management
            </motion.h1>
            <p className="text-gray-500 text-xs sm:text-sm">
              Kelola file server & upload dengan mudah.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* RIGHT: Upload */}
          <UploadPanel
            fileInputRef={fileInputRef}
            selectedFiles={selectedFiles}
            handleAddFiles={handleAddFiles}
            handleFileChange={handleFileChange}
            handleRemoveFile={handleRemoveFile}
            handleUpload={handleUpload}
          />

          {/* LEFT: Server Files */}
          <ServerFilesPanel
            serverFiles={serverFiles}
            isLoading={isLoadingServerFiles}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            selectedForIndexing={selectedForIndexing}
            toggleFileSelection={toggleFileSelection}
            openConfirmPopup={openConfirmPopup}
            handleDelete={handleDelete}
            handleClearIndexing={handleClearIndexing}
            setChoicePopupOpen={setChoicePopupOpen}
            closeConfirmPopup={closeConfirmPopup}
          />
        </div>
      </motion.div>

      {/* Popups */}
      <ConfirmPopup
        isOpen={confirmPopup.isOpen}
        message={confirmPopup.message}
        onConfirm={confirmPopup.onConfirm}
        onCancel={closeConfirmPopup}
      />

      <ChoicePopup
        isOpen={choicePopupOpen}
        onClose={() => setChoicePopupOpen(false)}
        title="Pilih jenis indexing:"
      >
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <button
            onClick={() => {
              handleIndexing(false);
              setChoicePopupOpen(false);
            }}
            className="flex-1 px-3 py-2 rounded-lg bg-blue-600 text-white text-xs sm:text-sm font-medium shadow hover:bg-blue-700 transition"
          >
            Append Indexing
          </button>
          <button
            onClick={() => {
              handleIndexing(true);
              setChoicePopupOpen(false);
            }}
            className="flex-1 px-3 py-2 rounded-lg bg-red-600 text-white text-xs sm:text-sm font-medium shadow hover:bg-red-700 transition"
          >
            Reset All Indexing
          </button>
        </div>
      </ChoicePopup>
    </motion.div>
  );
};

export default FilehandlerPage;
