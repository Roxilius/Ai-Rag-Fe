import React from "react";
import { motion } from "framer-motion";
import type { Role } from "../../types/types";
import Pagination from "../Pagination";

type Props = {
  roles: Role[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  onEdit: (role: { id: string; name: string; status: string }) => void;
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

const ServerRolesPanel: React.FC<Props> = ({
  roles,
  isLoading,
  currentPage,
  totalPages,
  setCurrentPage,
  onEdit,
}) => {
  const hasData = roles?.length > 0;

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
        <h2 className="text-base sm:text-lg font-semibold text-gray-800">🛡️ Roles</h2>
        {isLoading && (
          <span className="text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full 
                       bg-blue-50 text-blue-600 border border-blue-100">
            Loading...
          </span>
        )}
      </div>

      {/* Table Header (desktop) */}
      <div className="hidden lg:grid grid-cols-4 gap-2 font-semibold text-gray-600 
                  px-4 py-2 border-b bg-gray-50 rounded-xl text-sm text-center">
        <div>Role Name</div>
        <div>Status</div>
        <div>Updated At</div>
        <div>Action</div>
      </div>

      {/* List */}
      <motion.ul
        className="flex-1 space-y-2 sm:space-y-3 mt-2"
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        {hasData ? (
          roles.map((role) => (
            <motion.li
              key={role.id}
              variants={itemVariants}
              className="p-3 sm:p-4 bg-white border border-gray-100 rounded-2xl 
                     shadow hover:shadow-lg transition text-xs sm:text-sm"
            >
              {/* Mobile Card */}
              <div className="flex flex-col gap-2 lg:hidden">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-gray-800 text-sm sm:text-base">{role.name}</p>
                  <button
                    onClick={() =>
                      onEdit({
                        id: role.id,
                        name: role.name,
                        status: role.status,
                      })
                    }
                    className="p-2 rounded-lg bg-blue-500 text-white hover:opacity-90 transition text-xs"
                  >
                    Edit
                  </button>
                </div>
                <div className="flex items-center justify-between text-[11px] sm:text-sm">
                  <span
                    className={
                      role.status === "active" ? "text-green-600" : "text-red-600"
                    }
                  >
                    {role.status}
                  </span>
                  <span className="text-gray-400">
                    {role.updatedAt ? new Date(role.updatedAt).toLocaleString() : "-"}
                  </span>
                </div>
              </div>

              {/* Desktop Row */}
              <div className="hidden lg:grid grid-cols-4 gap-2 items-center text-center">
                <div className="font-medium text-gray-800">{role.name}</div>
                <div
                  className={
                    role.status === "active"
                      ? "text-green-600 font-medium"
                      : "text-red-600 font-medium"
                  }
                >
                  {role.status}
                </div>
                <div className="text-gray-400 text-sm">
                  {role.updatedAt ? new Date(role.updatedAt).toLocaleString() : "-"}
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={() =>
                      onEdit({
                        id: role.id,
                        name: role.name,
                        status: role.status,
                      })
                    }
                    className="px-3 py-1 rounded-lg bg-blue-500 text-white hover:opacity-90 transition"
                  >
                    Edit
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
            Tidak ada role.
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
    </motion.div>
  );
};

export default ServerRolesPanel;
