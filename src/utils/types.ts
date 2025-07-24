export type Message = { 
    id: string;
    sender: "user" | "ai";
    content: string 
};

export type Data = {
  question: string;
  answer: string;
};

export type Response = {
  success: boolean;
  message: string;
  data: Data;
};

export type AskAIParams = {
  userId: string;
  question: string;
};