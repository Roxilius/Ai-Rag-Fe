import { useEffect, useState } from "react";

interface TypewriteProps {
  text: string;
  speed?: number;
}

const Typewrite: React.FC<TypewriteProps> = ({ text, speed = 30 }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <pre className="whitespace-pre-wrap text-sm sm:text-base">{displayedText}</pre>
  );
};

export default Typewrite;
