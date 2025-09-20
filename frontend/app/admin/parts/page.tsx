'use client';

import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import LogoutButton from "@/components/LogoutButton";
import Modal from "react-modal";
import Image from "next/image";
import { NormalizedPart, ProductImage } from "@/lib/types";
import { deleteFromCloudinary, getPublicIdFromUrl, uploadToCloudinary } from "@/lib/cloudinary";

/**
 * Note: this file expects the backend parts endpoints to:
 * - GET  /parts/parts-admin/?page=...  -> paginated list with fields including new_category (id) and images, image_url, etc.
 * - POST /parts/parts-admin/           -> create product, send new_category as ID
 * - PUT  /parts/parts-admin/:id/       -> update product
 * - DELETE /parts/parts-admin/:id/
 *
 * Category endpoints:
 * - GET  /parts/categories/            -> list (paginated or not)
 * - POST /parts/categories/
 * - PUT  /parts/categories/:id/
 * - DELETE /parts/categories/:id/
 *
 * This component converts text inputs to numbers before sending.
 */

/* ---------- Local interfaces ---------- */
interface RawPart {
    id: number;
    make?: string;
    model?: string;
    year_start?: number;
    year_end?: number;
    slug?: string;
    name?: string;
    category?: string;
    new_category?: number | null | { id?: number, name?: string };
    price?: number;
    stars?: number | null;
    stock_status?: boolean;
    image_url?: string;
    warranty?: number;
    delivery_days?: number;
    return_days?: number;
    description?: string;
    images?: ProductImage[];
    trim?: string;
    drive_type?: string;
    body_class?: string;
}

interface EditablePart extends NormalizedPart {
    imagesFiles?: File[];
    imagesUrls?: string[];
}

/* Minimal Category shape used on frontend */
interface Category {
    id?: number;
    name: string;
    slug?: string;
    parent?: number | null;
}

