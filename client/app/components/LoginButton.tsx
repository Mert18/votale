"use client";

import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginButton() {
  const { login } = useAuth();
  const router = useRouter();

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      if (credentialResponse.credential) {
        await login(credentialResponse.credential);
        router.push("/");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    }
  };

  const handleError = () => {
    console.error("Google Sign-In failed");
    alert("Google Sign-In failed. Please try again.");
  };

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        theme="filled_white"
        size="large"
        text="signin_with"
      />
    </div>
  );
}
