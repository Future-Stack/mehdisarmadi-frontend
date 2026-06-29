"use client"

import StaticPage from "@/components/layout/StaticDemoPage";
import { useDeleteDivisionMutation } from "@/store/api/admin/Dashboard/Division/deleteDivision";
import { Division, useGetDivisionsQuery } from "@/store/api/admin/Dashboard/Division/getDivision";
import { useGetDivisionByIdQuery } from "@/store/api/admin/Dashboard/Division/getDivisionbyId";
import { useUpdateDivisionMutation } from "@/store/api/admin/Dashboard/Division/updateDivision";
import { ChevronLeft, ChevronRight, Edit, Eye, Loader, Plus, Search, Trash, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import DivisionCreateModal from "./CreateDivision";

function ViewModal({ id, onClose }: { id: string; onClose: () => void }) {
    const { data, isLoading } = useGetDivisionByIdQuery(id);
    const division = data?.data;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">Division</p>
                        <h2 className="text-lg font-bold text-slate-800 mt-0.5">Details</h2>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                        <X />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-10 text-slate-400">
                            <Loader />
                            <span className="ml-2 text-sm">Loading…</span>
                        </div>
                    ) : division ? (
                        <dl className="space-y-4">
                            {[
                                { label: "Code", value: division.code },
                                { label: "Name", value: division.name },
                                { label: "Description", value: division.description },
                                { label: "Created", value: new Date(division.createdAt).toLocaleString() },
                                { label: "Updated", value: new Date(division.updatedAt).toLocaleString() },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex gap-4">
                                    <dt className="w-28 shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-400 pt-0.5">{label}</dt>
                                    <dd className="text-sm text-slate-700 font-medium break-words">{value}</dd>
                                </div>
                            ))}
                        </dl>
                    ) : (
                        <p className="text-sm text-slate-500 py-6 text-center">No data found.</p>
                    )}
                </div>

                <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

