import axios from "axios";
import type { AskAIParams, Response } from "../utils/types";
import Cookies from "js-cookie";
import type { NavigateFunction } from "react-router-dom";

// 🧩 Inisialisasi instance axios
export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

// 🎯 Fungsi untuk mengirim pertanyaan ke AI
export const askAI = async ({
  userId,
  question,
}: AskAIParams): Promise<Response> => {
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
    console.error("❌ Failed to fetch AI response:", error);
    throw new Error("Failed to fetch AI response");
  }
};

// 🔐 Mendapatkan user info menggunakan token dari cookie
export const getUserInfo = async () => {
  const token = Cookies.get("token");
  console.log(token);
  if (!token) throw new Error("Token not found");

  try {
    const res = await api.get("/auth/user-info", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log(res.data)
    return res.data.data;
  } catch (err) {
    console.error("❌ Failed to fetch user info:", err);
    throw new Error("Failed to fetch user info");
  }
};

// ✅ Verifikasi Login (mengirim ID token ke backend)
export const verifLogin = async (
  navigate: NavigateFunction,
  idToken: string
) => {
  try {
    const res = await api.post(
      "/auth/google",
      { idToken },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (res.data.success) {
      Cookies.set("token", res.data.data.token);
      navigate("/chat");
    } else {
      console.error("❌ Login gagal:", res.data.message);
    }
  } catch (err) {
    console.error("❌ Fetch login error:", err);
  }
};

export const handleLogout = (navigate: NavigateFunction) => {
  Cookies.remove("token");
  navigate("/", { replace: true });
};
