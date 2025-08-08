/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import type { AskAIParams, FileType, Response } from "../utils/types";
import Cookies from "js-cookie";
import type { NavigateFunction } from "react-router-dom";
import toast from "react-hot-toast";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

export const askAI = async ({
  userId,
  question,
}: AskAIParams): Promise<Response> => {
  const token = Cookies.get("token");
  if (!token) {
    toast.error("Token tidak ditemukan. Silakan login kembali.");
    throw new Error("Token not found");
  }

  try {
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
  } catch (error: any) {
    const msg = error?.response?.data?.message || "Gagal mengambil respons AI.";
    toast.error(msg);
    console.error("Failed to fetch AI response:", error);
    throw new Error(msg);
  }
};

export const verifLogin = async (
  navigate: NavigateFunction,
  idToken: string
) => {
  try {
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
      Cookies.set("user", JSON.stringify(data.user));
      toast.success("Login berhasil!");
      navigate("/chat");
    } else {
      toast.error(message || "Login gagal.");
      console.error("Login gagal:", message);
    }
  } catch (err: any) {
    const msg = err?.response?.data?.message || "Terjadi kesalahan saat login.";
    toast.error(msg);
    console.error("Login error:", err);
  }
};

export const handleLogout = (navigate: NavigateFunction) => {
  Cookies.remove("token");
  Cookies.remove("user");
  toast("Logout berhasil", { icon: "👋" });
  navigate("/");
};

export const uploadFile = async (files: File[]) => {
  const token = Cookies.get("token");
  if (!token) {
    toast.error("Token tidak ditemukan. Silakan login kembali.");
    throw new Error("Token not found");
  }

  const formData = new FormData();
  files.forEach((file) => {
    formData.append("file", file);
  });

  try {
    const res = await api.post("/files", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    toast.success(res.data?.message || "Berhasil mengunggah file.");
  } catch (error: any) {
    const msg = error?.response?.data?.message || "Gagal mengunggah file.";
    toast.error(msg);
    console.error("Gagal mengunggah file:", error);
    throw new Error(msg);
  }
};

export const deleteFile = async (files: string[]) => {
  const token = Cookies.get("token");
  if (!token) {
    toast.error("Token tidak ditemukan. Silakan login kembali.");
    throw new Error("Token not found");
  }

  const fileIds = files.map((file) => file);

  try {
    const res = await api.delete("/files", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { fileIds },
    });

    toast.success(res.data?.message || "Berhasil menghapus file.");
  } catch (error: any) {
    const msg = error?.response?.data?.message || "Gagal menghapus file.";
    toast.error(msg);
    console.error("Gagal menghapus file:", error);
    throw new Error(msg);
  }
};

export const getFiles = async (): Promise<FileType[]> => {
  const token = Cookies.get("token");

  if (!token) {
    toast.error("Token tidak ditemukan. Silakan login kembali.");
    throw new Error("Token not found");
  }

  try {
    const res = await api.get("/files", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.files || [];
  } catch (error: any) {
    const msg =
      error?.response?.data?.message || "Gagal mengambil daftar file.";
    toast.error(msg);
    console.error("Gagal mengambil file:", error);
    throw new Error(msg);
  }
};

export const deleteIndexing = async () => {
  const token = Cookies.get("token");
  if (!token) {
    toast.error("Token tidak ditemukan. Silakan login kembali.");
    throw new Error("Token not found");
  }

  try {
    const res = await api.delete("/collections", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toast.success(res.data?.message || "File berhasil dihapus.");
  } catch (error: any) {
    const msg = error?.response?.data?.message || "Gagal menghapus file.";
    toast.error(msg);
    console.error("Gagal menghapus file:", error);
    throw new Error(msg);
  }
};

export const indexingFiles = async (files: string[]) => {
  const token = Cookies.get("token");
  if (!token) {
    toast.error("Token tidak ditemukan. Silakan login kembali.");
    throw new Error("Token not found");
  }

  const fileIds = files.map((file) => file);
  const clearAll = false;
  try {
    const res = await api.post(
      "/collections",
      { fileIds, clearAll },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success(res.data?.message || "Berhasil mengindeks file.");
  } catch (error: any) {
    const msg = error?.response?.data?.message || "Gagal mengindeks file.";
    toast.error(msg);
    console.error("Gagal mengindeks file:", error);
    throw new Error(msg);
  }
};
