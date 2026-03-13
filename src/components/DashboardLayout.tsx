import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Home, Briefcase, MessageSquare, User, Settings, LogOut, Upload, ShoppingBag, LayoutDashboard } from "lucide-react";

const DashboardLayout = ({ children, title }: { children: React.ReactNode; title: string }) => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const isCreator = profile?.role === "creator";
  const isBrand = profile?.role === "brand";
  const isAdmin = profile?.role === "admin";

  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", show: true },
    { to: "/dashboard/jobs", icon: Briefcase, label: "Jobs", show: true },
    { to: "/dashboard/messages", icon: MessageSquare, label: "Messages", show: true },
    { to: "/dashboard/portfolio", icon: Upload, label: "Portfolio", show: isCreator },
    { to: "/dashboard/my-content", icon: ShoppingBag, label: "My Content", show: isCreator },
    { to: "/dashboard/my-jobs", icon: Briefcase, label: "My Jobs", show: isBrand },
    { to: "/dashboard/profile", icon: User, label: "Profile", show: !isAdmin },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-border hidden md:flex flex-col">
        <div className="p-4 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <img
                src="/assets/logo.webp"
                alt="UGC Market"
                className="h-6 w-auto"
              />
              <span className="font-semibold text-sm">UGC Market</span>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.filter(i => i.show).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === item.to
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display font-bold text-xs">
              {profile?.name?.charAt(0) || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{profile?.name || "User"}</p>
              <p className="text-xs text-muted-foreground capitalize">{profile?.role}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground" onClick={handleSignOut}>
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="px-6 py-4 flex items-center justify-between">
            <h1 className="text-xl font-display font-bold">{title}</h1>
            <div className="md:hidden">
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
