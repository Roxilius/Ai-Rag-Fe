import { CircleUserRound } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

type ChatMessageProps = {
  message: string;
  sender: "user" | "ai";
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message, sender }) => {
  const isUser = sender === "user";

  return (
    <div className={`flex items-end mb-4 px-2 md:px-4 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <img
          src="https://career.idstar.co.id/assets/LogoIDstar-BoBpLUi5.png"
          alt="AI"
          className="w-8 h-8 rounded-full mr-2 border shrink-0"
        />
      )}

      <div
        className={`
          relative px-4 py-3 rounded-lg shadow
          text-sm sm:text-base whitespace-pre-wrap break-words overflow-x-auto
          max-w-[90%] sm:max-w-[75%] md:max-w-[65%] lg:max-w-[60%] xl:max-w-[55%]
          ${isUser
            ? "bg-[#ED1C24] text-white rounded-br-none"
            : "bg-gray-200 text-black rounded-bl-none"
          }
         `}
      >
        <Markdown
          rehypePlugins={[rehypeHighlight]}
          remarkPlugins={[remarkGfm]}
        >
          {message}
        </Markdown>
      </div>

      {isUser && (
        <CircleUserRound className="w-8 h-8 ml-2 text-white bg-gray-800 p-1 rounded-full border shrink-0" />
      )}
    </div>
  );
};

export default ChatMessage;
