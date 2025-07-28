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
    <div className="flex items-end gap-2 px-3 py-2 sm:px-4 bg-white border-t border-gray-300 w-full max-w-screen">
      <textarea
        ref={textareaRef}
        rows={1}
        className="text-base flex-1 w-full resize-none overflow-hidden px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED1C24] max-h-40 leading-relaxed"
        style={{ fontSize: "16px" }}
        placeholder="Tanya AI..."
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
        className="flex items-center justify-center p-2 sm:p-2.5 bg-[#ED1C24] text-white rounded-md hover:bg-red-600 transition-colors duration-200"
        onClick={handleSend}
        aria-label="Kirim"
      >
        <Send size={18} className="sm:size-5" />
      </button>
    </div>
  );
};

export default ChatInput;
