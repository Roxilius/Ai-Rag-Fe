const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center mb-3 ml-12 space-x-1">
      <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
      <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
      <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" />
    </div>
  );
};

export default TypingIndicator;
