import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import type { NavigateFunction } from "react-router-dom";
import type { AskAIParams, FileServer, Response } from "../types/types";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

function getAuthHeaders() {
  const token = Cookies.get("token");
  if (!token) {
    toast.error("Token tidak ditemukan. Silakan login kembali.");
    throw new Error("Token not found");
  }
  return {
    Authorization: `Bearer ${token}`,
  };
}

function handleApiError(error: unknown, defaultMessage: string): never {
  const err = error as AxiosError<{ message?: string }>;
  const msg = err.response?.data?.message || defaultMessage;
  toast.error(msg);
  console.error(defaultMessage, err);
  throw new Error(msg);
}

export async function askAI(params: AskAIParams): Promise<Response> {
  try {
    const res = await api.post<Response>(
      "/ask",
      params,
      { headers: { ...getAuthHeaders(), "Content-Type": "application/json" } }
    );
    return res.data;
  } catch (error) {
    handleApiError(error, "Gagal mengambil respons AI.");
  }
}

export async function getUserInfo() {
  try {
    const res = await api.get("auth/user-info", {
      headers: getAuthHeaders(),
    });
    return res.data.data;
  } catch (error) {
    handleApiError(error, "Gagal mengambil informasi user.");
  }
}

export async function verifLogin(navigate: NavigateFunction, idToken: string) {
  try {
    const res = await api.post(
      "/auth/google",
      { idToken },
      { headers: { "Content-Type": "application/json" } }
    );

    const { success, data, message } = res.data;
    if (success && data?.token && data?.user) {
      Cookies.set("token", data.token);
      Cookies.set("user", JSON.stringify(data.user));
      toast.success("Login berhasil!");
      navigate("/chat");
    } else {
      toast.error(message || "Login gagal.");
    }
  } catch (error) {
    handleApiError(error, "Terjadi kesalahan saat login.");
  }
}

export function handleLogout(navigate: NavigateFunction) {
  Cookies.remove("token");
  toast("Logout berhasil", { icon: "👋" });
  navigate("/");
}

export async function uploadFile(files: File[]) {
  try {
    const formData = new FormData();
    files.forEach((file) => formData.append("file", file));

    const res = await api.post("/files", formData, {
      headers: getAuthHeaders(),
    });
    toast.success(res.data?.message || "Berhasil mengunggah file.");
  } catch (error) {
    handleApiError(error, "Gagal mengunggah file.");
  }
}

export async function deleteFile(fileIds: string[]) {
  try {
    const res = await api.delete("/files", {
      headers: getAuthHeaders(),
      data: { fileIds },
    });
    toast.success(res.data?.message || "Berhasil menghapus file.");
  } catch (error) {
    handleApiError(error, "Gagal menghapus file.");
  }
}

export async function getFiles(page: number): Promise<FileServer> {
  try {
    const res = await api.get(`/files?page=${page}&limit=10`, {
      headers: getAuthHeaders(),
    });
    return {
      data: res.data.data,
      pagination: res.data.pagination,
    };
  } catch (error) {
    handleApiError(error, "Gagal mengambil daftar file.");
  }
}

export async function deleteIndexing() {
  try {
    const res = await api.delete("/collections", {
      headers: getAuthHeaders(),
    });
    toast.success(res.data?.message || "File berhasil dihapus.");
  } catch (error) {
    handleApiError(error, "Gagal menghapus file.");
  }
}

export async function indexingFiles(files: string[], clearAll: boolean) {
  try {
    const res = await api.post(
      "/collections",
      { fileIds: files, clearAll },
      { headers: getAuthHeaders() }
    );
    toast.success(res.data?.message || "Berhasil mengindeks file.");
  } catch (error) {
    handleApiError(error, "Gagal mengindeks file.");
  }
}
