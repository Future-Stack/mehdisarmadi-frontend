import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { TableSkeleton } from "@/components/ui/Skeleton";

export const metadata: Metadata = { title: "Users" };

const UsersTable = dynamic(
  () => import("@/features/users/components/UsersTable"),
  { loading: () => <TableSkeleton rows={8} /> }
);

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Users
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage all registered accounts on your platform.
        </p>
      </div>
      <UsersTable />
    </div>
  );
}
