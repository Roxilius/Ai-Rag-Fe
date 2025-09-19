import React, { useState } from "react";
import { motion } from "framer-motion";
import { addRole } from "../../api/api";

type Props = {
  onClose: () => void;
  onSuccess: () => void;
};

const AddRoleModal: React.FC<Props> = ({ onClose, onSuccess }) => {
  const [name, setName] = useState("");

  const handleSubmit = async () => {
    if (!name.trim()) return;
    await addRole({ name });
    onSuccess();
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <h2 className="text-lg font-bold text-gray-800 mb-4">Tambah Role</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama role..."
          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
        />
        <div className="mt-4 flex justify-end gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Batal
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
          >
            Simpan
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AddRoleModal;
