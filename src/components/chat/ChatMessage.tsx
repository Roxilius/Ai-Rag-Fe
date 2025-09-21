import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

type ChatMessageProps = {
  message: string;
  sender: "user" | "ai";
  image: string | undefined;
  attachments?: string[];
};

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  sender,
  image,
  attachments = [],
}) => {
  const isUser = sender === "user";

  return (
    <div
      className={`flex mb-4 px-2 md:px-4 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <img
          src="https://career.idstar.co.id/assets/LogoIDstar-BoBpLUi5.png"
          alt="AI"
          className="w-9 h-9 rounded-full mr-3 border shadow shrink-0"
        />
      )}

      <div
        className={`
      relative px-4 py-3 rounded-3xl text-sm sm:text-base whitespace-pre-wrap break-words shadow-md transition-all
      max-w-[85%] sm:max-w-[75%] md:max-w-[65%] lg:max-w-[55%]
      ${
        isUser
          ? "bg-[#ED1C24] text-white rounded-br-none"
          : "bg-gray-100 text-gray-800 rounded-bl-none"
      }
    `}
      >
        <Markdown rehypePlugins={[rehypeHighlight]} remarkPlugins={[remarkGfm]}>
          {message}
        </Markdown>

        {attachments.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-3">
            {attachments.map((att, idx) => (
              <img
                key={att}
                src={`data:image/png;base64,${att}`}
                alt={`attachment-${idx}`}
                className="rounded-lg border shadow-sm max-h-44 object-cover transition-transform hover:scale-105"
              />
            ))}
          </div>
        )}
      </div>

      {isUser && (
        <img
          src={image}
          alt="User"
          className="w-9 h-9 ml-3 rounded-full border shadow shrink-0"
        />
      )}
    </div>
  );
};

export default ChatMessage;
