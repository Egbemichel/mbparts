"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import LogoutButton from "@/components/LogoutButton";
import Modal from "react-modal";

import { NormalizedPart, Part, Product } from "@/lib/types";
import {deleteFromCloudinary, getPublicIdFromUrl, uploadToCloudinary} from "@/lib/cloudinary";
import Image from "next/image";

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

// Extend NormalizedPart for editing to include imageFile
interface EditablePart extends NormalizedPart {
    imageFile?: File;
}

export default function PartsAdminPage() {
    const { loading, authenticated } = useAuth();
    const [parts, setParts] = useState<NormalizedPart[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingPart, setEditingPart] = useState<EditablePart | null>(null);

    // --- Form state ---
    const [form, setForm] = useState<Partial<NormalizedPart> & { imageFile?: File | null }>({
        name: "",
        category: "",
        price: 0,
        stars: 0,
        stock_status: true,
        image_url: "",
        warranty: 0,
        delivery_days: 0,
        return_days: 0,
        imageFile: null,
    });
    const [imagePreview, setImagePreview] = useState<string>("");

    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

    // --- Load parts with normalization ---
    const loadParts = React.useCallback(async () => {
        const res = await fetchWithAuth(`${API}/parts/parts-admin/`);
        if (!res.ok) return;

        const json = await res.json();
        const data: Part[] = Array.isArray(json) ? json : json.results || [];

        const normalized: NormalizedPart[] = data.map((item) => {
            // fallback if item.product is missing
            const product: Product = item.product ?? {
                id: item.id,
                name: "—",
                category: "uncategorized",
                price: 0,
                stars: null,
                stock_status: false,
                image_url: "",
                warranty: 0,
                delivery_days: 0,
                return_days: 0,
            };

            return {
                id: item.id,
                make: item.make ?? "",
                model: item.model ?? "",
                year_start: item.year_start ?? 0,
                year_end: item.year_end ?? 0,

                productId: product.id,
                name: product.name ?? "—",
                category: product.category ?? "uncategorized",
                price: product.price ?? 0,
                stars: product.stars ?? null,
                stock_status: product.stock_status ?? false,
                image_url: product.image_url ?? "",
                warranty: product.warranty ?? 0,
                delivery_days: product.delivery_days ?? 0,
                return_days: product.return_days ?? 0,
            };
        });

        setParts(normalized);
    }, [API]);

    useEffect(() => {
        if (authenticated) loadParts();
    }, [authenticated, loadParts]);

    // --- Delete ---
    async function del(id: number) {
        const part = parts.find((p) => p.id === id);
        if (part?.image_url) {
            const publicId = getPublicIdFromUrl(part.image_url);
            if (publicId) await deleteFromCloudinary(publicId);
        }

        const res = await fetchWithAuth(`${API}/parts/parts-admin/${id}/`, { method: "DELETE" });
        if (res.ok) loadParts();
    }


    // --- Edit modal ---
    function openEditModal(part: NormalizedPart) {
        setEditingPart(part);
        setModalOpen(true);
    }

    function closeEditModal() {
        setModalOpen(false);
        setEditingPart(null);
    }

    async function saveEdit() {
        if (!editingPart) return;

        let imageUrl = editingPart.image_url;

        // If user uploaded a new file
        if (editingPart.imageFile instanceof File) {
            // delete old image if exists
            if (editingPart.image_url) {
                const publicId = getPublicIdFromUrl(editingPart.image_url);
                if (publicId) await deleteFromCloudinary(publicId);
            }

            // upload new one
            imageUrl = await uploadToCloudinary(editingPart.imageFile);
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
            image_url: imageUrl,
        };

        const res = await fetchWithAuth(`${API}/parts/parts-admin/${editingPart.productId}/`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            closeEditModal();
            loadParts();
        }
    }


    // --- Create part ---
    async function createPart(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        let imageUrl = form.image_url;

        // Step 1: Upload image to Cloudinary (if a file was selected)
        if (form.imageFile instanceof File) {
            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
            const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

            const data = new FormData();
            data.append("file", form.imageFile);
            data.append("upload_preset", uploadPreset);

            const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
                method: "POST",
                body: data,
            });

            const uploadJson = await uploadRes.json();
            imageUrl = uploadJson.secure_url;
        }

        // Step 2: Send part details to your backend (with Cloudinary image_url)
        const payload = {
            name: form.name,
            category: form.category,
            price: form.price,
            stars: form.stars,
            stock_status: form.stock_status,
            warranty: form.warranty,
            delivery_days: form.delivery_days,
            return_days: form.return_days,
            image_url: imageUrl, // ✅ Cloudinary URL
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
                image_url: "",
                warranty: 0,
                delivery_days: 0,
                return_days: 0,
                imageFile: null,
            });
            setImagePreview("");
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
                    <label htmlFor="name" className="mb-1 font-medium">Name<span className="text-red-500">*</span></label>
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
                    <label htmlFor="category" className="mb-1 font-medium">Category<span className="text-red-500">*</span></label>
                    <select
                        id="category"
                        className="border rounded-md p-3"
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        required
                    >
                        <option value="">Select Category</option>
                        {CATEGORY_OPTIONS.map((c, idx) => (
                            <option key={CATEGORY_KEYS[idx]} value={CATEGORY_KEYS[idx]}>{c}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="price" className="mb-1 font-medium">Price<span className="text-red-500">*</span></label>
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
                    <label htmlFor="stars" className="mb-1 font-medium">Stars (0-5)</label>
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

                <div className="flex flex-col">
                    <label htmlFor="imageFile" className="mb-1 font-medium">Image<span className="text-red-500">*</span></label>
                    <input
                        id="imageFile"
                        type="file"
                        accept="image/*"
                        className="border rounded-md p-3"
                        onChange={e => {
                            const file = e.target.files?.[0] || null;
                            setForm({ ...form, imageFile: file });
                            if (file) {
                                const reader = new FileReader();
                                reader.onload = (ev) => setImagePreview(ev.target?.result as string);
                                reader.readAsDataURL(file);
                            } else {
                                setImagePreview("");
                            }
                        }}
                        required
                    />
                    {imagePreview && <Image src={imagePreview} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded" width={20} height={20} />}
                </div>

                <div className="flex flex-col">
                    <label htmlFor="warranty" className="mb-1 font-medium">Warranty (years)</label>
                    <input
                        id="warranty"
                        type="number"
                        className="border rounded-md p-3"
                        placeholder="Warranty"
                        value={form.warranty}
                        onChange={(e) => setForm({ ...form, warranty: Number(e.target.value) })}
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="delivery_days" className="mb-1 font-medium">Delivery days</label>
                    <input
                        id="delivery_days"
                        type="number"
                        className="border rounded-md p-3"
                        placeholder="Delivery days"
                        value={form.delivery_days}
                        onChange={(e) => setForm({ ...form, delivery_days: Number(e.target.value) })}
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="return_days" className="mb-1 font-medium">Return days</label>
                    <input
                        id="return_days"
                        type="number"
                        className="border rounded-md p-3"
                        placeholder="Return days"
                        value={form.return_days}
                        onChange={(e) => setForm({ ...form, return_days: Number(e.target.value) })}
                    />
                </div>

                <div className="flex items-center space-x-2 mt-2">
                    <input
                        id="stock_status"
                        type="checkbox"
                        checked={form.stock_status}
                        onChange={(e) => setForm({ ...form, stock_status: e.target.checked })}
                    />
                    <label htmlFor="stock_status" className="font-medium">In Stock</label>
                </div>

                <button className="col-span-1 sm:col-span-2 bg-green-600 text-white p-3 rounded-md font-semibold mt-4">Add Part</button>
            </form>

            {/* Parts Table */}
            <table className="w-full border-collapse border">
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
                {parts.map((p) => (
                    <tr key={p.id}>
                        <td className="border p-2">
                            {p.image_url ? (
                                <Image src={p.image_url} alt={p.name} className="h-12 w-12 object-cover rounded" width={12} height={12} />
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
                            <button onClick={() => openEditModal(p)} className="px-2 py-1 bg-blue-600 text-white rounded">Edit</button>
                            <button onClick={() => del(p.id)} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
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
                            {Object.entries(editingPart).map(([key, value]) => {
                                if (["id", "productId", "make", "model", "year_start", "year_end"].includes(key)) return null;
                                if (typeof value === "boolean") {
                                    return (
                                        <label key={key} className="col-span-2 flex items-center space-x-2">
                                            <input type="checkbox" checked={value as boolean} onChange={(e) => setEditingPart({ ...editingPart, [key]: e.target.checked })} />
                                            {key}
                                        </label>
                                    );
                                }
                                return (
                                    <input
                                        key={key}
                                        className="border rounded p-2"
                                        placeholder={key}
                                        value={value as string | number}
                                        type={typeof value === "number" ? "number" : "text"}
                                        onChange={(e) => setEditingPart({ ...editingPart, [key]: typeof value === "number" ? Number(e.target.value) : e.target.value })}
                                    />
                                );
                            })}
                        </div>
                        <div className="mt-4 flex justify-end space-x-2">
                            <button onClick={closeEditModal} className="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
                            <button onClick={saveEdit} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
                        </div>
                    </>
                )}
            </Modal>
        </div>
    );
}
