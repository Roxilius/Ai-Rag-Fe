import React from "react";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { verifLogin } from "../api/api";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleCredentialResponse = async (response: CredentialResponse) => {
  const id_token = response.credential;
  if (!id_token) {
    console.error("No ID token received.");
    return;
  }

  await verifLogin(navigate, id_token);
};

  React.useEffect(() => {
    Cookies.remove("token");
  }, []);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-gray-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white shadow-xl rounded-2xl px-6 py-10 sm:p-10 max-w-md w-full text-center"
      >
        <motion.img
          src="https://d2oi1rqwb0pj00.cloudfront.net/community/nio_1744103568525_100.webp"
          alt="IDStar Logo"
          className="w-24 sm:w-32 mx-auto mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        />

        <motion.h2
          className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Welcome to IDStar Portal
        </motion.h2>

        <motion.p
          className="text-sm text-gray-500 mb-6 sm:mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Please sign in using your Google account.
        </motion.p>

        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="flex justify-center"
        >
          <GoogleLogin
            onSuccess={handleCredentialResponse}
            onError={() => console.log("Login Failed")}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
