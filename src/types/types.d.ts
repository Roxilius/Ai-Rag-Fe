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

export type FileType = {
  id: string;
  filename: string;
  filepath: string;
  indexed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Pagination = {
  currentPage: number;
  totalItems: number;
  totalPages: number;
  pageSize: number;
};

export type FileServer = {
  data: FileType[];
  pagination: Pagination;
};

export type Contact = {
  id: string;
  name: string;
  number: string;
  createdAt: string;
  updatedAt: string;
  status: string;
};

export type ContactServer = {
  data: Contact[];
  pagination: Pagination;
};

export type User = {
  userId: string;
  picture?: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
  roleId?: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
};
export type Users = {
  data: User[];
  pagination: Pagination;
};

export type Role = {
  createdAt: string;
  updatedAt: string;
  id: string;
  name: string;
  status: string;
};

export type Roles = {
  data: Role[];
  pagination: Pagination;
};
