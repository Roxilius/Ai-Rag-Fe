// components/contacts/EditContactPopup.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiUser, FiPhone } from "react-icons/fi";
import type { Contact } from "../../types/types";
import { useContactsHandler } from "../../hooks/useContactsHandler";
import toast from "react-hot-toast";

type Props = {
  contact: Contact;
  onClose: () => void;
  onSave: (updated: Contact) => void;
};

const EditContactPopup: React.FC<Props> = ({ contact, onClose, onSave }) => {
  const { formatNumberEdit, formatNumberInput, validatePhoneNumber } = useContactsHandler(true);
  const [name, setName] = useState(contact.name);
  const [number, setNumber] = useState(formatNumberEdit(contact.number));
  const [status, setStatus] = useState(contact.status || "active");

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (!value.startsWith("+62")) value = "+62 ";
    const digits = value.slice(4).replace(/\D/g, "");
    if (digits.length === 1 && digits[0] !== "8") return;
    setNumber(formatNumberInput(digits));
  };

  const handleSave = () => {
    if (!name.trim()) return toast.error("Nama tidak boleh kosong.");
    if (!validatePhoneNumber(number)) return toast.error("Nomor telepon tidak valid.");
    onSave({
      ...contact,
      name: name.trim(),
      number,
      status,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 px-3 sm:px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-4 sm:p-6"
      >
        {/* Header */}
        <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          ✏️ Edit Kontak
        </h2>

        {/* Form */}
        <div className="space-y-4">
          {/* Nama */}
          <div className="relative">
            <FiUser className="absolute top-3.5 left-3 text-gray-400" size={18} />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama"
              className="w-full p-3 pl-10 text-sm sm:text-base border border-gray-200 rounded-xl 
                         focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
            />
          </div>

          {/* Nomor */}
          <div className="relative">
            <FiPhone className="absolute top-3.5 left-3 text-gray-400" size={18} />
            <input
              type="text"
              value={number}
              onChange={handleNumberChange}
              placeholder="+62 8xx-xxxx-xxxx"
              className="w-full p-3 pl-10 text-sm sm:text-base border border-gray-200 rounded-xl 
                         focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-gray-600 text-sm mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-3 text-sm sm:text-base border border-gray-200 rounded-xl 
                         focus:ring-2 focus:ring-purple-100 focus:border-purple-300"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm sm:text-base rounded-xl bg-gray-200 hover:bg-gray-300 transition"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm sm:text-base rounded-xl 
                       bg-gradient-to-r from-blue-500 to-purple-500 text-white 
                       hover:opacity-90 transition"
          >
            Simpan
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default EditContactPopup;
