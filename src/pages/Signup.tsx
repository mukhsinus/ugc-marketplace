// src/pages/Signup.tsx

import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import { api, setToken } from "@/lib/api";
import { useI18n } from "@/lib/i18n";

const Signup = () => {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get("role") || "creator";
  const { t } = useI18n();

  const [role, setRole] = useState(defaultRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error(t("auth.errors.fillAll"));
      return;
    }

    if (password.length < 6) {
      toast.error(t("auth.errors.passwordMin"));
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/signup", {
        email,
        password,
        role,
        name,
      });

      const token = res?.data?.session?.access_token;

      if (token) {
        setToken(token);
      }

      toast.success(t("auth.success.accountCreated"));

      navigate("/dashboard");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : t("auth.errors.signupFailed");
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen hero-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="flex items-center gap-2 mx-auto mb-4 justify-center"
        >
          <img
            src="/assets/logo.webp"
            alt="UGC Market"
            className="h-9 w-auto"
          />

          <span className="text-lg font-bold tracking-tight uppercase flex items-center">
            <span className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 bg-clip-text text-transparent">
              UGC
            </span>

            <span className="ml-1 text-white">Marketplace</span>
          </span>
        </Link>

        <div className="rounded-2xl bg-background p-8 border border-border shadow-xl">
          <h1 className="text-2xl font-bold mb-6 text-center">
            {t("auth.signup.title")}
          </h1>

          <div className="relative flex rounded-full bg-muted p-1 mb-6">
            {/* Sliding background */}
            <div
              className={`absolute top-1 bottom-1 w-1/2 rounded-full bg-background shadow-sm transition-transform duration-300 ease-out ${
                role === "brand" ? "translate-x-full" : "translate-x-0"
              }`}
            />

            <button
              type="button"
              onClick={() => setRole("creator")}
              className={`relative flex-1 py-2 text-sm font-medium rounded-full transition-colors ${
                role === "creator" ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {t("auth.signup.creator")}
            </button>

            <button
              type="button"
              onClick={() => setRole("brand")}
              className={`relative flex-1 py-2 text-sm font-medium rounded-full transition-colors ${
                role === "brand" ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {t("auth.signup.brand")}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">
                {role === "brand" ? t("auth.companyName") : t("auth.fullName")}
              </Label>

              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === "brand" ? t("auth.companyName") : t("auth.fullName")}
                className="mt-1 rounded-full"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
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

            <Button className="w-full" disabled={loading}>
              {loading ? t("auth.signup.creating") : t("auth.signup.button")}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {t("auth.signup.haveAccount")}{" "}
            <Link
              to="/login"
              className="text-primary font-medium hover:underline"
            >
              {t("auth.login.button")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
