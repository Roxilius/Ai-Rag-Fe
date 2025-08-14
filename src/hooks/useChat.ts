import { useState, useRef, useEffect, useCallback } from "react";
import {
  askAI,
  uploadFile,
  indexingFiles,
  deleteFile,
  getUserInfo,
} from "../api/api";
import type { Message, User } from "../types/types";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentAiMessage, setCurrentAiMessage] = useState("");
  const [userDetail, setUserDetail] = useState<User | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isMounted = true;
    const storedUser = sessionStorage.getItem("userDetail");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser) as User;
      setUserDetail(parsedUser);
    } else {
      (async () => {
        try {
          const res = await getUserInfo();
          if (isMounted) {
            setUserDetail(res);
            sessionStorage.setItem("userDetail", JSON.stringify(res));
          }
        } catch (err) {
          console.error("Gagal ambil user info:", err);
        }
      })();
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const simulateTyping = useCallback(async (text: string) => {
    setIsTyping(true);
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
  }, []);

  // Kirim pesan
  const handleSend = useCallback(
    async (message: string) => {
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
    userDetail,
    chatContainerRef,
    handleSend,
    handleUpload,
    handleIndexing,
    handleDelete,
    setMessages,
  } as const;
}
