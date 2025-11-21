"use client";

import { useState, useEffect } from "react";
import { initializeApp, getApps } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import type { ManualMenuItem, ProfitMarginWarning } from "@/lib/menu/manual";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const CATEGORIES = [
  "Avestruz",
  "Búfalo",
  "Cabrito",
  "Cerdo",
  "Ciervo rojo",
  "Codorniz",
  "Conejo",
  "Cordero",
  "Jabalí",
  "Pato",
  "Pavo",
  "Pollo",
  "Queso",
  "Res",
  "Ternera",
];

export default function ManualMenuPage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ManualMenuItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [marginWarning, setMarginWarning] = useState<ProfitMarginWarning | null>(null);
  const [forceOverride, setForceOverride] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    category: "Res",
    price: 0,
    basePrice: 0,
    supplier: "",
    description: "",
    unit: "kilo" as "kilo" | "pieza" | "paquete",
    packInfo: "",
    thickness: "",
    region: "both" as "guadalajara" | "colima" | "both",
  });

  useEffect(() => {
    if (!getApps().length) {
      initializeApp(firebaseConfig);
    }
    const auth = getAuth();
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        window.location.href = "/admin";
        return;
      }

      await fetchItems();
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchItems = async () => {
    try {
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken();

      const res = await fetch("/api/menu/manual", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setItems(data.items);
      }
    } catch (error) {
      console.error("Failed to fetch items:", error);
    }
  };

  const handleOpenModal = (item?: ManualMenuItem) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        name: item.name,
        category: item.category,
        price: item.price,
        basePrice: item.basePrice || 0,
        supplier: item.supplier || "",
        description: item.description || "",
        unit: item.unit || "kilo",
        packInfo: item.packInfo || "",
        thickness: item.thickness || "",
        region: item.region || "both",
      });
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        category: "Res",
        price: 0,
        basePrice: 0,
        supplier: "",
        description: "",
        unit: "kilo",
        packInfo: "",
        thickness: "",
        region: "both",
      });
    }
    setMarginWarning(null);
    setForceOverride(false);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken();

      const payload = {
        ...formData,
        basePrice: formData.basePrice || undefined,
        supplier: formData.supplier || undefined,
        description: formData.description || undefined,
        packInfo: formData.packInfo || undefined,
        thickness: formData.thickness || undefined,
        forceOverride,
      };

      if (editingId) {
        // Update
        const res = await fetch("/api/menu/manual", {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: editingId, ...payload }),
        });

        const data = await res.json();

        if (res.ok) {
          await fetchItems();
          setShowModal(false);
          setMarginWarning(null);
          setForceOverride(false);
        } else if (data.requiresForceOverride) {
          setMarginWarning(data.warning);
        } else {
          alert(`Error: ${data.error}`);
        }
      } else {
        // Create
        const res = await fetch("/api/menu/manual", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (res.ok) {
          await fetchItems();
          setShowModal(false);
          setMarginWarning(null);
          setForceOverride(false);
        } else if (data.requiresForceOverride) {
          setMarginWarning(data.warning);
        } else {
          alert(`Error: ${data.error}`);
        }
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Failed to save menu item");
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken();

      const res = await fetch("/api/menu/manual", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, isActive: !currentStatus }),
      });

      if (res.ok) {
        await fetchItems();
      }
    } catch (error) {
      console.error("Toggle error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  // Group by category
  const itemsByCategory = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ManualMenuItem[]>);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manual Menu Items</h1>
            <p className="text-gray-600 mt-1">
              Add custom items separate from PDF imports
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => handleOpenModal()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              + Add Item
            </button>
            <a
              href="/admin"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors py-2"
            >
              ← Back to Admin
            </a>
          </div>
        </div>

        {/* Items List - All Categories */}
        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No manual items yet</h3>
            <p className="text-gray-500 mb-4">Add custom products to complement your PDF menu</p>
            <button
              onClick={() => handleOpenModal()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Add First Item
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pricing
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Region
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item) => {
                  const margin = item.basePrice
                    ? ((item.price - item.basePrice) / item.basePrice) * 100
                    : null;

                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div>
                            <div className="font-medium text-gray-900">{item.name}</div>
                            <div className="flex gap-2 mt-1">
                              {item.unit && (
                                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                                  {item.unit}
                                </span>
                              )}
                              {item.packInfo && (
                                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                                  {item.packInfo}
                                </span>
                              )}
                              {item.thickness && (
                                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                                  {item.thickness}
                                </span>
                              )}
                            </div>
                            {item.description && (
                              <div className="text-sm text-gray-500 mt-1">{item.description}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-semibold text-gray-900">
                            ${item.price.toFixed(2)}
                          </div>
                          {item.basePrice && (
                            <div className="text-xs text-gray-500">
                              Base: ${item.basePrice.toFixed(2)}
                            </div>
                          )}
                          {margin !== null && (
                            <span
                              className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded ${
                                margin < 0
                                  ? "bg-red-100 text-red-800"
                                  : margin < 10
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {margin > 0 ? "+" : ""}
                              {margin.toFixed(1)}%
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.region === "both" ? "Ambas" : item.region === "guadalajara" ? "GDL" : "Colima"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleActive(item.id, item.isActive)}
                          className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                            item.isActive
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
                        >
                          {item.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenModal(item)}
                            className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded hover:bg-blue-100 transition-colors"
                            title="Edit item"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm(`Delete "${item.name}"?`)) {
                                const auth = getAuth();
                                const token = await auth.currentUser?.getIdToken();
                                await fetch(`/api/menu/manual?id=${item.id}`, {
                                  method: "DELETE",
                                  headers: { Authorization: `Bearer ${token}` },
                                });
                                await fetchItems();
                              }
                            }}
                            className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-700 text-sm font-medium rounded hover:bg-red-100 transition-colors"
                            title="Delete item"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {editingId ? "Edit Menu Item" : "Add Menu Item"}
              </h2>

              {marginWarning && (
                <div className={`mb-4 p-4 rounded-lg border ${
                  marginWarning.margin < 0
                    ? "bg-red-50 border-red-200"
                    : "bg-yellow-50 border-yellow-200"
                }`}>
                  <p className={`font-medium ${
                    marginWarning.margin < 0 ? "text-red-800" : "text-yellow-800"
                  }`}>
                    ⚠️ {marginWarning.message}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={forceOverride}
                      onChange={(e) => setForceOverride(e.target.checked)}
                      id="forceOverride"
                      className="rounded"
                    />
                    <label htmlFor="forceOverride" className="text-sm text-gray-700">
                      I understand and want to proceed anyway
                    </label>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Selling Price * (MXN)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: parseFloat(e.target.value) })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Base/Wholesale Price (MXN)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.basePrice}
                      onChange={(e) =>
                        setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                    <select
                      value={formData.unit}
                      onChange={(e) =>
                        setFormData({ ...formData, unit: e.target.value as any })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="kilo">Kilo</option>
                      <option value="pieza">Pieza</option>
                      <option value="paquete">Paquete</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pack Info
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 500g"
                      value={formData.packInfo}
                      onChange={(e) => setFormData({ ...formData, packInfo: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Thickness
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 2cm"
                      value={formData.thickness}
                      onChange={(e) => setFormData({ ...formData, thickness: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                  <select
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="both">Ambas (GDL + Colima)</option>
                    <option value="guadalajara">Solo Guadalajara</option>
                    <option value="colima">Solo Colima</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    disabled={!!(marginWarning && !forceOverride)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {editingId ? "Update" : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setMarginWarning(null);
                      setForceOverride(false);
                    }}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
