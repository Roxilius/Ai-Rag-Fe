import { Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";

type ChatInputProps = {
  onSend: (message: string) => void;
};

const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const [text, setText] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (text.trim() === "") return;
    onSend(text.trim());
    setText("");
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [text]);

  return (
    <div className="flex items-end gap-2 px-3 py-2 sm:px-4 bg-white/90 rounded-xl border border-gray-200 shadow-sm">
      <textarea
        ref={textareaRef}
        rows={1}
        className="text-base flex-1 resize-none overflow-hidden px-3 py-2 border border-gray-300 text-black rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ED1C24] max-h-40 leading-relaxed scrollbar-thin scrollbar-thumb-gray-300"
        style={{ fontSize: "16px" }}
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

      <button
        className="flex items-center justify-center p-2 sm:p-2.5 bg-[#ED1C24] text-white rounded-xl shadow-md hover:bg-red-600 active:scale-95 transition-all duration-200"
        onClick={handleSend}
        aria-label="Kirim"
      >
        <Send size={18} className="sm:size-5" />
      </button>
    </div>
  );
};

export default ChatInput;
