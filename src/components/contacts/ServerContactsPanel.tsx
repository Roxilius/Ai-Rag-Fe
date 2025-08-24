import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import type { ContactServer, Contact } from "../../types/types";
import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
import EditContactPopup from "./EditContactPopup";
import { useContactsHandler } from "../../hooks/useContactsHandler";
import Pagination from "../Pagination";

type Props = {
  serverContacts: ContactServer;
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  handleEditContact: (updated: Contact) => void;
  handleDelete: (id: string) => void;
  openConfirmPopup: (message: string, onConfirm: () => void) => void;
};

const listVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

// ... import sama
const ServerContactsPanel: React.FC<Props> = ({
  serverContacts,
  isLoading,
  currentPage,
  totalPages,
  setCurrentPage,
  searchQuery,
  setSearchQuery,
  handleEditContact,
  handleDelete,
  openConfirmPopup,
}) => {
  const [editPopup, setEditPopup] = useState<{ isOpen: boolean; contact: Contact | null }>({
    isOpen: false,
    contact: null,
  });

  const { formatNumberInput } = useContactsHandler(true);

  const openEditPopup = (contact: Contact) => setEditPopup({ isOpen: true, contact });
  const closeEditPopup = () => setEditPopup({ isOpen: false, contact: null });

  const hasData = useMemo(() => serverContacts?.data?.length > 0, [serverContacts]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full lg:flex-1 flex flex-col bg-gradient-to-br from-white to-purple-50 
             border border-purple-100 rounded-2xl shadow-md p-3 sm:p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800">📇 Contacts</h2>
        {isLoading && (
          <span className="text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full 
                       bg-blue-50 text-blue-600 border border-blue-100">
            Loading...
          </span>
        )}
      </div>

      {/* Search */}
      <div className="mb-3 sm:mb-4 relative">
        <FiSearch className="absolute top-2.5 left-3 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Cari kontak..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2.5 sm:p-3 pl-9 sm:pl-10 text-xs sm:text-sm border border-gray-200 
                 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 
                 focus:border-purple-300 transition"
        />
      </div>

      {/* Table Header (desktop) */}
      <div className="hidden lg:grid grid-cols-5 gap-2 font-semibold text-gray-600 
                  px-4 py-2 border-b bg-gray-50 rounded-xl text-sm text-center">
        <div>Nama</div>
        <div>Phone</div>
        <div>Status</div>
        <div>Updated At</div>
        <div className="text-center">Action</div>
      </div>

      {/* List */}
      <motion.ul
        className="flex-1 space-y-2 sm:space-y-3 mt-2"
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        {hasData ? (
          serverContacts.data.map((contact) => (
            <motion.li
              key={String(contact.id)}
              variants={itemVariants}
              className="p-3 sm:p-4 bg-white border border-gray-100 rounded-2xl 
                     shadow hover:shadow-lg transition text-xs sm:text-sm"
            >
              {/* Mobile Card */}
              <div className="flex flex-col gap-2 lg:hidden">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-gray-800 text-sm sm:text-base">{contact.name}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditPopup(contact)}
                      className="p-2 rounded-lg bg-blue-500 text-white hover:opacity-90 transition text-xs"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() =>
                        openConfirmPopup("Yakin ingin menghapus kontak ini?", () =>
                          handleDelete(String(contact.id))
                        )
                      }
                      className="p-2 rounded-lg bg-rose-500 text-white hover:opacity-90 transition text-xs"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
                <p className="text-gray-700">{formatNumberInput(contact.number.slice(3))}</p>
                <div className="flex items-center justify-between text-[11px] sm:text-sm">
                  <span
                    className={contact.status === "active" ? "text-green-600" : "text-red-600"}
                  >
                    {contact.status || "-"}
                  </span>
                  <span className="text-gray-400">
                    {contact.updatedAt ? new Date(contact.updatedAt).toLocaleString() : "-"}
                  </span>
                </div>
              </div>

              {/* Desktop Row */}
              <div className="hidden lg:grid grid-cols-5 gap-2 items-center justify-center text-center">
                <div className="font-medium text-gray-800">{contact.name}</div>
                <div className="text-gray-700">{formatNumberInput(contact.number.slice(3))}</div>
                <div
                  className={
                    contact.status === "active"
                      ? "text-green-600 font-medium"
                      : "text-red-600 font-medium"
                  }
                >
                  {contact.status || "-"}
                </div>
                <div className="text-gray-400 text-sm">
                  {contact.updatedAt ? new Date(contact.updatedAt).toLocaleString() : "-"}
                </div>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => openEditPopup(contact)}
                    className="px-3 py-1 rounded-lg bg-blue-500 text-white hover:opacity-90 transition"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() =>
                      openConfirmPopup("Yakin ingin menghapus kontak ini?", () =>
                        handleDelete(String(contact.id))
                      )
                    }
                    className="px-3 py-1 rounded-lg bg-rose-500 text-white hover:opacity-90 transition"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </motion.li>
          ))
        ) : (
          <motion.li
            variants={itemVariants}
            className="text-gray-500 text-center py-6 sm:py-10 bg-white border border-gray-100 rounded-2xl text-xs sm:text-sm"
          >
            Tidak ada kontak.
          </motion.li>
        )}
      </motion.ul>

      {/* Pagination */}
      <div className="mt-3 sm:mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>

      {/* Edit Popup */}
      {editPopup.isOpen && editPopup.contact && (
        <EditContactPopup
          contact={editPopup.contact}
          onClose={closeEditPopup}
          onSave={(updated: Contact) => {
            handleEditContact(updated);
            closeEditPopup();
          }}
        />
      )}
    </motion.div>

  );
};

export default ServerContactsPanel;
