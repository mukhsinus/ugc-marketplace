// src/components/Navbar.tsx
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n, Language } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const langLabels: Record<Language, string> = { en: "EN", ru: "RU", uz: "UZ" };

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t, lang, setLang } = useI18n();
  const location = useLocation();

  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const transparentHero = isHome && !scrolled;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        transparentHero ? "bg-transparent" : "glass"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/assets/logo.webp" alt="UGC Market" className="h-9 w-auto" />
          <span className="text-lg font-bold tracking-tight uppercase flex items-center">
            <span className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 bg-clip-text text-transparent">
              UGC
            </span>

            <span className={`ml-1 ${transparentHero ? "text-white" : "text-black"}`}>
              Marketplace
            </span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/creators"
            className={`text-sm font-medium transition-colors ${
              transparentHero
                ? "text-white/80 hover:text-white"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("nav.creators")}
          </Link>

          <Link
            to="/jobs"
            className={`text-sm font-medium transition-colors ${
              transparentHero
                ? "text-white/80 hover:text-white"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("nav.jobs")}
          </Link>

          <Link
            to="/library"
            className={`text-sm font-medium transition-colors ${
              transparentHero
                ? "text-white/80 hover:text-white"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("nav.library")}
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`gap-1.5 ${
                  transparentHero ? "text-white hover:bg-white/10" : ""
                }`}
              >
                <Globe className="w-4 h-4" />
                {langLabels[lang]}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              {(["en", "ru", "uz"] as Language[]).map((l) => (
                <DropdownMenuItem
                  key={l}
                  onClick={() => setLang(l)}
                  className={lang === l ? "font-semibold" : ""}
                >
                  {langLabels[l]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link to="/login">
            <Button
              variant="ghost"
              size="sm"
              className={transparentHero ? "text-white hover:bg-white/10" : ""}
            >
              {t("nav.login")}
            </Button>
          </Link>

          <Link to="/signup">
            <Button size="sm">{t("nav.signup")}</Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className={`md:hidden ${
            transparentHero ? "text-white" : "text-foreground"
          }`}
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden glass border-t border-border px-4 pb-4 space-y-3">
          <Link
            to="/creators"
            onClick={() => setOpen(false)}
            className="block py-2 text-sm font-medium text-muted-foreground"
          >
            {t("nav.creators")}
          </Link>

          <Link
            to="/jobs"
            onClick={() => setOpen(false)}
            className="block py-2 text-sm font-medium text-muted-foreground"
          >
            {t("nav.jobs")}
          </Link>

          <Link
            to="/library"
            onClick={() => setOpen(false)}
            className="block py-2 text-sm font-medium text-muted-foreground"
          >
            {t("nav.library")}
          </Link>

          <div className="flex gap-2 pt-2">
            {(["en", "ru", "uz"] as Language[]).map((l) => (
              <Button
                key={l}
                variant={lang === l ? "default" : "outline"}
                size="sm"
                onClick={() => setLang(l)}
              >
                {langLabels[l]}
              </Button>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <Link to="/login" className="flex-1">
              <Button variant="outline" className="w-full" size="sm">
                {t("nav.login")}
              </Button>
            </Link>

            <Link to="/signup" className="flex-1">
              <Button className="w-full" size="sm">
                {t("nav.signup")}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;