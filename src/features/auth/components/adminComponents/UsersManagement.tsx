"use client";

import { useState } from "react";
import { Eye, UserMinus, Trash2, Plus, ChevronDown } from "lucide-react";
import StaticPage from "@/components/layout/StaticDemoPage";
import { Modal } from "@/components/ui/Modal";

// ─── Types ────────────────────────────────────────────────────────────────────

type UserRole = "Admin" | "User";
type UserStatus = "Active" | "Suspended";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joinedDate: string;
}

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const USERS: AdminUser[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
    joinedDate: "2026-01-15",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "User",
    status: "Active",
    joinedDate: "2026-01-15",
  },
  {
    id: "3",
    name: "Mike Wilson",
    email: "mike@example.com",
    role: "User",
    status: "Active",
    joinedDate: "2026-01-15",
  },
  {
    id: "4",
    name: "Emma Davis",
    email: "emma@example.com",
    role: "User",
    status: "Suspended",
    joinedDate: "2026-01-15",
  },
  {
    id: "5",
    name: "David Brown",
    email: "david@example.com",
    role: "Admin",
    status: "Active",
    joinedDate: "2026-01-15",
  },
];

// ─── Badges ───────────────────────────────────────────────────────────────────

function RoleBadge({ role }: { role: UserRole }) {
  if (role === "Admin") {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-md text-[13px] font-semibold whitespace-nowrap bg-[#F3E8FF] text-[#6B21A8] dark:bg-purple-900/30 dark:text-purple-400">
        {role}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-md text-[13px] font-semibold whitespace-nowrap bg-[#E5E7EB] text-[#374151] dark:bg-gray-800 dark:text-gray-300">
      {role}
    </span>
  );
}

function StatusBadge({ status }: { status: UserStatus }) {
  if (status === "Active") {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-md text-[13px] font-semibold whitespace-nowrap bg-[#DCFCE7] text-[#166534] dark:bg-green-900/30 dark:text-green-400">
        {status}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-md text-[13px] font-semibold whitespace-nowrap bg-[#FEE2E2] text-[#991B1B] dark:bg-red-900/30 dark:text-red-400">
      {status}
    </span>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function UsersManagement() {
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <StaticPage 
          title="Users Management" 
          description="Manage user accounts, roles, and permissions" 
        />
        <button
          type="button"
          onClick={() => setIsAddUserModalOpen(true)}
          className="inline-flex items-center gap-2 self-start rounded-lg bg-secondary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 active:bg-secondary/80"
        >
          <Plus size={16} strokeWidth={2.5} />
          Add User
        </button>
      </div>

      {/* ── Table Card ── */}
      <div className="card-premium overflow-hidden mt-2">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-white dark:bg-gray-900 dark:border-gray-800">
                {["Name", "Email", "Role", "Status", "Joined Date", "Actions"].map((heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="whitespace-nowrap px-6 py-4 text-left text-[14px] font-bold text-gray-600 dark:text-gray-400"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white dark:bg-gray-950 dark:divide-gray-800 transition-colors">
              {USERS.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors"
                >
                  <td className="whitespace-nowrap px-6 py-5 text-[15px] font-medium text-gray-800 dark:text-white transition-colors">
                    {user.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-5 text-[15px] text-gray-600 dark:text-gray-400 transition-colors">
                    {user.email}
                  </td>
                  <td className="whitespace-nowrap px-6 py-5">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-5">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-5 text-[15px] text-gray-600 dark:text-gray-400 transition-colors">
                    {user.joinedDate}
                  </td>
                  <td className="whitespace-nowrap px-6 py-5">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        aria-label="View user"
                        className="text-secondary transition-colors hover:text-secondary/80 focus:outline-none"
                      >
                        <Eye size={18} strokeWidth={2.5} />
                      </button>
                      <button
                        type="button"
                        aria-label="Manage user role"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsSuspendModalOpen(true);
                        }}
                        className="text-orange-500 transition-colors hover:text-orange-600 focus:outline-none"
                      >
                        <UserMinus size={18} strokeWidth={2.5} />
                      </button>
                      <button
                        type="button"
                        aria-label="Delete user"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsDeleteModalOpen(true);
                        }}
                        className="text-red-500 transition-colors hover:text-red-600 focus:outline-none"
                      >
                        <Trash2 size={18} strokeWidth={2.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* ── Add User Modal ── */}
      <Modal
        open={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        title="Add New User"
        size="md"
      >
        <div className="mt-4 space-y-5">
          <hr className="border-gray-100 dark:border-gray-800 transition-colors" />
          
          <div className="space-y-4">
            {/* Name Field */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Name</label>
              <input 
                type="text" 
                placeholder="Enter full name"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-colors"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Email</label>
              <input 
                type="email" 
                placeholder="Enter email address"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-colors"
              />
            </div>

            {/* Role Field */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Role</label>
              <div className="relative">
                <select className="w-full appearance-none rounded-lg border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-colors cursor-pointer">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button className="w-full rounded-lg bg-secondary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 active:bg-secondary/80">
              Add User
            </button>
          </div>
        </div>
      </Modal>
      {/* ── Suspend User Modal ── */}
      <Modal
        open={isSuspendModalOpen}
        onClose={() => {
          setIsSuspendModalOpen(false);
          setSelectedUser(null);
        }}
        title="Suspend User"
        size="md"
      >
        <div className="mt-4 space-y-6">
          <p className="text-gray-600 dark:text-gray-400 transition-colors">
            Are you sure you want to suspend <span className="font-semibold text-gray-900 dark:text-white">{selectedUser?.name}</span>? This will temporarily restrict their access to the platform.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={() => {
                setIsSuspendModalOpen(false);
                setSelectedUser(null);
              }}
              className="flex-1 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700">
              Suspend
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Delete User Modal ── */}
      <Modal
        open={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        title="Delete User"
        size="md"
      >
        <div className="mt-4 space-y-6">
          <p className="text-gray-600 dark:text-gray-400 transition-colors">
            Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-white">{selectedUser?.name}</span>? This action cannot be undone.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedUser(null);
              }}
              className="flex-1 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700">
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
