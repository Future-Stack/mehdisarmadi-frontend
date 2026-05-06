import { Metadata } from "next";
import { SettingsTabs } from "@/features/settings/components/SettingsTabs";

export const metadata: Metadata = {
  title: "Settings | Dashboard",
  description: "Manage your account and application preferences",
};

export default function SubUserSettingsPage() {
  return <SettingsTabs />;
}
