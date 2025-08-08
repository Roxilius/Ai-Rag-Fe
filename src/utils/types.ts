export type Message = {
  id: string;
  sender: "user" | "ai";
  content: string;
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

export type User = {
  userId: string;
  picture: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
  role: string;
};

export type FileType = {
  id: string;
  filename: string;
  filepath: string;
  indexed: boolean;
  createdAt: string;
  updatedAt: string;
};
