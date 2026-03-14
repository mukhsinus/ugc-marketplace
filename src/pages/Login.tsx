// src/pages/Login.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { toast } from "sonner";
import { useAuth } from "@/lib/auth";

const Login = () => {

  const { signIn, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /* -------------------------------- */
  /* REDIRECT AFTER LOGIN             */
  /* -------------------------------- */

  useEffect(() => {

    if (user) {
      navigate("/dashboard");
    }

  }, [user, navigate]);

  /* -------------------------------- */
  /* SUBMIT                           */
  /* -------------------------------- */

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!email.trim() || !password.trim()) {

      toast.error("Please fill in all fields");
      return;

    }

    try {

      setLoading(true);

      const { error } = await signIn(email, password);

      if (error) {

        toast.error(error.message || "Login failed");
        return;

      }

      toast.success("Logged in successfully");

    } catch (err: any) {

      toast.error(err.message || "Login failed");

    } finally {

      setLoading(false);

    }

  };

  /* -------------------------------- */
  /* UI                               */
  /* -------------------------------- */

  return (

    <div className="min-h-screen hero-bg flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        <Link
          to="/"
          className="flex items-center gap-2 justify-center mb-8"
        >

          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">

            <span className="font-display font-bold text-primary-foreground text-sm">
              U
            </span>

          </div>

          <span className="font-display font-bold text-lg text-primary-foreground">
            UGC Market
          </span>

        </Link>

        <div className="rounded-2xl bg-background p-8 border border-border shadow-xl">

          <h1 className="text-2xl font-bold mb-6 text-center">
            Welcome Back
          </h1>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            <div>

              <Label htmlFor="email">
                Email
              </Label>

              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="mt-1"
              />

            </div>

            <div>

              <Label htmlFor="password">
                Password
              </Label>

              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1"
              />

            </div>

            <Button
              className="w-full"
              disabled={loading}
            >

              {loading
                ? "Signing in..."
                : "Log In"
              }

            </Button>

          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">

            Don't have an account?{" "}

            <Link
              to="/signup"
              className="text-primary font-medium hover:underline"
            >
              Sign Up
            </Link>

          </p>

        </div>

      </div>

    </div>

  );

};

export default Login;