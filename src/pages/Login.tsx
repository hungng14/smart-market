
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { users } from "@/data/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error("Invalid credentials");
      }

      toast.success("Logged in successfully!");
      navigate(user.role === "owner" ? "/owner" : "/shopper");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-secondary flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface p-8 rounded-xl shadow-sm max-w-md w-full"
      >
        <h1 className="text-2xl font-bold text-center mb-6">Welcome back</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
            disabled={loading}
          >
            Continue
          </Button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Sign Up
            </button>
          </p>
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-surface text-gray-500">OR</span>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => toast.info("Google sign in not implemented")}
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5 mr-2" />
            Continue with Google
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => toast.info("Microsoft sign in not implemented")}
          >
            <img src="https://www.microsoft.com/favicon.ico" className="w-5 h-5 mr-2" />
            Continue with Microsoft Account
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => toast.info("Apple sign in not implemented")}
          >
            <img src="https://www.apple.com/favicon.ico" className="w-5 h-5 mr-2" />
            Continue with Apple
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => toast.info("Phone sign in not implemented")}
          >
            <span className="mr-2">📱</span>
            Continue with phone
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
