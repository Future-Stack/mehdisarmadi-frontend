"use client";

import { useEffect, useState } from "react";
import { User, Mail, Shield, Loader2, Save, Calendar, CheckCircle2 } from "lucide-react";
import StaticPage from "@/components/layout/StaticDemoPage";
import { useGetProfileQuery, useUpdateProfileMutation } from "@/store/api/profileApi";
import { toast } from "sonner";

export default function Profile() {
  const { data, isLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const profile = data?.data;

  const [fullName, setFullName] = useState("");

  useEffect(() => {
    if (profile?.fullName) {
      setFullName(profile.fullName);
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Full name cannot be empty");
      return;
    }
    
    try {
      const res = await updateProfile({ fullName: fullName.trim() }).unwrap();
      if (res.success) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error(res.message || "Failed to update profile");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "An error occurred during update");
    }
  };

  return (
    <div className="space-y-6">
      <StaticPage 
        title="My Profile" 
        description="View and update your personal information" 
      />

      <div className="card-premium overflow-hidden bg-white dark:bg-[#101828] border border-[#E4E4E7] dark:border-gray-800 rounded-2xl shadow-sm transition-colors">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-16 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-secondary" />
            <p className="text-sm font-medium">Loading profile details...</p>
          </div>
        ) : profile ? (
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-800">
            {/* Left Column: Read-only Data */}
            <div className="p-6 md:col-span-1 space-y-6 bg-gray-50/50 dark:bg-gray-900/30">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-secondary/10 dark:bg-secondary/20 border-2 border-secondary/20 flex items-center justify-center">
                  <User size={28} className="text-secondary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">{profile.fullName}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{profile.role.toLowerCase()}</p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                    <Mail size={16} />
                    <span>Email Address</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-200">
                      {profile.email}
                    </span>
                    {profile.isEmailVerified && (
                      <CheckCircle2 size={16} className="text-green-500" />
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                    <Shield size={16} />
                    <span>Account Status</span>
                  </div>
                  <span className={`inline-flex w-fit px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                    profile.status === "active" 
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}>
                    {profile.status}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                    <Calendar size={16} />
                    <span>Member Since</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-200">
                    {new Date(profile.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Update Form */}
            <div className="p-6 md:col-span-2">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Edit Information</h2>
              <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
                <div className="space-y-1.5">
                  <label htmlFor="fullName" className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full h-11 px-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
                    required
                  />
                </div>
                
                {/* Other fields are not allowed by the endpoint per user's prompt, so we only include fullName */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-sm font-bold text-gray-400 dark:text-gray-500">
                    Email Address (Read-only)
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={profile.email}
                    readOnly
                    disabled
                    className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 text-sm text-gray-500 dark:text-gray-400 cursor-not-allowed transition-all"
                  />
                  <p className="text-xs text-gray-400 mt-1">Please contact support to change your email.</p>
                </div>

                <div className="pt-4 flex">
                  <button
                    type="submit"
                    disabled={isUpdating || fullName.trim() === profile.fullName}
                    className="inline-flex items-center justify-center gap-2 px-6 h-11 rounded-xl bg-secondary text-sm font-bold text-white shadow-sm hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isUpdating ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}
                    {isUpdating ? "Saving Changes..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-16 text-red-500">
            <p className="text-sm font-bold mb-2">Error loading profile data</p>
            <p className="text-xs text-gray-500">Please try refreshing the page.</p>
          </div>
        )}
      </div>
    </div>
  );
}
