import toast from "react-hot-toast";
import { verifLogin } from "../api/api";
import type { CredentialResponse } from "@react-oauth/google";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export function useAuth() {
  const navigate = useNavigate();

  const handleCredentialResponse = useCallback(
    async (response: CredentialResponse) => {
      const idToken = response?.credential;
      console.log(idToken);
      if (!idToken) {
        toast.error("Google login gagal. ID token tidak ditemukan.");
        console.error("Google login error: No ID token received.");
        return;
      }

      try {
        await verifLogin(navigate, idToken);
      } catch (error) {
        console.error("Login error:", error);
        toast.error("Terjadi kesalahan saat login. Silakan coba lagi.");
      }
    },
    [navigate]
  );

  return { handleCredentialResponse } as const;
}
