// pages/RoleHandlerPage.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRolesHandler } from "../hooks/useRolesHandler";
import AddRoleModal from "../components/roles/AddRoleModal";
import EditRoleModal from "../components/roles/EditRoleModal";
import ServerRolesPanel from "../components/roles/ServerRolesPanel";

const RoleHandlerPage: React.FC = () => {
  const {
    serverRoles,
    currentPage,
    totalPages,
    setCurrentPage,
    filterStatus,
    setFilterStatus,
    isLoadingServerRoles,
    handleUpdateRole,
    fetchRoles,
  } = useRolesHandler(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editRole, setEditRole] = useState<{
    id: string;
    name: string;
    status: string;
  } | null>(null);

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="w-full max-w-6xl bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg ring-1 ring-gray-100 p-6 space-y-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <motion.h2
              className="text-3xl sm:text-4xl font-extrabold mb-6 text-gray-900 tracking-wide drop-shadow-sm"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              🎭 Roles Management
            </motion.h2>
            <p className="text-sm text-gray-500">Kelola semua role di sistem</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow hover:shadow-md"
          >
            + Tambah Role
          </motion.button>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-3">
          {["all", "active", "inactive"].map((status) => (
            <motion.button
              key={status}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterStatus(status as "all" | "active" | "inactive")}
              className={`px-3 py-1 rounded-full text-sm shadow ${filterStatus === status
                ? "bg-indigo-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              {status}
            </motion.button>
          ))}
        </div>

        {/* Panel Roles */}
        <ServerRolesPanel
          roles={serverRoles?.data || []}
          isLoading={isLoadingServerRoles}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          onEdit={(role) => setEditRole(role)}
          onUpdate={handleUpdateRole}
        />
      </motion.div>

      {/* Modals */}
      {isAddModalOpen && (
        <AddRoleModal
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={fetchRoles}
        />
      )}
      {editRole && (
        <EditRoleModal
          role={editRole}
          onClose={() => setEditRole(null)}
          onSuccess={fetchRoles}
        />
      )}
    </motion.div>
  );
};

export default RoleHandlerPage;
