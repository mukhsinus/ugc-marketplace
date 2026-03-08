import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

const Signup = () => {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get("role") || "creator";
  const [role, setRole] = useState(defaultRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    const { error } = await signUp(email, password, role, name);
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Account created! Check your email to confirm.");
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen hero-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="font-display font-bold text-primary-foreground text-sm">U</span>
          </div>
          <span className="font-display font-bold text-lg text-primary-foreground">UGC Market</span>
        </Link>
        <div className="rounded-2xl bg-background p-8 border border-border shadow-xl">
          <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>
          <div className="flex rounded-lg bg-muted p-1 mb-6">
            <button
              type="button"
              onClick={() => setRole("creator")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${role === "creator" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}
            >
              Creator
            </button>
            <button
              type="button"
              onClick={() => setRole("brand")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${role === "brand" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}
            >
              Brand
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">{role === "brand" ? "Company Name" : "Full Name"}</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder={role === "brand" ? "Your company" : "Your name"} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="mt-1" />
            </div>
            <Button className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
