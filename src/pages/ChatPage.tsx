import { useEffect, useRef, useState } from "react";
import ChatMessage from "../components/ChatMessage";
import TypingIndicator from "../components/TypingIndicator";
import ChatInput from "../components/ChatInput";
import { askAI } from "../services/ChatService";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { handleLogout } from "../services/LoginService";
import type { Message } from "../utils/types";

interface FirebaseUser {
  displayName: string;
  email: string;
  photoURL: string;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentAiMessage, setCurrentAiMessage] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const userCookie = Cookies.get("user");
  const user: FirebaseUser | null = userCookie ? JSON.parse(userCookie) : null;

  const simulateTyping = async (text: string) => {
    setIsTyping(false);
    setCurrentAiMessage("");
    for (let i = 0; i < text.length; i++) {
      setCurrentAiMessage(text.slice(0, i + 1));
      await new Promise((r) => setTimeout(r, 15));
    }
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), sender: "ai", content: text }]);
    setCurrentAiMessage("");
    setIsTyping(false);
  };

  const handleSend = async (message: string) => {
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), sender: "user", content: message }]);
    setIsTyping(true);
    setCurrentAiMessage("");
    try {
      const { success, data } = await askAI({
        userId: user?.email || 'default',
        question: message,
      });
      const full = success
        ? data.answer
        : "Maaf, terjadi kesalahan saat memproses jawaban AI.";
      await simulateTyping(full);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: "ai",
          content: "Maaf, terjadi error saat menghubungi server.",
        },
      ]);
      setIsTyping(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentAiMessage, isTyping]);

  return (
    <div className="flex flex-col h-screen w-full bg-[#1F1F1F]">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#ED1C24] text-white text-xl font-semibold p-4 shadow relative">
        {/* Left (empty space) */}
        <div className="w-10 sm:w-20" />

        {/* Center */}
        <div className="text-center flex-1">Chat AI - IDStar</div>

        {/* Right (avatar & dropdown) */}
        <div className="w-10 sm:w-20 flex justify-end relative">
          {user && (
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="p-0 border-none bg-transparent"
            >
              <img
                src={user.photoURL}
                alt="User"
                className="w-8 h-8 rounded-full cursor-pointer border-2 border-white hover:scale-105 transition"
              />
            </button>
          )}

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute top-12 right-0 bg-white text-black rounded-lg shadow-lg p-4 z-50 w-60">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={user?.photoURL}
                  alt="User"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium">{user?.displayName}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={()=> handleLogout(navigate)}
                className="w-full bg-[#ED1C24] hover:bg-red-700 text-white text-sm py-2 rounded-md"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col flex-1 overflow-y-auto bg-white p-2 sm:p-4">
          {messages.map((m) => (
            <ChatMessage key={m.id} message={m.content} sender={m.sender} />
          ))}

          {isTyping && <TypingIndicator />}

          {currentAiMessage !== "" && (
            <ChatMessage message={currentAiMessage} sender="ai" />
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t p-2 sm:p-4">
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
};

export default ChatPage;
