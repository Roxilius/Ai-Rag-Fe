import { Send } from "lucide-react";
import { useState } from "react";

type ChatInputProps = {
  onSend: (message: string) => void;
};

const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const [text, setText] = useState<string>("");

  const handleSend = () => {
    if (text.trim() === "") return;
    onSend(text.trim());
    setText("");
  };

  return (
    <div className="flex items-center px-3 py-2 sm:px-4 bg-white border-t border-gray-300">
      <input
        type="text"
        className="flex-1 px-3 py-2 text-sm sm:text-base border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED1C24]"
        placeholder="Tanya AI..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button
        className="ml-2 p-2 sm:p-2.5 bg-[#ED1C24] text-white rounded-md hover:bg-red-600"
        onClick={handleSend}
      >
        <Send size={18} />
      </button>
    </div>
  );
};

export default ChatInput;
