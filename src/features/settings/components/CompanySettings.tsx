"use client";

import React, { useState } from "react";
import { Building2, MapPin, Phone, Mail, Hash, Globe, Upload, Image as ImageIcon, Save } from "lucide-react";
import { Input, Button } from "@/components/ui";

export function CompanySettings() {
  const [logo, setLogo] = useState<string | null>(null);

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
          placeholder="Acme Inc."
          defaultValue="Acme Inc."
          prefix={<Building2 className="w-4 h-4 opacity-50" />}
        />

        {/* Company Logo Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Company Logo</label>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center bg-gray-50/50 dark:bg-gray-900/50 overflow-hidden relative group">
              {logo ? (
                <img src={logo} alt="Logo" className="w-full h-full object-cover" />
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
                    if (file) setLogo(URL.createObjectURL(file));
                  }}
                />
                <Button 
                  variant="secondary" 
                  className="h-10 px-4 font-bold text-xs"
                  onClick={() => document.getElementById('logo-upload')?.click()}
                >
                  Choose File
                </Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white h-10 px-4 font-bold text-xs gap-2">
                  <Upload size={14} />
                  Upload
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
            placeholder="123 Business Ave, Suite 100"
            prefix={<MapPin className="w-4 h-4 opacity-50" />}
          />
          <Input
            label="Phone Number"
            placeholder="+1 (555) 000-0000"
            prefix={<Phone className="w-4 h-4 opacity-50" />}
          />
        </div>

        {/* Email and HST Number */}
        <div className="grid gap-6 sm:grid-cols-2">
          <Input
            label="Email Address"
            placeholder="contact@acme.com"
            prefix={<Mail className="w-4 h-4 opacity-50" />}
          />
          <Input
            label="HST Number"
            placeholder="123456789 RT0001"
            prefix={<Hash className="w-4 h-4 opacity-50" />}
          />
        </div>

        {/* Website Link */}
        <Input
          label="Website"
          placeholder="https://acme.com"
          prefix={<Globe className="w-4 h-4 opacity-50" />}
        />
      </div>

      <div className="flex justify-end pt-6">
        <Button
          className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-bold px-8 shadow-lg shadow-emerald-200 dark:shadow-none"
        >
          <Save size={16} />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
