// AddContactPopup.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiUser, FiPhone } from "react-icons/fi";
import type { Contact } from "../../types/types";
import toast from "react-hot-toast";
import { formatNumberInput, validatePhoneNumber } from "../../utils/ContatcsHelper";

type Props = { 
  handleAddContact: (contact: Contact) => void
  close: ()=> void;
};

const AddContactPopup: React.FC<Props> = ({ handleAddContact, close }) => {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("+62 ");

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (!value.startsWith("+62")) value = "+62 ";
    const digits = value.slice(4).replace(/\D/g, "");
    if (digits.length === 1 && digits[0] !== "8") return;
    setNumber(formatNumberInput(digits));
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    let pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (pasted.startsWith("0")) pasted = pasted.slice(1);
    setNumber(formatNumberInput(pasted));
  };

  const onSubmit = () => {
    if (!name || number === "+62 ") {
      toast.error("Nama dan nomor harus diisi.");
      return;
    }
    if (!validatePhoneNumber(number)) {
      toast.error("Nomor harus valid, format: +62 XXX-XXXX-XXXX.");
      return;
    }

    handleAddContact({
      id: "",
      name: name.trim(),
      number,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    setName("");
    setNumber("+62 ");
    toast.success("Kontak berhasil ditambahkan!");
  };

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full flex flex-col gap-3 sm:gap-4 p-4 sm:p-5 bg-white 
             border border-gray-200 rounded-2xl shadow-lg"
    >
      <h2 className="text-lg font-bold text-gray-800 mb-2">➕ Tambah Kontak</h2>

      {/* Input Nama */}
      <div className="relative">
        <FiUser className="absolute top-3 left-3 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Nama"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 pl-10 text-sm border border-gray-200 
                 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
        />
      </div>

      {/* Input Nomor */}
      <div className="relative">
        <FiPhone className="absolute top-3 left-3 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="+62 812-3456-7890"
          value={number}
          onChange={handleNumberChange}
          onPaste={handlePaste}
          className="w-full p-3 pl-10 text-sm border border-gray-200 
                 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
        />
      </div>

      {/* Tombol Simpan */}
      <motion.button
        onClick={ () => {
          onSubmit();
          close();
        }}
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.02 }}
        className="w-full py-2.5 text-sm bg-gradient-to-r from-blue-500 via-purple-500 
               to-pink-500 text-white font-semibold rounded-xl shadow hover:shadow-md transition"
      >
        💾 Simpan
      </motion.button>
    </motion.div>
  );
};

export default AddContactPopup;
