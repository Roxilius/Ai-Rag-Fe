import axios from "axios";
import type { AskAIParams, Response } from "../utils/types";
import Cookies from "js-cookie";
import type { NavigateFunction } from "react-router-dom";

// Inisialisasi Axios
export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

// Fungsi bertanya ke AI
export const askAI = async ({ userId, question }: AskAIParams): Promise<Response> => {
  try {
    const token = Cookies.get("token");
    if (!token) throw new Error("Token not found");

    const res = await api.post(
      "/ask",
      { userId, question },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.data as Response;
  } catch (error) {
    console.error("Failed to fetch AI response:", error);
    throw new Error("Failed to fetch AI response");
  }
};

// Verifikasi Login Google
export const verifLogin = async (navigate: NavigateFunction, idToken: string) => {
  try {
    console.log(`ID Token : ${idToken}`);
    const res = await api.post(
      "/auth/google",
      { idToken },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const { success, data, message } = res.data;
    if (success && data?.token && data?.user) {
      Cookies.set("token", data.token);
      console.log(`Token : ${data.token}`);
      Cookies.set("user", JSON.stringify(data.user));
      console.log(data.user)
      navigate("/chat");
    } else {
      console.error("Login gagal:", message);
    }
  } catch (err) {
    console.error("Login error:", err);
  }
};

// Logout
export const handleLogout = (navigate: NavigateFunction) => {
  Cookies.remove("token");
  Cookies.remove("user");
  navigate("/");
};
