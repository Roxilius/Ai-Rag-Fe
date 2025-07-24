import { signOut, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../utils/firebase";
import Cookies from "js-cookie";

export const handleLogout = async (navigate: ReturnType<typeof useNavigate>) => {
  try {
    await signOut(auth);
    Cookies.remove("token");
    Cookies.remove("user");
    navigate("/", { replace: true });
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

export const handleLogin = async (navigate: ReturnType<typeof useNavigate>, provider: GoogleAuthProvider) => {
  try {
    provider.setCustomParameters({
      prompt: "select_account"
    });

    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const token = await user.getIdToken();

    Cookies.set("token", token, { expires: 7 });
    Cookies.set("user", JSON.stringify({
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    }), { expires: 1 });

    navigate("/chat");
  } catch (error) {
    console.error("Login failed:", error);
    alert("Login gagal. Silakan coba lagi.");
  }
};