// ContactHandlerPage.tsx
import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useContactsHandler } from "../hooks/useContactsHandler";
import ConfirmPopup from "../components/popup/ConfirmPopup";
import AddContactPopup from "../components/contacts/AddContactPopup";
import ServerContactsPanel from "../components/contacts/ServerContactsPanel";

const ContactHandlerPage: React.FC = () => {
  const {
    serverContacts,
    currentPage,
    totalPages,
    setCurrentPage,
    isLoadingServerContacts,
    handleAddContact,
    handleEditContact,
    handleDelete,
  } = useContactsHandler();

  const [confirmPopup, setConfirmPopup] = useState<{
    isOpen: boolean;
    message?: string;
    onConfirm?: () => void;
  }>({ isOpen: false });

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);

  const openConfirmPopup = useCallback((message: string, onConfirm: () => void) => {
    setConfirmPopup({
      isOpen: true,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmPopup((prev) => ({ ...prev, isOpen: false }));
      },
    });
  }, []);

  const closeConfirmPopup = useCallback(() => {
    setConfirmPopup((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const closeAddPopup = () =>{
    setIsAddPopupOpen(false);
  }

  const filteredContacts =
    serverContacts?.data?.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

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
        {/* Header */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <motion.h1
              className="text-3xl sm:text-4xl font-extrabold mb-6 text-gray-900 tracking-wide drop-shadow-sm"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              👥 Contacts Management
            </motion.h1>
            <p className="text-gray-500 text-xs sm:text-sm">
              Kelola kontak server dengan mudah.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddPopupOpen(true)}
              className="px-3 py-2 text-sm rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow hover:opacity-90"
            >
              ➕ Tambah Kontak
            </button>
          </div>
        </div>

        {/* Main content */}
        <ServerContactsPanel
          serverContacts={{
            data: filteredContacts,
            pagination:
              serverContacts?.pagination || {
                currentPage: 1,
                totalItems: filteredContacts.length,
                totalPages: 1,
                pageSize: 10,
              },
          }}
          isLoading={isLoadingServerContacts}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleEditContact={handleEditContact}
          handleDelete={handleDelete}
          openConfirmPopup={openConfirmPopup}
        />
      </motion.div>

      {/* Add Contact Popup */}
      <AnimatePresence>
        {isAddPopupOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-md mx-3"
            >
              <AddContactPopup handleAddContact={handleAddContact} close={closeAddPopup}/>
              <button
                onClick={() => setIsAddPopupOpen(false)}
                className="mt-3 w-full py-2 text-sm rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                ✖ Tutup
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Popup */}
      <ConfirmPopup
        isOpen={confirmPopup.isOpen}
        message={confirmPopup.message || ""}
        onConfirm={confirmPopup.onConfirm || (() => {})}
        onCancel={closeConfirmPopup}
      />
    </motion.div>
  );
};

export default ContactHandlerPage;
