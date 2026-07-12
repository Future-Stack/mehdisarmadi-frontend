
"use client";

import { useState } from "react";
import { Eye, UserMinus, Trash2, Plus, ChevronDown, Search, ChevronLeft, ChevronRight, Loader } from "lucide-react";
import StaticPage from "@/components/layout/StaticDemoPage";
import { Modal } from "@/components/ui/Modal";
import { useGetAdminUsersQuery, type AdminUser } from "@/store/api/admin/Users/getAdminUsers";
import { useGetActiveUsersCountQuery } from "@/store/api/admin/Users/getActiveUsers";
import { useGetUsersCountQuery } from "@/store/api/admin/Users/getUsers";
import { useDeleteUsersMutation } from "@/store/api/admin/Users/deleteUsers";
import { useCreateUserMutation, type CreateUserPayload } from "@/store/api/admin/Users/createUsers";
import { toast } from "sonner";
import { useSuspendUserMutation } from "@/store/api/admin/Users/suspendUser";

function RoleBadge({ role }: { role: AdminUser["role"] }) {
  if (role === "ADMIN") {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-md text-[13px] font-semibold whitespace-nowrap bg-[#8200DB1A] text-[#8200DB] dark:bg-purple-900/30 dark:text-purple-400">
        Admin
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-md text-[13px] font-semibold whitespace-nowrap bg-[#E0E0E0] text-[#616161] dark:bg-gray-800 dark:text-gray-300">
      User
    </span>
  );
}

function StatusBadge({ status }: { status: AdminUser["status"] }) {
  if (status === "active") {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-md text-[13px] font-semibold whitespace-nowrap bg-[#DDFFEB] text-[#008236] dark:bg-green-900/30 dark:text-green-400">
        Active
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-md text-[13px] font-semibold whitespace-nowrap bg-[#E7000B30] text-[#E7000B] dark:bg-red-900/30 dark:text-red-400">
      Suspended
    </span>
  );
}

const emptyForm: CreateUserPayload = {
  fullName: "",
  email: "",
  password: "",
  role: "USER",
};

export default function UsersManagement() {
  // Pagination & search
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const limit = 10;

  // Queries
  const { data, isLoading, isFetching } = useGetAdminUsersQuery({ page, limit, search: search || undefined });
  const { data: totalUsersData } = useGetUsersCountQuery();
  const { data: activeUsersData } = useGetActiveUsersCountQuery();
  const [suspendUser, { isLoading: suspending }] =
    useSuspendUserMutation();

  const users = data?.data.items ?? [];
  const totalPages = data?.data.totalPages ?? 1;
  const totalUsers = totalUsersData?.data.total ?? 0;
  const activeUsers = activeUsersData?.data.total ?? 0;

  // Mutations
  const [createUser, { isLoading: creating }] = useCreateUserMutation();
  const [deleteUsers, { isLoading: deleting }] = useDeleteUsersMutation();

  // Modal state
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  // Add user form state
  const [form, setForm] = useState<CreateUserPayload>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof CreateUserPayload, string>>>({});

  const [isViewModalOpen, setIsViewModalOpen] =
    useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const validateForm = () => {
    const errors: Partial<Record<keyof CreateUserPayload, string>> = {};
    if (!form.fullName.trim()) errors.fullName = "Name is required";
    if (!form.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Invalid email";
    if (!form.password.trim()) errors.password = "Password is required";
    else if (form.password.length < 8) errors.password = "Minimum 8 characters";
    return errors;
  };

  const handleCreateUser = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    const toastId = toast.loading("Creating user…");
    try {
      await createUser(form).unwrap();
      toast.success("User created", {
        id: toastId,
        description: `${form.fullName} has been added successfully.`,
      });
      setIsAddUserModalOpen(false);
      setForm(emptyForm);
      setFormErrors({});
    } catch {
      toast.error("Failed to create user", {
        id: toastId,
        description: "Something went wrong. Please try again.",
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    const toastId = toast.loading("Deleting user…");
    try {
      await deleteUsers({ userIds: [selectedUser.id] }).unwrap();
      toast.success("User deleted", {
        id: toastId,
        description: `${selectedUser.fullName} has been removed.`,
      });
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    } catch {
      toast.error("Failed to delete user", {
        id: toastId,
        description: "Something went wrong. Please try again.",
      });
    }
  };

  const handleSuspendUser = async () => {
    if (!selectedUser) return;

    const toastId = toast.loading("Suspending user...");

    try {
      const res = await suspendUser(selectedUser.id).unwrap();

      toast.success(res.message, {
        id: toastId,
        description: `${selectedUser.fullName} has been suspended.`,
      });

      setIsSuspendModalOpen(false);
      setSelectedUser(null);
    } catch (error: any) {
      toast.error("Failed to suspend user", {
        id: toastId,
        description:
          error?.data?.message ??
          "Something went wrong. Please try again.",
      });
    }
  };

  const handleCloseAddModal = () => {
    setIsAddUserModalOpen(false);
    setForm(emptyForm);
    setFormErrors({});
  };


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

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-gray-900 px-5 py-4 transition-colors">
          <p className="text-xs font-semibold text-[#000000] dark:text-white">Total Users</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{totalUsers}</p>
        </div>
        <div className="rounded-xl border border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-gray-900 px-5 py-4 transition-colors">
          <p className="text-xs font-semibold text-[#000000] dark:text-white">Active Users</p>
          <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">{activeUsers}</p>
        </div>
      </div>

      {/* ── Search ── */}
      <form onSubmit={handleSearch} className="relative w-full sm:w-72">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Search size={16} />
        </span>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search users…"
          className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary shadow-sm transition-colors"
        />
      </form>

      {/* ── Table Card ── */}
      <div className="card-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-white dark:bg-gray-900 dark:border-gray-800">
                {["#", "Name", "Email", "Role", "Status", "Joined Date", "Actions"].map((heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="whitespace-nowrap px-6 py-4 text-left text-[14px] font-bold text-[#4A5565] dark:text-gray-400"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E5E7EB] bg-white dark:bg-gray-950 dark:divide-gray-800 transition-colors">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {[30, 130, 180, 70, 80, 90, 80].map((w, j) => (
                      <td key={j} className="px-6 py-5">
                        <div className="h-3.5 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse" style={{ width: w }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-sm text-gray-400">
                    {search ? `No users match "${search}".` : "No users found."}
                  </td>
                </tr>
              ) : (
                users.map((user, idx) => (
                  <tr
                    key={user.id}
                    className={`hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors ${isFetching ? "opacity-60" : ""}`}
                  >
                    <td className="whitespace-nowrap px-6 py-5 text-[13px] tabular-nums text-gray-400">
                      {(page - 1) * limit + idx + 1}
                    </td>
                    <td className="whitespace-nowrap px-6 py-5 text-[15px] font-medium text-gray-800 dark:text-white">
                      {user.fullName}
                    </td>
                    <td className="whitespace-nowrap px-6 py-5 text-[15px] text-gray-600 dark:text-gray-400">
                      {user.email}
                    </td>
                    <td className="whitespace-nowrap px-6 py-5">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="whitespace-nowrap px-6 py-5">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="whitespace-nowrap px-6 py-5 text-[15px] text-gray-600 dark:text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-5">
                      <div className="flex items-center gap-3">
                        <button onClick={() => {
                          setSelectedUser(user);
                          setIsViewModalOpen(true);
                        }}
                          type="button"
                          aria-label="View user"
                          className="text-secondary transition-colors hover:text-secondary/80 focus:outline-none"
                        >
                          <Eye size={18} strokeWidth={2.5} />
                        </button>
                        <button
                          type="button"
                          aria-label="Suspend user"
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 px-6 py-3.5 bg-gray-50/40 dark:bg-gray-900/40">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 disabled:opacity-40 disabled:pointer-events-none transition"
            >
              <ChevronLeft size={16} /> Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce<(number | "…")[]>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("…");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "…" ? (
                    <span key={`e${i}`} className="px-1 text-xs text-gray-400">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p as number)}
                      className={`w-7 h-7 rounded-lg text-xs font-medium transition ${page === p
                        ? "bg-secondary text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                        }`}
                    >
                      {p}
                    </button>
                  )
                )}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 disabled:opacity-40 disabled:pointer-events-none transition"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* ── Add User Modal ── */}
      <Modal
        open={isAddUserModalOpen}
        onClose={handleCloseAddModal}
        title="Add New User"
        size="md"
      >
        <div className="mt-4 space-y-5">
          <hr className="border-gray-100 dark:border-gray-800 transition-colors" />

          <div className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Name</label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => {
                  setForm((f) => ({ ...f, fullName: e.target.value }));
                  setFormErrors((err) => ({ ...err, fullName: undefined }));
                }}
                placeholder="Enter full name"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-colors"
              />
              {formErrors.fullName && (
                <p className="text-xs text-red-500">{formErrors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => {
                  setForm((f) => ({ ...f, email: e.target.value }));
                  setFormErrors((err) => ({ ...err, email: undefined }));
                }}
                placeholder="Enter email address"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-colors"
              />
              {formErrors.email && (
                <p className="text-xs text-red-500">{formErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => {
                  setForm((f) => ({ ...f, password: e.target.value }));
                  setFormErrors((err) => ({ ...err, password: undefined }));
                }}
                placeholder="Min. 8 characters"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-colors"
              />
              {formErrors.password && (
                <p className="text-xs text-red-500">{formErrors.password}</p>
              )}
            </div>

            {/* Role */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Role</label>
              <div className="relative">
                <select
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as CreateUserPayload["role"] }))}
                  className="w-full appearance-none rounded-lg border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-colors cursor-pointer"
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleCreateUser}
              disabled={creating}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 disabled:opacity-60"
            >
              {creating && <Loader size={14} className="animate-spin" />}
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
            Are you sure you want to suspend{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {selectedUser?.fullName}
            </span>
            ? This will temporarily restrict their access to the platform.
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
            <button
              onClick={handleSuspendUser}
              disabled={suspending || selectedUser?.status === "suspended"}
              className={`flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors
    ${selectedUser?.status === "suspended"
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600"
                }`}
            >
              {suspending && (
                <Loader size={14} className="animate-spin" />
              )}

              {selectedUser?.status === "suspended"
                ? "Already Suspended"
                : "Suspend"}
            </button>
          </div>
        </div>
      </Modal>
      {/* view modal */}
      <Modal
        open={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedUser(null);
        }}
        title="User Details"
      >
        <div className="space-y-3">
          <p><b>Name:</b> {selectedUser?.fullName}</p>
          <p><b>Email:</b> {selectedUser?.email}</p>
          <p><b>Role:</b> {selectedUser?.role}</p>
          <p><b>Status:</b> {selectedUser?.status}</p>
          <p><b>Joined:</b> {selectedUser && new Date(selectedUser.createdAt).toLocaleString()}</p>
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
            Are you sure you want to delete{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {selectedUser?.fullName}
            </span>
            ? This action cannot be undone.
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
            <button
              onClick={handleDeleteUser}
              disabled={deleting}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700 disabled:opacity-60"
            >
              {deleting && <Loader size={14} className="animate-spin" />}
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}