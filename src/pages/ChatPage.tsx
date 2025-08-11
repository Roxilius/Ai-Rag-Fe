import { useEffect, useRef, useState } from "react";
import ChatMessage from "../components/ChatMessage";
import TypingIndicator from "../components/TypingIndicator";
import ChatInput from "../components/ChatInput";
import { askAI, deleteFile, getuserinfo, handleLogout, indexingFiles, uploadFile } from "../api/api";
import { useNavigate } from "react-router-dom";
import type { Message, User } from "../utils/types";
import UploadModal from "../components/UploadModal";



const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentAiMessage, setCurrentAiMessage] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userDetail, setUserDetail] = useState<User | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const simulateTyping = async (text: string) => {
    setIsTyping(false);
    setCurrentAiMessage("");
    for (let i = 0; i < text.length; i++) {
      setCurrentAiMessage(text.slice(0, i + 1));
      await new Promise((r) => setTimeout(r, 15));
    }
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), sender: "ai", content: text },
    ]);
    setCurrentAiMessage("");
    setIsTyping(false);
  };

  const handleSend = async (message: string) => {
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), sender: "user", content: message },
    ]);
    setIsTyping(true);
    setCurrentAiMessage("");
    try {
      const { success, data } = await askAI({
        userId: userDetail?.userId || "default",
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
    let isMounted = true;

    async function getUser() {
      try {
        const res = await getuserinfo();
        if (isMounted) setUserDetail(res);
      } catch (err) {
        console.error("Gagal ambil user info:", err);
      }
    }

    getUser();

    return () => {
      isMounted = false; // mencegah set state setelah unmount
    };
  }, []);

  const handleUpload = (files: File[]) => {
    uploadFile(files);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#1F1F1F]">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#ED1C24] text-white text-xl font-semibold p-2 shadow sticky top-0 z-50">
        {/* Left (empty space) */}
        <div className="w-10 sm:w-20" />

        {/* Center */}
        <div className="text-center flex-1">Chat AI - IDStar</div>

        {/* Right (avatar & dropdown) */}
        <div className="w-10 sm:w-20 flex justify-end relative">
          {userDetail && (
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="p-0 border-none bg-transparent"
            >
              <img
                src={userDetail?.picture}
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
                  src={userDetail?.picture}
                  alt="User"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium">{userDetail?.name}</p>
                  <p className="text-xs text-gray-500">{userDetail?.email}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {userDetail?.role === "admin" && (
                  <>
                    <button
                      onClick={() => {
                        setIsModalOpen(true);
                        setShowDropdown(false);
                      }}
                      className="w-full bg-[#ED1C24] hover:bg-red-700 text-white text-sm py-2 rounded-md"
                    >
                      File Handlder
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleLogout(navigate)}
                  className="w-full bg-[#ED1C24] hover:bg-red-700 text-white text-sm py-2 rounded-md"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div
        ref={chatContainerRef}
        className="flex flex-col-reverse flex-1 overflow-y-auto bg-white px-2 py-4 sm:px-4 gap-3"
      >
        {isTyping && <TypingIndicator />}

        {currentAiMessage !== "" && (
          <ChatMessage message={currentAiMessage} sender="ai" image="" />
        )}

        {[...messages].reverse().map((m) => (
          <ChatMessage
            key={m.id}
            message={m.content}
            sender={m.sender}
            image={userDetail?.picture}
          />
        ))}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t p-2 sm:p-4 sticky bottom-0">
        <ChatInput onSend={handleSend} />
      </div>

      {/* File Handler Modal */}
      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpload={handleUpload}
        onIndexing={(selectedFileIds) => {
          if (confirm(`clear all`)) {
            indexingFiles(selectedFileIds, true);
          } else {
            indexingFiles(selectedFileIds, false);
          }
        }}
        onDelete={(ids) => {
          deleteFile(ids);
        }}
      />
    </div>
  );
};

export default ChatPage;