function EditModal({ division, onClose }: { division: Division; onClose: () => void }) {
    const [form, setForm] = useState({
        code: division.code,
        name: division.name,
        description: division.description,
    });
    const [updateDivision, { isLoading }] = useUpdateDivisionMutation();

    const handleSubmit = async () => {
        const toastId = toast.loading("Saving changes…");
        try {
            await updateDivision({ id: division.id, ...form }).unwrap();
            toast.success("Division updated", {
                id: toastId,
                description: `"${form.name}" has been saved.`,
            });
            onClose();
        } catch {
            toast.error("Update failed", {
                id: toastId,
                description: "Something went wrong. Please try again.",
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">Division</p>
                        <h2 className="text-lg font-bold text-slate-800 mt-0.5">Edit Details</h2>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                        <X />
                    </button>
                </div>

                <div className="px-6 py-5 space-y-4">
                    {(["code", "name", "description"] as const).map((field) => (
                        <div key={field}>
                            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5 capitalize">
                                {field}
                            </label>
                            {field === "description" ? (
                                <textarea
                                    rows={3}
                                    value={form[field]}
                                    onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none transition"
                                />
                            ) : (
                                <input
                                    type="text"
                                    value={form[field]}
                                    onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                                />
                            )}
                        </div>
                    ))}
                </div>

                <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors flex items-center gap-2"
                    >
                        {isLoading && <Loader />}
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}

function DeleteModal({ division, onClose }: { division: Division; onClose: () => void }) {
    const [deleteDivision, { isLoading }] = useDeleteDivisionMutation();

    const handleDelete = async () => {
        const toastId = toast.loading("Deleting division…");
        try {
            await deleteDivision(division.id).unwrap();
            toast.success("Division deleted", {
                id: toastId,
                description: `"${division.name}" was removed.`,
            });
            onClose();
        } catch {
            toast.error("Delete failed", {
                id: toastId,
                description: "Something went wrong. Please try again.",
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200 overflow-hidden">
                <div className="px-6 pt-6 pb-4">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mb-4">
                        <Trash />
                    </div>
                    <h2 className="text-base font-bold text-slate-800">Delete Division</h2>
                    <p className="mt-1.5 text-sm text-slate-500">
                        Are you sure you want to delete{" "}
                        <span className="font-semibold text-slate-700">{division.name}</span>? This action cannot be undone.
                    </p>
                </div>
                <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 transition-colors flex items-center gap-2"
                    >
                        {isLoading && <Loader />}
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

type Modal =
    | { type: "create" }
    | { type: "view"; id: string }
    | { type: "edit"; division: Division }
    | { type: "delete"; division: Division }
    | null;

export default function DivisionsPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [modal, setModal] = useState<Modal>(null);

    const limit = 10;
    const { data, isLoading, isFetching } = useGetDivisionsQuery({
        page,
        limit,
        search,
    });

    const divisions = data?.data.items ?? [];
    const totalPages = data?.data?.totalPages ?? 1;
    const total = data?.data?.total ?? 0;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        setSearch(searchInput.trim());
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="">

                {/* Page Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <StaticPage
                        title="Divisions"
                        description="Manage organisational divisions and their details."
                    />

                    <button
                        onClick={() => setModal({ type: "create" })}
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
                    >
                        <Plus size={18} />
                        New Division
                    </button>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <form onSubmit={handleSearch} className="relative w-full sm:w-72">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <Search />
                        </span>
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => {
                                setSearchInput(e.target.value);

                                if (e.target.value.trim() === "") {
                                    setPage(1);
                                    setSearch("");
                                }
                            }}
                            placeholder="Search divisions…"
                            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent shadow-sm transition"
                        />
                    </form>

                    {total > 0 && (
                        <p className="text-xs text-slate-400 shrink-0">
                            {total} division{total !== 1 ? "s" : ""}
                        </p>
                    )}
                </div>

                {/* Table Card */}
                <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/60">
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-400 w-8">#</th>
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-400">Code</th>
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-400">Name</th>
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-400 hidden md:table-cell">Description</th>
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-400 hidden lg:table-cell">Created</th>
                                    <th className="text-right px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {isLoading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <tr key={i}>
                                            {[40, 80, 140, 200, 100, 80].map((w, j) => (
                                                <td key={j} className="px-5 py-4">
                                                    <div className="h-3.5 rounded-full bg-slate-100 animate-pulse" style={{ width: w }} />
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : divisions.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-16 text-slate-400 text-sm">
                                            {search ? `No divisions match "${search}".` : "No divisions found."}
                                        </td>
                                    </tr>
                                ) : (
                                    divisions.map((division, idx) => (
                                        <tr
                                            key={division.id}
                                            className={`group hover:bg-indigo-50/40 transition-colors ${isFetching ? "opacity-60" : ""}`}
                                        >
                                            <td className="px-5 py-4 text-slate-400 text-xs tabular-nums">
                                                {(page - 1) * limit + idx + 1}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-mono font-medium">
                                                    {division.code}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 font-medium text-slate-800">{division.name}</td>
                                            <td className="px-5 py-4 text-slate-500 hidden md:table-cell max-w-xs truncate">
                                                {division.description || <span className="text-slate-300 italic">—</span>}
                                            </td>
                                            <td className="px-5 py-4 text-slate-400 text-xs hidden lg:table-cell tabular-nums">
                                                {new Date(division.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center justify-end gap-1">
                                                    {/* View */}
                                                    <button
                                                        onClick={() => setModal({ type: "view", id: division.id })}
                                                        title="View"
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                                    >
                                                        <Eye />
                                                    </button>
                                                    {/* Edit */}
                                                    <button
                                                        onClick={() => setModal({ type: "edit", division })}
                                                        title="Edit"
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                                                    >
                                                        <Edit />
                                                    </button>
                                                    {/* Delete */}
                                                    <button
                                                        onClick={() => setModal({ type: "delete", division })}
                                                        title="Delete"
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                    >
                                                        <Trash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 bg-slate-50/40">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 disabled:opacity-40 disabled:pointer-events-none transition"
                            >
                                <ChevronLeft /> Previous
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
                                            <span key={`e${i}`} className="px-1 text-xs text-slate-400">…</span>
                                        ) : (
                                            <button
                                                key={p}
                                                onClick={() => setPage(p as number)}
                                                className={`w-7 h-7 rounded-lg text-xs font-medium transition ${page === p
                                                    ? "bg-indigo-600 text-white shadow-sm"
                                                    : "text-slate-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200"
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
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 disabled:opacity-40 disabled:pointer-events-none transition"
                            >
                                Next <ChevronRight />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {modal?.type === "view" && (
                <ViewModal id={modal.id} onClose={() => setModal(null)} />
            )}
            {modal?.type === "edit" && (
                <EditModal division={modal.division} onClose={() => setModal(null)} />
            )}
            {modal?.type === "delete" && (
                <DeleteModal division={modal.division} onClose={() => setModal(null)} />
            )}
            {modal?.type === "create" && (
                <DivisionCreateModal onClose={() => setModal(null)} />
            )}
        </div>
    );
}