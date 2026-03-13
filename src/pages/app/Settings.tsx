import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const TIMEZONES: string[] =
  typeof (Intl as unknown as { supportedValuesOf?: (key: string) => string[] })
    .supportedValuesOf === "function"
    ? (
        Intl as unknown as { supportedValuesOf: (key: string) => string[] }
      ).supportedValuesOf("timeZone")
    : [
        "UTC",
        "America/New_York",
        "America/Chicago",
        "America/Los_Angeles",
        "Europe/London",
        "Europe/Paris",
        "Asia/Tokyo",
      ];

export default function Settings() {
  const { user, signOut } = useAuth();
  const { profile, updateProfile, isUpdating } = useProfile();

  const [name, setName] = useState(profile?.name ?? "");
  const [timezone, setTimezone] = useState(
    profile?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
  );
  const [dataConsent, setDataConsent] = useState(
    profile?.data_sharing_consent ?? false,
  );
  const [theme, setTheme] = useState<"light" | "dark" | "system">(
    (profile?.theme as "light" | "dark" | "system") ?? "system",
  );

  const handleSave = async () => {
    try {
      await updateProfile({
        name: name.trim() || undefined,
        timezone,
        theme,
        data_sharing_consent: dataConsent,
      });
      toast.success("Settings saved.");
    } catch {
      toast.error("Failed to save. Please try again.");
    }
  };

  const handleChangePassword = async () => {
    if (!supabase || !user?.email) return;
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
    });
    if (error) toast.error(error.message);
    else toast.success("Password reset email sent.");
  };

  const handleDeleteAccount = () => {
    toast.error("Account deletion is not yet available. Contact support.");
  };

  return (
    <div className="max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-8"
      >
        {/* Profile section */}
        <section className="space-y-4">
          <h2 className="text-base font-semibold text-foreground">Profile</h2>

          <div className="space-y-2">
            <Label htmlFor="name">Display name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={user?.email ?? ""} disabled />
          </div>
        </section>

        <Separator />

        {/* Preferences */}
        <section className="space-y-4">
          <h2 className="text-base font-semibold text-foreground">
            Preferences
          </h2>

          <div className="space-y-2">
            <Label>Timezone</Label>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-56">
                {TIMEZONES.map((tz) => (
                  <SelectItem key={tz} value={tz}>
                    {tz}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Theme</Label>
            <Select
              value={theme}
              onValueChange={(v) => setTheme(v as typeof theme)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-medium text-foreground">
                Data sharing
              </p>
              <p className="text-xs text-muted-foreground">
                Help improve Xenith with anonymized usage data
              </p>
            </div>
            <Switch checked={dataConsent} onCheckedChange={setDataConsent} />
          </div>
        </section>

        <Button onClick={handleSave} disabled={isUpdating} className="w-full">
          {isUpdating ? "Saving…" : "Save changes"}
        </Button>

        <Separator />

        {/* Account */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">Account</h2>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleChangePassword}
          >
            Send password reset email
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => signOut()}
          >
            Sign out
          </Button>
          <Button
            variant="ghost"
            className="w-full text-destructive hover:text-destructive"
            onClick={handleDeleteAccount}
          >
            Delete account
          </Button>
        </section>
      </motion.div>
    </div>
  );
}
