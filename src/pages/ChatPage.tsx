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
    <div className="flex flex-col h-full w-full bg-gray-50 rounded-lg overflow-hidden">
      {/* Chat Area */}
      <motion.div
        ref={chatContainerRef}
        className="flex flex-col-reverse flex-1 overflow-y-auto px-2 py-3 sm:px-4 gap-3 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
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
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                boxShadow: "0px 4px 20px rgba(255,0,100,0.2)",
              }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
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
              transition={{ duration: 0.4, ease: "easeOut" }}
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
        className="bg-white border-t p-2 sm:p-4 sticky bottom-0"
        initial={{ y: 60 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 15 }}
      >
        <ChatInput onSend={handleSend} />
      </motion.div>
    </div>
  );
};

export default ChatPage;
