import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import type { NavigateFunction } from "react-router-dom";
import type {
  AskAIParams,
  Contact,
  ContactServer,
  FileServer,
  Response,
  Role,
  Roles,
  User,
  Users,
} from "../types/types";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

function getAuthHeaders(): { Authorization: string } {
  const token = Cookies.get("token");
  if (!token) throw new Error("Token not found");
  return { Authorization: `Bearer ${token}` };
}

function handleApiError(error: unknown, defaultMessage: string): never {
  const err = error as AxiosError<{ message?: string }>;
  const msg = err.response?.data?.message || defaultMessage;
  toast.dismiss();
  toast.error(msg);
  console.error(defaultMessage, err);
  throw new Error(msg);
}

// --------------------- AI ---------------------
export async function askAI(params: AskAIParams): Promise<Response> {
  try {
    const res = await api.post<Response>("/ask", params, {
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    });
    console.log(res.data);
    return res.data;
  } catch (error) {
    handleApiError(error, "Gagal mengambil respons AI.");
  }
}

// --------------------- User ---------------------
export async function getUserInfo(): Promise<User> {
  try {
    const res = await api.get("/auth/user-info", { headers: getAuthHeaders() });
    console.log(res.data)
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
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const { success, data, message } = res.data;
    if (success && data?.token && data?.user) {
      Cookies.set("token", data.token);
      Cookies.set("user", JSON.stringify(data.user));
      toast.dismiss();
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
  sessionStorage.removeItem("userDetail");
  toast.dismiss();
  toast("Logout berhasil", { icon: "👋" });
  navigate("/login");
}

// --------------------- File ---------------------
export async function uploadFile(files: File[]): Promise<void> {
  try {
    const formData = new FormData();
    files.forEach((file) => formData.append("file", file));
    const res = await api.post("/files", formData, {
      headers: getAuthHeaders(),
    });
    toast.dismiss();
    toast.success(res.data?.message || "Berhasil mengunggah file.");
  } catch (error) {
    handleApiError(error, "Gagal mengunggah file.");
  }
}

export async function deleteFile(fileIds: string[]): Promise<void> {
  try {
    const res = await api.delete("/files", {
      headers: getAuthHeaders(),
      data: { fileIds },
    });
    toast.dismiss();
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
    return res.data;
  } catch (error) {
    handleApiError(error, "Gagal mengambil daftar file.");
  }
}

export async function deleteIndexing(): Promise<void> {
  try {
    const res = await api.delete("/collections", { headers: getAuthHeaders() });
    toast.dismiss();
    toast.success(res.data?.message || "File berhasil dihapus.");
  } catch (error) {
    handleApiError(error, "Gagal menghapus file.");
  }
}

export async function indexingFiles(
  files: string[],
  clearAll: boolean
): Promise<void> {
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

// --------------------- Contacts ---------------------
export const getContacts = async (page: number): Promise<ContactServer> => {
  try {
    const res = await api.get(`/phones?page=${page}&limit=10`, {
      headers: getAuthHeaders(),
    });
    console.log(res.data);
    return res.data as ContactServer;
  } catch (error) {
    handleApiError(error, "Gagal mengambil daftar kontak.");
  }
};

export const addContact = async (contact: Contact): Promise<Contact> => {
  try {
    const data = {
      number: contact.number.replace(/[\s-]/g, ""),
      name: contact.name.toUpperCase(),
    };
    const res = await api.post("/phones", data, {
      headers: getAuthHeaders(),
    });

    const newContact: Contact = res.data?.data;
    toast.dismiss();
    toast.success(res.data?.message || "Berhasil menambahkan kontak.");
    return newContact;
  } catch (error) {
    handleApiError(error, "Gagal menambahkan kontak.");
  }
};

export const deleteContact = async (ids: string[]): Promise<void> => {
  try {
    const res = await api.delete("/phones", {
      headers: getAuthHeaders(),
      data: { phoneIds: ids },
    });
    toast.success(res.data?.message || "Berhasil menghapus kontak.");
  } catch (error) {
    handleApiError(error, "Gagal menghapus kontak.");
  }
};

export const updateContact = async (contact: Contact): Promise<void> => {
  try {
    const updateContact = {
      id: contact.id,
      name: contact.name,
      number: contact.number,
      status: contact.status,
    };
    console.log(updateContact);
    const res = await api.put("/phones", updateContact, {
      headers: getAuthHeaders(),
    });
    toast.dismiss();
    toast.success(res.data?.message || "Kontak berhasil diupdate.");
  } catch (error) {
    handleApiError(error, "Gagal update kontak.");
  }
};

// === Users ===
export const getUsers = async (page: number): Promise<Users> => {
  try {
    const res = await api.get(`/users?page=${page}&limit=10`, {
      headers: getAuthHeaders(),
    });
    console.log(res.data);
    return res.data as Users;
  } catch (error) {
    handleApiError(error, "Gagal mengambil daftar kontak.");
  }
};

export const deleteUsers = async (ids: string[]): Promise<void> => {
  try {
    const res = await api.delete("/users", {
      headers: getAuthHeaders(),
      data: { userIds: ids },
    });
    toast.success(res.data?.message || "Berhasil menghapus users.");
  } catch (error) {
    handleApiError(error, "Gagal menghapus users.");
  }
};

export const updateUser = async (
  userId: string,
  roleId: string
): Promise<void> => {
  try {
    const res = await api.put(`/users`,{ userId, roleId, },
      {
        headers: getAuthHeaders(),
      }
    );
    console.log(res.data?.message);
  } catch (error) {
    handleApiError(error, "Gagal memperbarui data user.");
  }
};

// === roles ===
export const getRoles = async (page: number, status?: string): Promise<Roles> => {
  try {
    const query = status ? `&status=${status}` : "";
    const res = await api.get(`/roles?page=${page}&limit=10${query}`, {
      headers: getAuthHeaders(),
    });
    console.log("Roles response:", res.data);
    return res.data as Roles;
  } catch (error) {
    handleApiError(error, "Gagal mengambil daftar role.");
  }
};

export const addRole = async (role: { name: string }): Promise<Role> => {
  try {
    const res = await api.post(
      `/roles`,
      {
        name: role.name,
      },
      {
        headers: getAuthHeaders(),
      }
    );
    console.log("Add role response:", res.data);
    return res.data as Role;
  } catch (error) {
    handleApiError(error, "Gagal menambahkan role.");
  }
};

export const updateRole = async (role: {
  id: string;
  name: string;
  status: string;
}): Promise<Role> => {
  try {
    const res = await api.put(
      `/roles`,
      {
        id: role.id,
        name: role.name,
        status: role.status,
      },
      {
        headers: getAuthHeaders(),
      }
    );
    console.log("Update role response:", res.data);
    return res.data as Role;
  } catch (error) {
    handleApiError(error, "Gagal memperbarui role.");
  }
};