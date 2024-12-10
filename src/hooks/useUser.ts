import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  user: string;
  role: string;
  phone: string;
}

export const useUser = () => {
  const [user, setUser] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);

  useEffect(() => {
    try {
      const token = sessionStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode<DecodedToken>(token);
        setUser(decoded.user);
        setRole(decoded.role);
        setPhone(decoded.phone);
      }
    } catch (err) {
      console.error("Token decoding error:", err);
    }
  }, []);

  return { user, role, phone };
};
