// src/pages/Banned.tsx
import { useEffect } from "react";
import { AlertTriangle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Banned() {
  useEffect(() => {
    // Prevent navigation away, clear any navigation history
    window.history.pushState(null, "", window.location.href);
    const handlePopstate = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.addEventListener("popstate", handlePopstate);
    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, []);

  const handleContactSupport = () => {
    window.location.href = "mailto:support@ugc-marketplace.com?subject=Account%20Suspension%20Appeal";
  };

  const handleLogout = () => {
    // Clear auth token and redirect to login
    localStorage.removeItem("ugc_token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-destructive/5 via-background to-background px-4">
      {/* Background orbs for consistency with landing page */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-destructive/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-destructive/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-md w-full">
        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-destructive/20 rounded-full blur-lg" />
              <AlertTriangle className="w-16 h-16 text-destructive relative" />
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground">Account Suspended</h1>
            <p className="text-lg text-muted-foreground">
              Your account has been temporarily suspended
            </p>
          </div>

          {/* Message */}
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              This action was taken due to a violation of our Terms of Service or Community Guidelines.
            </p>
            <p className="text-sm text-muted-foreground">
              If you believe this is a mistake, please contact our support team to appeal.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3 pt-4">
            <Button
              onClick={handleContactSupport}
              className="w-full gap-2"
              size="lg"
            >
              <HelpCircle className="w-4 h-4" />
              Contact Support
            </Button>

            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Return to Login
            </Button>
          </div>

          {/* Footer note */}
          <p className="text-xs text-muted-foreground pt-2">
            Support email: support@ugc-marketplace.com
          </p>
        </div>
      </div>
    </div>
  );
}
