import { useEffect, useRef, useState } from "react";
import ChatMessage from "../components/ChatMessage";
import TypingIndicator from "../components/TypingIndicator";
import ChatInput from "../components/ChatInput";
import { askAI } from "../services/ChatService";

type Message = { sender: "user" | "ai"; content: string };

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentAiMessage, setCurrentAiMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const simulateTyping = async (text: string) => {
    setIsTyping(false);
    setCurrentAiMessage("");
    for (let i = 0; i < text.length; i++) {
      setCurrentAiMessage(text.slice(0, i + 1));
      await new Promise((r) => setTimeout(r, 15));
    }
    setMessages((prev) => [...prev, { sender: "ai", content: text }]);
    setCurrentAiMessage("");
    setIsTyping(false);
  };

  const handleSend = async (message: string) => {
    setMessages((prev) => [...prev, { sender: "user", content: message }]);
    setIsTyping(true);
    setCurrentAiMessage("");
    try {
        const { success, data } = await askAI({ userId: "6285161501710@c.us", question: message });
        const full = success
        ? data.answer
        : "Maaf, terjadi kesalahan saat memproses jawaban AI.";
        await simulateTyping(full);
        setIsTyping(false);

    } catch {
      setMessages((prev) => [
        ...prev,
        {
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
      <div className="bg-[#ED1C24] text-white text-xl font-semibold text-center p-4 shadow">
        Chat AI – IDStar
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Chat area */}
        <div className="flex flex-col flex-1 overflow-y-auto bg-white p-2 sm:p-4">
          {messages.map((m, i) => (
            <ChatMessage key={i} message={m.content} sender={m.sender} />
          ))}

          {isTyping && <TypingIndicator />}

          {currentAiMessage != '' && (
            <ChatMessage message={currentAiMessage} sender="ai" />
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      <div className="bg-white border-t p-2 sm:p-4">
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
};

export default ChatPage;
