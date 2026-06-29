"use client";

import { useEffect, useState } from "react";
import { Building2, MapPin, Phone, Mail, Hash, Globe, Image as ImageIcon, Save, Loader } from "lucide-react";
import { Input, Button } from "@/components/ui";
import { useGetCompanyProfileQuery } from "@/store/api/sub-user/company-profile/getCompanyProfile";
import { useUpdateCompanyProfileMutation } from "@/store/api/sub-user/company-profile/updateCompanyProfile";
import { toast } from "sonner";

export function CompanySettings() {
  const { data, isLoading } =
    useGetCompanyProfileQuery();

  const [
    updateCompanyProfile,
    { isLoading: saving },
  ] = useUpdateCompanyProfileMutation();

  const [logoPreview, setLogoPreview] =
    useState<string | null>(null);

  const [logoFile, setLogoFile] =
    useState<File>();

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    hstNumber: "",
    website: "",
  });
  useEffect(() => {
    if (!data?.data) return;

    setForm({
      name: data.data.name,
      address: data.data.address,
      phone: data.data.phone,
      email: data.data.email,
      hstNumber: data.data.hstNumber,
      website: data.data.website,
    });

    setLogoPreview(data.data.logo);
  }, [data]);

  const handleSave = async () => {
    const toastId = toast.loading(
      "Updating company profile..."
    );

    try {
      const res =
        await updateCompanyProfile({
          ...form,
          logo: logoFile,
        }).unwrap();

      toast.success(res.message, {
        id: toastId,
      });
    } catch (error: any) {
      toast.error("Failed to update profile", {
        id: toastId,
        description:
          error?.data?.message ??
          "Something went wrong.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader className="h-7 w-7 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400">
          <Building2 size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Company Information</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage your organization details and branding</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Company Name */}
        <Input
          label="Company Name"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
          prefix={<Building2 className="w-4 h-4 opacity-50" />}
        />

        {/* Company Logo Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Company Logo</label>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center bg-gray-50/50 dark:bg-gray-900/50 overflow-hidden relative group">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <ImageIcon className="w-8 h-8 text-gray-300 mb-1" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">No Logo</span>
                </>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  className="hidden"
                  id="logo-upload"
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (file) {
                      setLogoFile(file);
                      setLogoPreview(URL.createObjectURL(file));
                    }
                  }}
                />
                <Button
                  variant="secondary"
                  className="h-10 px-4 font-bold text-xs"
                  onClick={() => document.getElementById('logo-upload')?.click()}
                >
                  Choose File
                </Button>

              </div>
              <p className="text-[11px] text-gray-500">JPG, PNG or SVG. Max size 2MB.</p>
            </div>
          </div>
        </div>

        {/* Address and Phone Number */}
        <div className="grid gap-6 sm:grid-cols-2">
          <Input
            label="Address"
            value={form.address}
            onChange={(e) =>
              setForm({
                ...form,
                address: e.target.value,
              })
            }
            prefix={<MapPin className="w-4 h-4 opacity-50" />}
          />
          <Input
            label="Phone Number"
            value={form.phone}
            onChange={(e) =>
              setForm({
                ...form,
                phone: e.target.value,
              })
            }
            prefix={<Phone className="w-4 h-4 opacity-50" />}
          />
        </div>

        {/* Email and HST Number */}
        <div className="grid gap-6 sm:grid-cols-2">
          <Input
            label="Email Address"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
            prefix={<Mail className="w-4 h-4 opacity-50" />}
          />
          <Input
            label="HST Number"
            value={form.hstNumber}
            onChange={(e) =>
              setForm({
                ...form,
                hstNumber: e.target.value,
              })
            }
            prefix={<Hash className="w-4 h-4 opacity-50" />}
          />
        </div>

        {/* Website Link */}
        <Input
          label="Website"
          value={form.website}
          onChange={(e) =>
            setForm({
              ...form,
              website: e.target.value,
            })
          }
          prefix={<Globe className="w-4 h-4 opacity-50" />}
        />
      </div>

      <div className="flex justify-end pt-6">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-bold px-8 shadow-lg shadow-emerald-200 dark:shadow-none"
        >
          {saving ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Save size={16} />
          )}

          Save Changes
        </Button>
      </div>
    </div>
  );
}
