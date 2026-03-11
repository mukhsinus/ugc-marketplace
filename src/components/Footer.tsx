// src/components/Footer.tsx
import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";

const Footer = () => {
  const { t } = useI18n();

  return (
    <footer className="bg-surface border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="font-display font-bold text-primary-foreground text-sm">U</span>
              </div>
              <span className="font-display font-bold text-lg">UGC Market</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-md">{t("footer.description")}</p>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-4 text-sm">{t("footer.platform")}</h4>
            <div className="space-y-2">
              <Link to="/creators" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t("nav.creators")}</Link>
              <Link to="/jobs" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t("nav.jobs")}</Link>
              <Link to="/library" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t("nav.library")}</Link>
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-4 text-sm">{t("footer.company")}</h4>
            <div className="space-y-2">
              <Link to="/about" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t("footer.about")}</Link>
              <Link to="/contact" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t("footer.contact")}</Link>
              <Link to="/privacy" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t("footer.privacy")}</Link>
              <Link to="/terms" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t("footer.terms")}</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} UGC Market. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
