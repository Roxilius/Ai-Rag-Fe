import { useState, useRef, useCallback } from "react";
import { askAI, uploadFile, indexingFiles, deleteFile } from "../api/api";
import type { Message } from "../types/types";
import { useAuth } from "./useAuth";
import { v4 as uuidv4 } from "uuid";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentAiMessage, setCurrentAiMessage] = useState("");
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const { userDetail } = useAuth();

  const simulateTyping = useCallback(async (text: string) => {
    setIsTyping(true);
    setCurrentAiMessage("");
    for (let i = 0; i < text.length; i++) {
      setCurrentAiMessage(text.slice(0, i + 1));
      await new Promise((r) => setTimeout(r, 15));
    }
    setMessages((prev) => [
      ...prev,
      { id: uuidv4(), sender: "ai", content: text },
    ]);
    setCurrentAiMessage("");
    setIsTyping(false);
  }, []);

  // Kirim pesan
  const handleSend = useCallback(
    async (message: string, images: string[] = []) => {
      setMessages((prev) => [
        ...prev,
        { id: uuidv4(), sender: "user", content: message, attachments: images },
      ]);
      setIsTyping(true);
      setCurrentAiMessage("");
      try {
        const { success, data } = await askAI({
          userId: userDetail?.userId || "default",
          question: message,
          images,
        });
        const full = success
          ? data.answer
          : "Maaf, terjadi kesalahan saat memproses jawaban AI.";
        await simulateTyping(full);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: uuidv4(),
            sender: "ai",
            content: "Maaf, terjadi error saat menghubungi server.",
          },
        ]);
        setIsTyping(false);
      }
    },
    [simulateTyping, userDetail?.userId]
  );

  // Upload & File Handling
  const handleUpload = useCallback((files: File[]) => uploadFile(files), []);
  const handleIndexing = useCallback(
    (ids: string[], clear: boolean) => indexingFiles(ids, clear),
    []
  );
  const handleDelete = useCallback((ids: string[]) => deleteFile(ids), []);

  return {
    messages,
    isTyping,
    currentAiMessage,
    chatContainerRef,
    handleSend,
    handleUpload,
    handleIndexing,
    handleDelete,
    setMessages,
  } as const;
}
