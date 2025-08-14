import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatMessage from "../components/ChatMessage";
import TypingIndicator from "../components/TypingIndicator";
import ChatInput from "../components/ChatInput";
import UploadModal from "../components/UploadModal";
import { handleLogout } from "../api/api";
import { useChat } from "../hooks/useChat";

const ChatPage: React.FC = () => {
  const {
    messages,
    isTyping,
    currentAiMessage,
    userDetail,
    chatContainerRef,
    handleSend,
    handleUpload,
    handleIndexing,
    handleDelete,
  } = useChat();

  const [showDropdown, setShowDropdown] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen w-full bg-[#1F1F1F]">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#ED1C24] text-white text-xl font-semibold p-2 shadow sticky top-0 z-50">
        <div className="w-10 sm:w-20" />
        <div className="text-center flex-1">Chat AI - IDStar</div>
        <div className="w-10 sm:w-20 flex justify-end relative">
          {userDetail && (
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="p-0 border-none bg-transparent"
            >
              <img
                src={userDetail.picture}
                alt="User"
                className="w-8 h-8 rounded-full cursor-pointer border-2 border-white hover:scale-105 transition"
              />
            </button>
          )}
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
              {userDetail?.role === "admin" && (
                <button
                  onClick={() => {
                    setIsModalOpen(true);
                    setShowDropdown(false);
                  }}
                  className="w-full bg-[#ED1C24] hover:bg-red-700 text-white text-sm py-2 rounded-md"
                >
                  File Handler
                </button>
              )}
              <button
                onClick={() => handleLogout(navigate)}
                className="w-full bg-[#ED1C24] hover:bg-red-700 text-white text-sm py-2 rounded-md mt-2"
              >
                Logout
              </button>
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
        {currentAiMessage && (
          <ChatMessage message={currentAiMessage} sender="ai" image="" />
        )}
        {[...messages].reverse().map((m) => (
          <ChatMessage
            key={m.id}
            message={m.content}
            sender={m.sender}
            image={m.sender === "user" ? userDetail?.picture : ""}
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
        onIndexing={(selectedFileIds, clearAll) => {
          handleIndexing(selectedFileIds, clearAll);
        }}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ChatPage;
