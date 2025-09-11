import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { User, Role } from "../../types/types";
import { getRoles } from "../../api/api";

interface EditUserPopupProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onSave: (userId: string, roleId: string, chat: string) => void;
}

const EditUserPopup: React.FC<EditUserPopupProps> = ({
  isOpen,
  user,
  onClose,
  onSave,
}) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedStatusChat, setSelectedStatusChat] = useState<string>("");

  useEffect(() => {
    if (!isOpen || !user) return;
    const fetchRoles = async () => {
      try {
        const res = await getRoles(1, "");
        setRoles(res.data || []);
        setSelectedRole(user.roleId || "");
        setSelectedStatusChat(user.chat || "inactive");
      } catch (err) {
        console.error("getRoles error:", err);
      }
    };
    fetchRoles();
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 px-3 sm:px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-200"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-900">
          Edit User Role
        </h2>
        <div className="mb-3">
          <p className="text-gray-700 font-medium">👤 {user.name}</p>
          <p className="text-gray-600 text-sm">{user.email}</p>
        </div>

        <label className="block text-gray-700 mb-2 font-medium">
          Select Role
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
          >
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-gray-700 mb-2 font-medium">
          Select Status
          <select
            value={selectedStatusChat}
            onChange={(e) => setSelectedStatusChat(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
          >
            <option value="inactive">Inactive</option>
            <option value="active">Active</option>
          </select>
        </label>

        <div className="flex justify-end mt-6 gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 transition shadow-sm"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{
              scale: 1.08,
              boxShadow: "0 0 15px rgba(59,130,246,0.4)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (selectedRole) {
                onSave(user.userId, selectedRole, selectedStatusChat);
              }
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:bg-blue-600 text-white font-medium transition"
          >
            Save
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EditUserPopup;
