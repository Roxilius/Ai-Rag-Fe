import { useState, useCallback } from "react";
import { useUsersHandler } from "../hooks/useUsersHandler";
import UsersPanel from "../components/users/UsersPanel";
import Pagination from "../components/Pagination";
import { motion } from "framer-motion";
import type { User } from "../types/types";
import ConfirmPopup from "../components/popup/ConfirmPopup";
import EditUserPopup from "../components/users/EditUserPopup";

const UsersHandlerPage: React.FC = () => {
  const [editUser, setEditUser] = useState<User | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    serverUsers,
    currentPage,
    totalPages,
    setCurrentPage,
    handleDeleteUser,
    handleUpdateUser,
  } = useUsersHandler(true);

  const [confirmPopup, setConfirmPopup] = useState({
    isOpen: false,
    message: "",
    onConfirm: () => {},
  });

  const handleEditClick = (user: User) => {
    setEditUser(user);
    setIsEditOpen(true);
  };

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

  const filteredUsers =
    serverUsers?.data.filter(
      (u) =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.role.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full w-full bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-2 sm:p-4 flex justify-center items-start"
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
              className="text-3xl sm:text-4xl font-extrabold mb-3 text-gray-900 tracking-wide drop-shadow-sm"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              👥 Users Management
            </motion.h1>
            <p className="text-gray-500 text-xs sm:text-sm">
              Kelola user server dengan mudah.
            </p>
          </div>
        </div>

        {/* Search bar */}
        <div className="mb-5">
          <input
            type="text"
            placeholder="🔍 Cari berdasarkan nama, email, atau role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-800 bg-white text-sm sm:text-base"
          />
        </div>

        {/* Panel + Pagination */}
        <div className="w-full">
          <UsersPanel
            users={filteredUsers}
            onDelete={(id) =>
              openConfirmPopup("Yakin ingin menghapus user ini?", () =>
                handleDeleteUser(id)
              )
            }
            onEdit={handleEditClick}
          />

          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>
      </motion.div>

      {/* Popups */}
      <EditUserPopup
        isOpen={isEditOpen}
        user={editUser}
        onClose={() => setIsEditOpen(false)}
        onSave={(userId, roleId) => {
          handleUpdateUser(userId, roleId);
          setIsEditOpen(false);
          setEditUser(null);
        }}
      />

      <ConfirmPopup
        isOpen={confirmPopup.isOpen}
        message={confirmPopup.message}
        onConfirm={confirmPopup.onConfirm}
        onCancel={closeConfirmPopup}
      />
    </motion.div>
  );
};

export default UsersHandlerPage;