/* ---------- Component ---------- */
export default function PartsAdminPage() {
    const { loading, authenticated } = useAuth();
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

    // --- Parts state ---
    const [parts, setParts] = useState<NormalizedPart[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingPart, setEditingPart] = useState<EditablePart | null>(null);
    const [form, setForm] = useState<Partial<NormalizedPart> & { imagesFiles?: File[] }>({
        name: "",
        new_category: 0,
        price: "",
        stars: "",
        stock_status: true,
        warranty: "",
        delivery_days: "",
        return_days: "",
        description: "",
        imagesFiles: []
    });
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);

    // --- Categories state ---
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    // --- Load Parts ---
    const loadParts = React.useCallback(async () => {
        try {
            const res = await fetchWithAuth(`${API}/parts/parts-admin/?page=${page}&page_size=10`);
            if (!res.ok) return;
            const json = await res.json();
            setCount(json.count || 0);

            const normalized: NormalizedPart[] = (json.results || []).map((item: RawPart) => {
                // new_category can be number or object; normalize to id (number) or null
                let newCatId: number | null = null;
                if (typeof item.new_category === "number") newCatId = item.new_category;
                else if (item.new_category && typeof item.new_category === "object" && "id" in item.new_category) newCatId = Number((item.new_category as { id?: number }).id);
                // fallback to null
                return {
                    id: item.id,
                    productId: item.id,
                    slug: item.slug ?? "",
                    name: item.name ?? "—",
                    // store new_category as number | null in normalized
                    new_category: newCatId ?? null,
                    // keep numeric fields as strings in frontend state as requested
                    price: (item.price !== undefined && item.price !== null) ? String(item.price) : "",
                    stars: (item.stars !== undefined && item.stars !== null) ? String(item.stars) : null,
                    stock_status: item.stock_status ?? false,
                    image_url: item.image_url ?? "",
                    warranty: (item.warranty !== undefined && item.warranty !== null) ? String(item.warranty) : "",
                    delivery_days: (item.delivery_days !== undefined && item.delivery_days !== null) ? String(item.delivery_days) : "",
                    return_days: (item.return_days !== undefined && item.return_days !== null) ? String(item.return_days) : "",
                    description: item.description ?? "",
                    images: item.images ?? [],
                    // flat part info (fitment) - keep as before
                    make: item.make ?? "",
                    model: item.model ?? "",
                    year_start: item.year_start ?? 0,
                    year_end: item.year_end ?? 0,
                    trim: item.trim ?? undefined,
                    drive_type: item.drive_type ?? undefined,
                    body_class: item.body_class ?? undefined,
                } as NormalizedPart;
            });
            setParts(normalized);
        } catch (err) {
            console.error("loadParts error:", err);
        }
    }, [API, page]);

    // --- Load Categories ---
    const loadCategories = React.useCallback(async () => {
        try {
            const res = await fetchWithAuth(`${API}/parts/categories/?page_size=1000`); // try to fetch all
            if (!res.ok) return;
            const data = await res.json();
            // backend might return paginated or flat list; support both
            const list = data.results ? data.results : data;
            setCategories(list || []);
        } catch (err) {
            console.error("loadCategories error:", err);
        }
    }, [API]);

    useEffect(() => {
        if (authenticated) {
            loadParts();
            loadCategories();
        }
    }, [authenticated, loadParts, loadCategories]);

    // ---------- Helpers ----------
    const safeNumber = (v: unknown, fallback = 0) => {
        const n = Number(String(v ?? "").trim());
        return Number.isFinite(n) ? n : fallback;
    };

    // Build a small tree structure for categories
    const buildCategoryTree = () => {
        const map = new Map<number, Category & { children: Category[] }>();
        categories.forEach(c => {
            if (c.id) map.set(c.id, { ...c, children: [] });
        });
        const roots: (Category & { children: Category[] })[] = [];
        map.forEach((node) => {
            if (node.parent && map.has(node.parent)) {
                map.get(node.parent)!.children.push(node);
            } else {
                roots.push(node);
            }
        });
        // sort children by name for stable display
        const sortRec = (nodes: (Category & { children: Category[] })[]) => {
            nodes.sort((a, b) => a.name.localeCompare(b.name));
            nodes.forEach(n => sortRec(n.children as (Category & { children: Category[] })[]));
        };
        sortRec(roots);
        return roots;
    };

    // ---------- Part CRUD ----------
    async function delPart(id: number) {
        try {
            const part = parts.find((p) => p.id === id);
            if (part?.image_url) {
                const publicId = getPublicIdFromUrl(part.image_url);
                if (publicId) await deleteFromCloudinary(publicId);
            }
            const res = await fetchWithAuth(`${API}/parts/parts-admin/${id}/`, { method: "DELETE" });
            if (res.ok) loadParts();
        } catch (err) {
            console.error("delPart error:", err);
        }
    }

    function openEditModal(part: NormalizedPart) {
        setEditingPart({
            ...part,
            imagesUrls: part.images?.map((img) => img.image_url) || []
        });
        setModalOpen(true);
    }
    function closeEditModal() { setModalOpen(false); setEditingPart(null); }

    async function saveEdit() {
        if (!editingPart) return;
        try {
            let imagesUrls = editingPart.imagesUrls || [];

            if (editingPart.imagesFiles?.length) {
                // delete previous images if present
                if (editingPart.imagesUrls) {
                    for (const url of editingPart.imagesUrls) {
                        const publicId = getPublicIdFromUrl(url);
                        if (publicId) await deleteFromCloudinary(publicId);
                    }
                }
                imagesUrls = [];
                for (const file of editingPart.imagesFiles) {
                    const uploadedUrl = await uploadToCloudinary(file);
                    imagesUrls.push(uploadedUrl);
                }
            }

            // convert text fields to numbers before POST/PUT
            const payload = {
                name: editingPart.name,
                new_category: editingPart.new_category ? Number(editingPart.new_category) : null,
                price: safeNumber(editingPart.price, 0),
                stars: editingPart.stars !== null && editingPart.stars !== undefined ? safeNumber(editingPart.stars, 0) : null,
                stock_status: !!editingPart.stock_status,
                warranty: safeNumber(editingPart.warranty, 0),
                delivery_days: safeNumber(editingPart.delivery_days, 0),
                return_days: safeNumber(editingPart.return_days, 0),
                description: editingPart.description,
                image_url: imagesUrls[0] ?? "",
                images: imagesUrls.map((url) => ({ image_url: url, alt_text: "" })),
            };

            const res = await fetchWithAuth(`${API}/parts/parts-admin/${editingPart.productId}/`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (res.ok) { closeEditModal(); loadParts(); }
        } catch (err) {
            console.error("saveEdit error:", err);
        }
    }

    async function createPart(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            const imagesUrls: string[] = [];
            if (form.imagesFiles?.length) {
                for (const file of form.imagesFiles) imagesUrls.push(await uploadToCloudinary(file));
            }

            const payload = {
                name: form.name,
                new_category: form.new_category ? Number(form.new_category) : null,
                price: safeNumber(form.price, 0),
                stars: form.stars !== null && form.stars !== undefined && form.stars !== "" ? safeNumber(form.stars, 0) : null,
                stock_status: !!form.stock_status,
                warranty: safeNumber(form.warranty, 0),
                delivery_days: safeNumber(form.delivery_days, 0),
                return_days: safeNumber(form.return_days, 0),
                description: form.description,
                image_url: imagesUrls[0] ?? "",
                images: imagesUrls.map((url) => ({ image_url: url, alt_text: "" })),
            };

            const res = await fetchWithAuth(`${API}/parts/parts-admin/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                setForm({
                    name: "",
                    new_category: 0,
                    price: "",
                    stars: "",
                    stock_status: true,
                    warranty: "",
                    delivery_days: "",
                    return_days: "",
                    description: "",
                    imagesFiles: []
                });
                setImagePreviews([]);
                loadParts();
            } else {
                const txt = await res.text();
                console.error("createPart failed:", res.status, txt);
            }
        } catch (err) {
            console.error("createPart error:", err);
        }
    }

    // ---------- Category CRUD ----------
    async function saveCategory() {
        if (!editingCategory) return;
        try {
            const method = editingCategory.id ? 'PUT' : 'POST';
            const url = editingCategory.id ? `${API}/parts/categories/${editingCategory.id}/` : `${API}/parts/categories/`;
            const res = await fetchWithAuth(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingCategory),
            });
            if (res.ok) { setCategoryModalOpen(false); setEditingCategory(null); await loadCategories(); }
            else {
                console.error("saveCategory failed", await res.text());
            }
        } catch (err) {
            console.error("saveCategory error:", err);
        }
    }

    async function deleteCategory(id: number) {
        try {
            const res = await fetchWithAuth(`${API}/parts/categories/${id}/`, { method: "DELETE" });
            if (res.ok) loadCategories();
        } catch (err) {
            console.error("deleteCategory error:", err);
        }
    }

    if (loading) return <p className="p-8">Loading…</p>;
    if (!authenticated) return null;

    const categoryTree = buildCategoryTree();

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <LogoutButton />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT: Category tree + management */}
                <div className="col-span-1 bg-white p-4 rounded shadow w-full">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-semibold">Categories</h2>
                        <button
                            onClick={() => { setEditingCategory({ name: "", parent: null }); setCategoryModalOpen(true); }}
                            className="bg-green-600 text-white px-3 py-1 rounded"
                        >
                            Add
                        </button>
                    </div>

                    {/* Simple tree view */}
                    <div className="space-y-2 max-h-[420px] overflow-auto">
                        {categoryTree.length === 0 && <div className="text-sm text-gray-500">No categories</div>}
                        {categoryTree.map(root => (
                            <CategoryNode
                                key={root.id}
                                node={root}
                                onEdit={(c) => { setEditingCategory({ id: c.id, name: c.name, parent: c.parent ?? null }); setCategoryModalOpen(true); }}
                                onDelete={(id) => id !== undefined && deleteCategory(id)}
                            />
                        ))}
                    </div>
                </div>

                {/* MIDDLE & RIGHT: Add Part Form & Parts Table */}
                <div className="col-span-2 w-full">
                    {/* Add Part Form */}
                    <div className="bg-white p-4 rounded shadow mb-6 w-full">
                        <h2 className="text-lg font-semibold mb-3">Add Part</h2>
                        <form onSubmit={createPart} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label className="mb-1">Name<span className="text-red-500">*</span></label>
                                <input className="border rounded-md p-3" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                            </div>

                            <div className="flex flex-col">
                                <label className="mb-1">Category (sub-category)<span className="text-red-500">*</span></label>
                                <select
                                    className="border rounded-md p-3"
                                    value={form.new_category ?? 0}
                                    onChange={(e) => setForm({ ...form, new_category: Number(e.target.value) })}
                                    required
                                >
                                    <option value={0}>Select sub-category</option>
                                    {categories.filter(c => c.parent !== null).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>

                            <div className="flex flex-col">
                                <label className="mb-1">Price<span className="text-red-500">*</span></label>
                                {/* text input but will be converted on submit */}
                                <input type="text" className="border rounded-md p-3" value={form.price ?? ""} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                            </div>

                            <div className="flex flex-col">
                                <label className="mb-1">Stars</label>
                                <input type="text" className="border rounded-md p-3" value={form.stars ?? ""} onChange={(e) => setForm({ ...form, stars: e.target.value })} />
                            </div>

                            <div className="flex flex-col">
                                <label className="mb-1">Images<span className="text-red-500">*</span></label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="border rounded-md p-3"
                                    onChange={(e) => {
                                        const files = e.target.files ? Array.from(e.target.files) : [];
                                        setForm({ ...form, imagesFiles: files });
                                        const previews: string[] = [];
                                        files.forEach(file => {
                                            const reader = new FileReader();
                                            reader.onload = (ev) => {
                                                if (ev.target?.result) { previews.push(ev.target.result as string); setImagePreviews([...previews]); }
                                            };
                                            reader.readAsDataURL(file);
                                        });
                                    }}
                                    required
                                />
                                <div className="flex gap-2 mt-2 flex-wrap">
                                    {imagePreviews.map((url, idx) => <Image key={idx} src={url} alt={`Preview ${idx}`} width={80} height={80} className="h-20 w-20 object-cover rounded" />)}
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 mt-2">
                                <input type="checkbox" checked={form.stock_status} onChange={(e) => setForm({ ...form, stock_status: e.target.checked })} />
                                <label>In Stock</label>
                            </div>

                            <div className="flex flex-col">
                                <label>Warranty (years)</label>
                                <input type="text" className="border p-2" value={form.warranty ?? ""} onChange={(e) => setForm({ ...form, warranty: e.target.value })} />
                            </div>

                            <div className="flex flex-col">
                                <label>Delivery Days</label>
                                <input type="text" className="border p-2" value={form.delivery_days ?? ""} onChange={(e) => setForm({ ...form, delivery_days: e.target.value })} />
                            </div>

                            <div className="flex flex-col">
                                <label>Return Days</label>
                                <input type="text" className="border p-2" value={form.return_days ?? ""} onChange={(e) => setForm({ ...form, return_days: e.target.value })} />
                            </div>

                            <div className="flex flex-col md:col-span-2">
                                <label>Description</label>
                                <textarea className="border p-2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
                            </div>

                            <div className="md:col-span-2">
                                <button className="w-full md:w-auto bg-green-600 text-white p-3 rounded-md font-semibold">Add Part</button>
                            </div>
                        </form>
                    </div>

                    {/* Parts Table */}
                    <div className="bg-white p-2 sm:p-4 rounded shadow w-full">
                        <h2 className="text-lg font-semibold mb-3">Parts</h2>
                        <div className="overflow-x-auto w-full">
                            <table className="min-w-[600px] w-full border-collapse border text-xs sm:text-sm">
                                <thead>
                                <tr className="bg-gray-100">
                                    <th className="border p-2">Image</th>
                                    <th className="border p-2">Name</th>
                                    <th className="border p-2">Category</th>
                                    <th className="border p-2">Price</th>
                                    <th className="border p-2">Stars</th>
                                    <th className="border p-2">Stock</th>
                                    <th className="border p-2">Warranty</th>
                                    <th className="border p-2">Delivery</th>
                                    <th className="border p-2">Return</th>
                                    <th className="border p-2">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {parts.map(p => (
                                    <tr key={p.id} className="hover:bg-gray-50">
                                        <td className="border p-2">
                                            {p.image_url ? <Image src={p.image_url} alt={p.name} width={48} height={48} className="h-12 w-12 object-cover rounded" /> : '—'}
                                        </td>
                                        <td className="border p-2 break-words max-w-[120px]">{p.name}</td>
                                        <td className="border p-2 break-words max-w-[120px]">
                                            {(() => {
                                                const cat = categories.find(c => c.id === Number(p.new_category));
                                                return cat ? cat.name : '—';
                                            })()}
                                        </td>
                                        <td className="border p-2">{p.price}</td>
                                        <td className="border p-2">{p.stars ?? '—'}</td>
                                        <td className="border p-2">{p.stock_status ? 'Yes' : 'No'}</td>
                                        <td className="border p-2">{p.warranty}</td>
                                        <td className="border p-2">{p.delivery_days}</td>
                                        <td className="border p-2">{p.return_days}</td>
                                        <td className="border p-2 space-x-2 flex flex-col sm:flex-row gap-2">
                                            <button onClick={() => openEditModal(p)}
                                                    className="w-full sm:w-auto px-2 py-1 bg-blue-600 text-white rounded">Edit
                                            </button>
                                            <button onClick={() => delPart(p.id)}
                                                    className="w-full sm:w-auto px-2 py-1 bg-red-600 text-white rounded">Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination Controls */}
                        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2 w-full">
                            <button
                                disabled={page <= 1}
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                className={`px-3 py-1 rounded ${page <= 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 text-white"}`}
                            >
                                Previous
                            </button>

                            <span className="text-sm">
                               Page {page} of {Math.ceil(count / 10) || 1}
                            </span>

                            <button
                                disabled={page >= Math.ceil(count / 10)}
                                onClick={() => setPage(p => p + 1)}
                                className={`px-3 py-1 rounded ${page >= Math.ceil(count / 10) ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 text-white"}`}
                            >
                                Next
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* --- Modals --- */}
            {/* Edit Part Modal */}
            <Modal ariaHideApp={false} isOpen={modalOpen} onRequestClose={closeEditModal} contentLabel="Edit Part" className="bg-white p-6 max-w-lg mx-auto mt-20 rounded shadow-lg z-50" overlayClassName="fixed inset-0 bg-black bg-opacity-50">
                {editingPart && (
                    <div className="grid gap-3">
                        <h2 className="text-xl font-bold mb-2">Edit Part</h2>
                        <input className="border p-2" value={editingPart.name} onChange={(e) => setEditingPart({ ...editingPart, name: e.target.value })} />
                        <div>
                            <label className="block mb-1">Category (sub-category)</label>
                            <select className="border p-2 w-full" value={editingPart.new_category ?? 0} onChange={(e) => setEditingPart({ ...editingPart, new_category: Number(e.target.value) })}>
                                <option value={0}>Select sub-category</option>
                                {categories.filter(c => c.parent !== null).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        {/* text inputs for numbers (converted on save) */}
                        <input type="text" className="border p-2" placeholder="Price" value={editingPart.price ?? ""} onChange={(e) => setEditingPart({ ...editingPart, price: e.target.value })} />
                        <input type="text" className="border p-2" placeholder="Stars" value={editingPart.stars ?? ""} onChange={(e) => setEditingPart({ ...editingPart, stars: e.target.value })} />
                        <input type="text" className="border p-2" placeholder="Warranty" value={editingPart.warranty ?? ""} onChange={(e) => setEditingPart({ ...editingPart, warranty: e.target.value })} />
                        <input type="text" className="border p-2" placeholder="Delivery Days" value={editingPart.delivery_days ?? ""} onChange={(e) => setEditingPart({ ...editingPart, delivery_days: e.target.value })} />
                        <input type="text" className="border p-2" placeholder="Return Days" value={editingPart.return_days ?? ""} onChange={(e) => setEditingPart({ ...editingPart, return_days: e.target.value })} />
                        <div className="flex items-center gap-2">
                            <input type="checkbox" checked={editingPart.stock_status} onChange={(e) => setEditingPart({ ...editingPart, stock_status: e.target.checked })} />
                            <label>In Stock</label>
                        </div>
                        <textarea className="border p-2" placeholder="Description" value={editingPart.description ?? ""} onChange={(e) => setEditingPart({ ...editingPart, description: e.target.value })} rows={3} />
                        <div className="flex flex-wrap gap-2 mt-2">
                            {editingPart.imagesUrls?.map((url, idx) => <Image key={idx} src={url} alt={`Edit ${idx}`} width={80} height={80} className="h-20 w-20 object-cover rounded" />)}
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button onClick={closeEditModal} className="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
                            <button onClick={saveEdit} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Category Modal */}
            <Modal ariaHideApp={false} isOpen={categoryModalOpen} onRequestClose={() => { setCategoryModalOpen(false); setEditingCategory(null); }} contentLabel="Edit Category" className="bg-white p-6 max-w-md mx-auto mt-20 rounded shadow-lg z-50" overlayClassName="fixed inset-0 bg-black bg-opacity-50">
                {editingCategory && (
                    <div className="flex flex-col gap-2">
                        <h2 className="text-xl font-bold">{editingCategory.id ? 'Edit' : 'Add'} Category</h2>
                        <input type="text" placeholder="Category Name" className="border p-2 rounded" value={editingCategory.name} onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })} />
                        <select className="border p-2 rounded" value={editingCategory.parent ?? ''} onChange={(e) => setEditingCategory({ ...editingCategory, parent: Number(e.target.value) || null })}>
                            <option value="">No Parent</option>
                            {categories.filter(c => !c.parent).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <div className="flex justify-end gap-2 mt-2">
                            <button onClick={() => { setCategoryModalOpen(false); setEditingCategory(null); }} className="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
                            <button onClick={saveCategory} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

/* ---------- Small CategoryTree Node component (inline) ---------- */
function CategoryNode({
                          node,
                          onEdit,
                          onDelete
                      }: {
    node: Category & { children: Category[] },
    onEdit: (c: Category) => void,
    onDelete: (id?: number) => void
}) {
    const [open, setOpen] = useState(true);
    return (
        <div className="pl-1">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {node.children.length > 0 && (
                        <button onClick={() => setOpen(s => !s)} className="text-sm px-1">
                            {open ? '▾' : '▸'}
                        </button>
                    )}
                    <div className="font-medium">{node.name}</div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => onEdit(node)} className="text-xs px-2 py-1 bg-blue-600 text-white rounded">Edit</button>
                    {node.id && <button onClick={() => onDelete(node.id)} className="text-xs px-2 py-1 bg-red-600 text-white rounded">Delete</button>}
                </div>
            </div>
            {open && node.children.length > 0 && (
                <div className="pl-6 mt-2 space-y-2">
                    {node.children.map(child => (
                        <div key={child.id} className="flex items-center justify-between">
                            <div className="text-sm">{child.name}</div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => onEdit(child)} className="text-xs px-2 py-1 bg-blue-600 text-white rounded">Edit</button>
                                {child.id && <button onClick={() => onDelete(child.id)} className="text-xs px-2 py-1 bg-red-600 text-white rounded">Delete</button>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
