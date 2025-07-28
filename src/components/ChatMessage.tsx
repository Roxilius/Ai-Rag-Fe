import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

type ChatMessageProps = {
  message: string;
  sender: "user" | "ai";
  image: string | undefined;
};

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  sender,
  image,
}) => {
  const isUser = sender === "user";

  return (
    <div
      className={`flex mb-3 px-2 md:px-4 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <img
          src="https://career.idstar.co.id/assets/LogoIDstar-BoBpLUi5.png"
          alt="AI"
          className="w-8 h-8 rounded-full mr-2 border shrink-0"
        />
      )}

      <div
        className={`
          relative px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap break-words overflow-x-auto shadow-sm
          max-w-[85%] sm:max-w-[75%] md:max-w-[65%] lg:max-w-[55%]
          ${
            isUser
              ? "bg-[#ED1C24] text-white rounded-br-none"
              : "bg-[#F1F0F0] text-black rounded-bl-none"
          }
        `}
      >
        <Markdown rehypePlugins={[rehypeHighlight]} remarkPlugins={[remarkGfm]}>
          {message}
        </Markdown>
      </div>

      {isUser && (
        <img
          src={image}
          alt="User"
          className="w-8 h-8 ml-2 rounded-full border shrink-0"
        />
      )}
    </div>
  );
};

export default ChatMessage;
