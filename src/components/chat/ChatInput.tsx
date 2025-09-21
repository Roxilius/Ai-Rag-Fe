import { ImageIcon, Send, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ChatInputProps = {
  onSend: (message: string, images?: string[]) => void;
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      resolve(base64);
    };

    reader.onerror = () => {
      reject(new Error(`Gagal membaca file: ${file.name}`));
    };
  });
};

const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const [text, setText] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (text.trim() === "" && images.length === 0) return;
    onSend(text.trim(), images);
    setText("");
    setImages([]);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const converted = await Promise.all(files.map((f) => fileToBase64(f)));
    setImages((prev) => [...prev, ...converted]);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [text]);

  return (
    <>
      <div className="flex flex-col gap-3 px-3 py-3 sm:px-5 bg-white rounded-2xl border border-gray-200 shadow-lg">
        {/* Preview sebelum kirim */}
        {images.length > 0 && (
          <div className="flex flex-wrap gap-3 px-1 sm:px-2">
            {images.map((src, idx) => (
              <div key={src} className="relative group">
                <button
                  type="button"
                  onClick={() => setPreviewImage(src)}
                  className="p-0 border-0 bg-transparent cursor-pointer"
                  aria-label={`Lihat pratinjau gambar ${idx + 1}`}
                >
                  <img
                    src={`data:image/png;base64,${src}`}
                    alt={`preview-${idx}`}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border shadow-sm transition-transform hover:scale-105"
                  />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute -top-2 -right-2 bg-[#ED1C24] text-white rounded-full p-1 shadow hover:bg-red-700"
                  aria-label={`Hapus gambar ${idx + 1}`}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input dan tombol */}
        <div className="flex items-end gap-3">
          <textarea
            ref={textareaRef}
            rows={1}
            className="text-base flex-1 resize-none overflow-hidden px-4 py-2 border border-gray-300 text-black rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ED1C24] max-h-40 leading-relaxed scrollbar-thin scrollbar-thumb-gray-300"
            placeholder="Tulis pesan..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />

          {/* Upload Image */}
          <label className="cursor-pointer p-2 rounded-xl hover:bg-gray-100 transition">
            <ImageIcon size={22} className="text-gray-600" />
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          {/* Send Button */}
          <button
            type="button"
            className="flex items-center justify-center p-3 sm:p-3.5 bg-[#ED1C24] text-white rounded-xl shadow-md hover:bg-red-600 active:scale-95 transition-all duration-200"
            onClick={handleSend}
            aria-label="Kirim"
          >
            <Send size={20} className="sm:size-5" />
          </button>
        </div>
      </div>

      {/* Popup Images */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewImage(null)}
            aria-modal="true"
          >
            <motion.img
              src={`data:image/png;base64,${previewImage}`}
              alt="preview-full"
              className="max-w-full max-h-full rounded-lg shadow-lg"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            />
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 bg-black/60 text-white rounded-full p-2"
              aria-label="Tutup pratinjau"
            >
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatInput;