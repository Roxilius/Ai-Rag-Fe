import React from "react";
import { motion } from "framer-motion";
import { Edit3, Trash2 } from "lucide-react";
import type { User } from "../../types/types";

interface UsersPanelProps {
  users: User[];
  onDelete: (id: string) => void;
  onEdit: (user: User) => void;
}

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

const UsersPanel: React.FC<UsersPanelProps> = ({ users, onDelete, onEdit }) => {
  const hasData = users?.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full lg:flex-1 flex flex-col bg-gradient-to-br from-white to-blue-50 
                 border border-blue-100 rounded-2xl shadow-md p-3 sm:p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800">👥 Users</h2>
      </div>

      {/* Table Header (Desktop) */}
      <div className="hidden lg:grid grid-cols-5 gap-2 font-semibold text-gray-600 
                      px-4 py-2 border-b bg-gray-50 rounded-xl text-sm text-center">
        <div>Name</div>
        <div>Email</div>
        <div>Role</div>
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
          users.map((u) => (
            <motion.li
              key={u.userId}
              variants={itemVariants}
              className="p-3 sm:p-4 bg-white border border-gray-100 rounded-2xl 
                         shadow hover:shadow-lg transition text-xs sm:text-sm"
            >
              {/* Mobile Card */}
              <div className="flex flex-col gap-2 lg:hidden">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-gray-800 text-sm sm:text-base">{u.name}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(u)}
                      className="p-2 rounded-lg bg-blue-500 text-white hover:opacity-90 transition text-xs"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(u.userId)}
                      className="p-2 rounded-lg bg-rose-500 text-white hover:opacity-90 transition text-xs"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p className="text-gray-700">{u.email}</p>
                <div className="flex items-center justify-between text-[11px] sm:text-sm">
                  <span className="capitalize text-blue-600">{u.role}</span>
                  <span className="text-gray-400">
                    {u.updatedAt ? new Date(u.updatedAt).toLocaleString() : "-"}
                  </span>
                </div>
              </div>

              {/* Desktop Row */}
              <div className="hidden lg:grid grid-cols-5 gap-2 items-center justify-center text-center">
                <div className="font-medium text-gray-800">{u.name}</div>
                <div className="text-gray-700">{u.email}</div>
                <div className="capitalize text-blue-600 font-medium">{u.role}</div>
                <div className="text-gray-400 text-sm">
                  {u.updatedAt ? new Date(u.updatedAt).toLocaleString() : "-"}
                </div>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => onEdit(u)}
                    className="px-3 py-1 rounded-lg bg-blue-500 text-white hover:opacity-90 transition"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(u.userId)}
                    className="px-3 py-1 rounded-lg bg-rose-500 text-white hover:opacity-90 transition"
                  >
                    <Trash2 size={18} />
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
            Tidak ada user.
          </motion.li>
        )}
      </motion.ul>
    </motion.div>
  );
};

export default UsersPanel;
