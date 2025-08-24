import toast from "react-hot-toast";
import { getUserInfo, verifLogin } from "../api/api";
import type { CredentialResponse } from "@react-oauth/google";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../types/types";
import Cookies from "js-cookie";

export function useAuth() {
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const storedUser = sessionStorage.getItem("userDetail");
    const token = Cookies.get("token");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser) as User;
      setUserDetail(parsedUser);
    } else if (token) {
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

  const [userDetail, setUserDetail] = useState<User | null>(null);

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

  return { userDetail, handleCredentialResponse } as const;
}
