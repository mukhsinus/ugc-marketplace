// src/pages/Login.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

const Login = () => {

  const { signIn, user } = useAuth();
  const { t } = useI18n();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
t("auth.errors.fillAll")
      toast.error("Please fill in all fields");
      return;

    }

    try {

      setLoading(true);

      const { error } = await signIn(email, password);

      if (error) {

        toast.error(error.message || t("auth.errors.loginFailed"));
        return;

      }

      toast.success(t("auth.success.loggedIn"));

    } catch (err: unknown) {

      const errorMessage = err instanceof Error ? err.message : t("auth.errors.loginFailed");
      toast.error(errorMessage);

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

        <Link to="/" className="flex items-center gap-2 mx-auto mb-4 justify-center">
          <img src="/assets/logo.webp" alt="UGC Market" className="h-9 w-auto" />

          <span className="text-lg font-bold tracking-tight uppercase flex items-center">
            <span className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 bg-clip-text text-transparent">
              UGC
            </span>

            <span className="ml-1 text-white">
              Marketplace
            </span>
          </span>
        </Link>

        <div className="rounded-2xl bg-background p-8 border border-border shadow-xl">

          <h1 className="text-2xl font-bold mb-6 text-center">
            {t("auth.login.title")}
          </h1>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            <div>

              <Label htmlFor="email">
                {t("auth.email")}
              </Label>

              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="mt-1 rounded-full"
              />

            </div>

            <div>

              <Label htmlFor="password">
                {t("auth.password")}
              </Label>

              <div className="relative mt-1">

                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pr-10 rounded-full"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>

              </div>

            </div>

            <Button
              className="w-full"
              disabled={loading}
            >

              {loading
                ? t("auth.login.signing")
                : t("auth.login.button")
              }

            </Button>

          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">

            {t("auth.login.noAccount")}{" "}

            <Link
              to="/signup"
              className="text-primary font-medium hover:underline"
            >
              {t("auth.login.signUp")}
            </Link>

          </p>

        </div>

      </div>

    </div>

  );

};

export default Login;