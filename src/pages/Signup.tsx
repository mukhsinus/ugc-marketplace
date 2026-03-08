import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const Signup = () => {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get("role") || "creator";
  const [role, setRole] = useState(defaultRole);

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

          {/* Role toggle */}
          <div className="flex rounded-lg bg-muted p-1 mb-6">
            <button
              onClick={() => setRole("creator")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${role === "creator" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}
            >
              Creator
            </button>
            <button
              onClick={() => setRole("brand")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${role === "brand" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}
            >
              Brand
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">{role === "brand" ? "Company Name" : "Full Name"}</Label>
              <Input id="name" placeholder={role === "brand" ? "Your company" : "Your name"} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="your@email.com" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" className="mt-1" />
            </div>
            <Button className="w-full">Create Account</Button>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
