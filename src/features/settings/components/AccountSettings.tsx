"use client";

import React from "react";
import { User, Mail, Lock, LogOut, Save } from "lucide-react";
import { Input, Button } from "@/components/ui";

export function AccountSettings() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400">
          <User size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Account Settings</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage your personal account information</p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Input
          label="Full Name"
          placeholder="John Doe"
          defaultValue="John Doe"
          prefix={<User className="w-4 h-4 opacity-50" />}
        />
        <Input
          label="Email Address"
          placeholder="john.doe@example.com"
          defaultValue="john.doe@example.com"
          prefix={<Mail className="w-4 h-4 opacity-50" />}
        />
      </div>

      <div className="space-y-6 pt-6 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Lock size={16} className="text-gray-400" />
          <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Change Password</h4>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <Input
            label="Current Password"
            type="password"
            placeholder="********"
            prefix={<Lock className="w-4 h-4 opacity-50" />}
          />
          <Input
            label="New Password"
            type="password"
            placeholder="********"
            prefix={<Lock className="w-4 h-4 opacity-50" />}
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="********"
            prefix={<Lock className="w-4 h-4 opacity-50" />}
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-6">
        <Button
          variant="secondary"
          className="text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-100 gap-2 font-bold px-6"
        >
          <LogOut size={16} />
          Logout
        </Button>
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
