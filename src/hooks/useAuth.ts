import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useAuth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(localStorage.getItem('userId'));

  useEffect(() => {
    if (userId) {
      localStorage.setItem('userId', userId);
    } else {
      localStorage.removeItem('userId');
    }
  }, [userId]);

  const sign_in = async (email: string, password: string) => {
    try {
      setLoading(true);

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .eq("password", password)
        .single(); // Fetch single user

      if (userError) throw userError;
      if (!userData) {
        throw new Error("Invalid email or password");
      }

      // Save user data to localStorage
      const { id, email: userEmail, role, first_name, last_name } = userData;
      if(role.toLowerCase() === "owner") {
        localStorage.setItem('ownerData', JSON.stringify({ id, email: userEmail, role, first_name, last_name }));
      } else {
        localStorage.setItem('userData', JSON.stringify({ id, email: userEmail, role, first_name, last_name }));
      }
      
      setUserId(id);
      toast.success("Logged in successfully!");
      navigate(role.toLowerCase() === "owner" ? "/owner/stores" : "/shopper");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const sign_out = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUserId(null);
      localStorage.removeItem('userData'); // Clear stored user data on sign out
      navigate("/login");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return {
    sign_in,
    sign_out,
    loading,
    userId
  };
};