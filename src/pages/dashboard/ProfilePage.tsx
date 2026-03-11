// src/pages/dashboard/ProfilePage.tsx
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const categories = ["beauty", "fashion", "food", "tech", "lifestyle", "fitness", "education", "travel"] as const;
const cities = ["Tashkent", "Samarkand", "Bukhara", "Namangan", "Andijan", "Fergana", "Nukus", "Karshi"];

const ProfilePage = () => {
  const { profile, refreshProfile } = useAuth();
  const [form, setForm] = useState({
    name: profile?.name || "",
    bio: profile?.bio || "",
    city: profile?.city || "",
    price_from: profile?.price_from?.toString() || "",
    instagram_link: profile?.instagram_link || "",
    tiktok_link: profile?.tiktok_link || "",
    youtube_link: profile?.youtube_link || "",
    categories: (profile?.categories as string[]) || [],
    company_name: profile?.company_name || "",
    website: profile?.website || "",
    industry: profile?.industry || "",
  });
  const [loading, setLoading] = useState(false);

  const updateProfile = async () => {
    if (!profile) return;
    setLoading(true);
    const updates: any = {
      name: form.name,
      bio: form.bio,
      city: form.city,
    };
    if (profile.role === "creator") {
      updates.price_from = parseFloat(form.price_from) || null;
      updates.instagram_link = form.instagram_link;
      updates.tiktok_link = form.tiktok_link;
      updates.youtube_link = form.youtube_link;
      updates.categories = form.categories;
    } else {
      updates.company_name = form.company_name;
      updates.website = form.website;
      updates.industry = form.industry;
    }

    const { error } = await supabase.from("profiles").update(updates).eq("id", profile.id);
    setLoading(false);
    if (error) { toast.error(error.message); } else {
      toast.success("Profile updated!");
      refreshProfile();
    }
  };

  const toggleCategory = (cat: string) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat) ? prev.categories.filter(c => c !== cat) : [...prev.categories, cat],
    }));
  };

  return (
    <DashboardLayout title="My Profile">
      <div className="max-w-2xl space-y-6">
        <div>
          <Label>{profile?.role === "brand" ? "Company Name" : "Full Name"}</Label>
          <Input value={profile?.role === "brand" ? form.company_name : form.name} onChange={(e) => setForm({ ...form, [profile?.role === "brand" ? "company_name" : "name"]: e.target.value })} className="mt-1" />
        </div>
        <div>
          <Label>Bio</Label>
          <Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="mt-1" rows={4} />
        </div>
        <div>
          <Label>City</Label>
          <Select value={form.city} onValueChange={(v) => setForm({ ...form, city: v })}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Select city" /></SelectTrigger>
            <SelectContent>{cities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        {profile?.role === "creator" && (
          <>
            <div>
              <Label>Starting Price ($)</Label>
              <Input type="number" value={form.price_from} onChange={(e) => setForm({ ...form, price_from: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label className="mb-2 block">Categories</Label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
                      form.categories.includes(cat) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><Label>Instagram</Label><Input value={form.instagram_link} onChange={(e) => setForm({ ...form, instagram_link: e.target.value })} placeholder="@username" className="mt-1" /></div>
              <div><Label>TikTok</Label><Input value={form.tiktok_link} onChange={(e) => setForm({ ...form, tiktok_link: e.target.value })} placeholder="@username" className="mt-1" /></div>
              <div><Label>YouTube</Label><Input value={form.youtube_link} onChange={(e) => setForm({ ...form, youtube_link: e.target.value })} placeholder="Channel URL" className="mt-1" /></div>
            </div>
          </>
        )}

        {profile?.role === "brand" && (
          <>
            <div><Label>Website</Label><Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="mt-1" /></div>
            <div><Label>Industry</Label><Input value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} className="mt-1" /></div>
          </>
        )}

        <Button onClick={updateProfile} disabled={loading}>
          {loading ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
