import ChatMessage from "../components/chat/ChatMessage";
import TypingIndicator from "../components/chat/TypingIndicator";
import ChatInput from "../components/chat/ChatInput";
import { useChat } from "../hooks/useChat";
import { useAuth } from "../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

const ChatPage: React.FC = () => {
  const {
    messages,
    isTyping,
    currentAiMessage,
    chatContainerRef,
    handleSend,
  } = useChat();

  const { userDetail } = useAuth();

  return (
    <div className="flex flex-col h-full w-full bg-gray-100 rounded-xl shadow-lg overflow-hidden">
      {/* Chat Area */}
      <motion.div
        ref={chatContainerRef}
        className="flex flex-col-reverse flex-1 overflow-y-auto px-3 py-4 sm:px-5 gap-3 bg-white scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && !currentAiMessage && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              <TypingIndicator />
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Current Message */}
        <AnimatePresence>
          {currentAiMessage && (
            <motion.div
              key="ai-message"
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35 }}
            >
              <ChatMessage message={currentAiMessage} sender="ai" image="" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* History Messages */}
        <AnimatePresence initial={false}>
          {[...messages].reverse().map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <ChatMessage
                message={m.content}
                sender={m.sender}
                image={m.sender === "user" ? userDetail?.picture : ""}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Input Area */}
      <motion.div
        className="sticky bottom-0 bg-white/90 backdrop-blur-md border-t border-gray-200 p-2 sm:p-4 shadow-md"
        initial={{ y: 60 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 140, damping: 18 }}
      >
        <ChatInput onSend={handleSend} />
      </motion.div>
    </div>
  );
};

export default ChatPage;
