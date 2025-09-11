"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import LogoutButton from "@/components/LogoutButton";
import Modal from "react-modal";
import Image from "next/image";

import {NormalizedPart, ProductImage} from "@/lib/types";
import {
    deleteFromCloudinary,
    getPublicIdFromUrl,
    uploadToCloudinary,
} from "@/lib/cloudinary";

interface RawPart {
    id: number;
    make?: string;
    model?: string;
    year_start?: number;
    year_end?: number;
    slug?: string;
    name?: string;
    category?: string;
    price?: number;
    stars?: number | null;
    stock_status?: boolean;
    image_url?: string;
    warranty?: number;
    delivery_days?: number;
    return_days?: number;
    description?: string;
    images?: ProductImage[];
}

const CATEGORY_OPTIONS = [
    "Body Parts",
    "Exterior",
    "Interior",
    "Audio & Electronics",
    "Parts",
    "Performance",
    "Lighting",
    "Uncategorized",
];

const CATEGORY_KEYS = [
    "body",
    "exterior",
    "interior",
    "audio",
    "parts",
    "performance",
    "lighting",
    "uncategorized",
];

interface EditablePart extends NormalizedPart {
    imagesFiles?: File[];
    imagesUrls?: string[];
}

export default function PartsAdminPage() {
    const { loading, authenticated } = useAuth();
    const [parts, setParts] = useState<NormalizedPart[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingPart, setEditingPart] = useState<EditablePart | null>(null);

    const [form, setForm] = useState<
        Partial<NormalizedPart> & { imagesFiles?: File[] }
    >({
        name: "",
        category: "",
        price: 0,
        stars: 0,
        stock_status: true,
        warranty: 0,
        delivery_days: 0,
        return_days: 0,
        description: "",
        imagesFiles: [],
    });
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

    const loadParts = React.useCallback(async () => {
        const res = await fetchWithAuth(`${API}/parts/parts-admin/`);
        if (!res.ok) return;

        const json = await res.json();
        const data = Array.isArray(json) ? json : json.results || [];

        const normalized: NormalizedPart[] = data.map((item: RawPart) => ({
            id: item.id,
            make: item.make ?? "",
            model: item.model ?? "",
            year_start: item.year_start ?? 0,
            year_end: item.year_end ?? 0,

            productId: item.id,
            name: item.name ?? "—",
            slug: item.slug ?? "",
            category: item.category ?? "uncategorized",
            price: item.price ?? 0,
            stars: item.stars ?? null,
            stock_status: item.stock_status ?? false,
            image_url: item.image_url ?? "",
            warranty: item.warranty ?? 0,
            delivery_days: item.delivery_days ?? 0,
            return_days: item.return_days ?? 0,
            description: item.description ?? "",
            images: item.images ?? [],
        }));

        setParts(normalized);
    }, [API]);

    useEffect(() => {
        if (authenticated) loadParts();
    }, [authenticated, loadParts]);

    async function del(id: number) {
        const part = parts.find((p) => p.id === id);
        if (part?.image_url) {
            const publicId = getPublicIdFromUrl(part.image_url);
            if (publicId) await deleteFromCloudinary(publicId);
        }

        const res = await fetchWithAuth(`${API}/parts/parts-admin/${id}/`, {
            method: "DELETE",
        });
        if (res.ok) loadParts();
    }

    function openEditModal(part: NormalizedPart) {
        setEditingPart({
            ...part,
            imagesUrls: part.images?.map((img) => img.image_url) || [],
        });
        setModalOpen(true);
    }

    function closeEditModal() {
        setModalOpen(false);
        setEditingPart(null);
    }

    async function saveEdit() {
        if (!editingPart) return;

        let imagesUrls = editingPart.imagesUrls || [];

        if (editingPart.imagesFiles?.length) {
            // Delete old images if exist
            if (editingPart.imagesUrls) {
                for (const url of editingPart.imagesUrls) {
                    const publicId = getPublicIdFromUrl(url);
                    if (publicId) await deleteFromCloudinary(publicId);
                }
            }

            // Upload new files
            imagesUrls = [];
            for (const file of editingPart.imagesFiles) {
                const uploadedUrl = await uploadToCloudinary(file);
                imagesUrls.push(uploadedUrl);
            }
        }

        const payload = {
            name: editingPart.name,
            category: editingPart.category,
            price: editingPart.price,
            stars: editingPart.stars,
            stock_status: editingPart.stock_status,
            warranty: editingPart.warranty,
            delivery_days: editingPart.delivery_days,
            return_days: editingPart.return_days,
            description: editingPart.description,
            image_url: imagesUrls[0] ?? "",
            images: imagesUrls.map((url) => ({ image_url: url, alt_text: "" })),
        };

        const res = await fetchWithAuth(
            `${API}/parts/parts-admin/${editingPart.productId}/`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            }
        );

        if (res.ok) {
            closeEditModal();
            loadParts();
        }
    }

    async function createPart(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const imagesUrls: string[] = [];

        if (form.imagesFiles?.length) {
            for (const file of form.imagesFiles) {
                const uploadedUrl = await uploadToCloudinary(file);
                imagesUrls.push(uploadedUrl);
            }
        }

        const payload = {
            name: form.name,
            category: form.category,
            price: form.price,
            stars: form.stars,
            stock_status: form.stock_status,
            warranty: form.warranty,
            delivery_days: form.delivery_days,
            return_days: form.return_days,
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
                category: "",
                price: 0,
                stars: 0,
                stock_status: true,
                warranty: 0,
                delivery_days: 0,
                return_days: 0,
                description: "",
                imagesFiles: [],
            });
            setImagePreviews([]);
            loadParts();
        }
    }

    if (loading) return <p className="p-8">Loading…</p>;
    if (!authenticated) return null;

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Parts</h1>
                <LogoutButton />
            </div>

            {/* Add Part Form */}
            <form onSubmit={createPart} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="flex flex-col">
                    <label htmlFor="name" className="mb-1 font-medium">
                        Name<span className="text-red-500">*</span>
                    </label>
                    <input
                        id="name"
                        className="border rounded-md p-3"
                        placeholder="Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="category" className="mb-1 font-medium">
                        Category<span className="text-red-500">*</span>
                    </label>
                    <select
                        id="category"
                        className="border rounded-md p-3"
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        required
                    >
                        <option value="">Select Category</option>
                        {CATEGORY_OPTIONS.map((c, idx) => (
                            <option key={CATEGORY_KEYS[idx]} value={CATEGORY_KEYS[idx]}>
                                {c}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="price" className="mb-1 font-medium">
                        Price<span className="text-red-500">*</span>
                    </label>
                    <input
                        id="price"
                        type="number"
                        className="border rounded-md p-3"
                        placeholder="Price"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                        required
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="stars" className="mb-1 font-medium">
                        Stars (0-5)
                    </label>
                    <input
                        id="stars"
                        type="number"
                        className="border rounded-md p-3"
                        placeholder="Stars"
                        min={0}
                        max={5}
                        step={0.1}
                        value={form.stars ?? 0}
                        onChange={(e) => setForm({ ...form, stars: Number(e.target.value) })}
                    />
                </div>

                {/* Multi Image Upload */}
                <div className="flex flex-col">
                    <label htmlFor="imagesFiles" className="mb-1 font-medium">
                        Images<span className="text-red-500">*</span>
                    </label>
                    <input
                        id="imagesFiles"
                        type="file"
                        multiple
                        accept="image/*"
                        className="border rounded-md p-3"
                        onChange={(e) => {
                            const files = e.target.files ? Array.from(e.target.files) : [];
                            setForm({ ...form, imagesFiles: files });

                            const previews: string[] = [];
                            files.forEach((file) => {
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                    if (ev.target?.result) {
                                        previews.push(ev.target.result as string);
                                        setImagePreviews([...previews]);
                                    }
                                };
                                reader.readAsDataURL(file);
                            });
                        }}
                        required
                    />
                    <div className="flex gap-2 mt-2 flex-wrap">
                        {imagePreviews.map((url, idx) => (
                            <Image key={idx} src={url} alt={`Preview ${idx + 1}`} className="h-20 w-20 object-cover rounded" width={80} height={80} />
                        ))}
                    </div>
                </div>

                <div className="flex items-center space-x-2 mt-2">
                    <input
                        id="stock_status"
                        type="checkbox"
                        checked={form.stock_status}
                        onChange={(e) => setForm({ ...form, stock_status: e.target.checked })}
                    />
                    <label htmlFor="stock_status" className="font-medium">
                        In Stock
                    </label>
                </div>

                {/* Warranty, Delivery Days, Return Days, Description */}
                <div className="flex flex-col">
                    <label htmlFor="warranty" className="mb-1 font-medium">Warranty (years)</label>
                    <input
                        id="warranty"
                        type="number"
                        className="border rounded-md p-3"
                        placeholder="Warranty in years"
                        value={form.warranty}
                        onChange={(e) => setForm({ ...form, warranty: Number(e.target.value) })}
                        min={0}
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="delivery_days" className="mb-1 font-medium">Delivery Days</label>
                    <input
                        id="delivery_days"
                        type="number"
                        className="border rounded-md p-3"
                        placeholder="Delivery days"
                        value={form.delivery_days}
                        onChange={(e) => setForm({ ...form, delivery_days: Number(e.target.value) })}
                        min={0}
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="return_days" className="mb-1 font-medium">Return Days</label>
                    <input
                        id="return_days"
                        type="number"
                        className="border rounded-md p-3"
                        placeholder="Return days"
                        value={form.return_days}
                        onChange={(e) => setForm({ ...form, return_days: Number(e.target.value) })}
                        min={0}
                    />
                </div>
                <div className="flex flex-col sm:col-span-2">
                    <label htmlFor="description" className="mb-1 font-medium">Description</label>
                    <textarea
                        id="description"
                        className="border rounded-md p-3"
                        placeholder="Product description"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        rows={3}
                    />
                </div>

                <button className="col-span-1 sm:col-span-2 bg-green-600 text-white p-3 rounded-md font-semibold mt-4">
                    Add Part
                </button>
            </form>

            {/* Parts Table */}
            <table className="w-full border-collapse border">
                <thead>
                <tr className="bg-gray-100">
                    <th className="border p-2">Images</th>
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
                {parts.map((p) => (
                    <tr key={p.id}>
                        <td className="border p-2 flex gap-1">
                            {p.image_url ? (
                                <Image src={p.image_url} alt={p.name} className="h-12 w-12 object-cover rounded" width={48} height={48} />
                            ) : (
                                "—"
                            )}
                        </td>
                        <td className="border p-2">{p.name}</td>
                        <td className="border p-2">{p.category}</td>
                        <td className="border p-2">{p.price}</td>
                        <td className="border p-2">{p.stars ?? "—"}</td>
                        <td className="border p-2">{p.stock_status ? "Yes" : "No"}</td>
                        <td className="border p-2">{p.warranty}</td>
                        <td className="border p-2">{p.delivery_days}</td>
                        <td className="border p-2">{p.return_days}</td>
                        <td className="border p-2 text-right space-x-2">
                            <button onClick={() => openEditModal(p)} className="px-2 py-1 bg-blue-600 text-white rounded">
                                Edit
                            </button>
                            <button onClick={() => del(p.id)} className="px-2 py-1 bg-red-600 text-white rounded">
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Edit Modal */}
            <Modal
                ariaHideApp={false}
                isOpen={modalOpen}
                onRequestClose={closeEditModal}
                contentLabel="Edit Part"
                className="bg-white p-6 max-w-lg mx-auto mt-20 rounded shadow-lg z-50"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50"
            >
                {editingPart && (
                    <>
                        <h2 className="text-xl font-bold mb-4">Edit Part</h2>
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                className="col-span-2 border p-2"
                                value={editingPart.name}
                                onChange={(e) => setEditingPart({ ...editingPart, name: e.target.value })}
                            />
                            {/* You can add more editable fields similarly */}
                            <input
                                className="col-span-2 border p-2"
                                type="number"
                                placeholder="Warranty (years)"
                                value={editingPart.warranty}
                                onChange={(e) => setEditingPart({ ...editingPart, warranty: Number(e.target.value) })}
                            />
                            <input
                                className="col-span-2 border p-2"
                                type="number"
                                placeholder="Delivery Days"
                                value={editingPart.delivery_days}
                                onChange={(e) => setEditingPart({ ...editingPart, delivery_days: Number(e.target.value) })}
                            />
                            <input
                                className="col-span-2 border p-2"
                                type="number"
                                placeholder="Return Days"
                                value={editingPart.return_days}
                                onChange={(e) => setEditingPart({ ...editingPart, return_days: Number(e.target.value) })}
                            />
                            <textarea
                                className="col-span-2 border p-2"
                                placeholder="Description"
                                value={editingPart.description ?? ""}
                                onChange={(e) => setEditingPart({ ...editingPart, description: e.target.value })}
                                rows={3}
                            />
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {editingPart.imagesUrls?.map((url, idx) => (
                                <Image key={idx} src={url} alt={`Edit Preview ${idx + 1}`} className="h-20 w-20 object-cover rounded" width={80} height={80} />
                            ))}
                        </div>
                        <div className="mt-4 flex justify-end space-x-2">
                            <button onClick={closeEditModal} className="px-4 py-2 bg-gray-400 text-white rounded">
                                Cancel
                            </button>
                            <button onClick={saveEdit} className="px-4 py-2 bg-blue-600 text-white rounded">
                                Save
                            </button>
                        </div>
                    </>
                )}
            </Modal>
        </div>
    );
}
