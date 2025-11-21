"use client";

import { useState, useEffect } from "react";
import { initializeApp, getApps } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import type { Supplier } from "@/lib/suppliers/types";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export default function SuppliersPage() {
  const [loading, setLoading] = useState(true);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    defaultMarkup: 1.2,
    notes: "",
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

      await fetchSuppliers();
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken();

      const res = await fetch("/api/suppliers", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setSuppliers(data.suppliers);
      }
    } catch (error) {
      console.error("Failed to fetch suppliers:", error);
    }
  };

  const handleOpenModal = (supplier?: Supplier) => {
    if (supplier) {
      setEditingId(supplier.id);
      setFormData({
        name: supplier.name,
        contactName: supplier.contactName || "",
        contactPhone: supplier.contactPhone || "",
        contactEmail: supplier.contactEmail || "",
        defaultMarkup: supplier.defaultMarkup,
        notes: supplier.notes || "",
      });
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        contactName: "",
        contactPhone: "",
        contactEmail: "",
        defaultMarkup: 1.2,
        notes: "",
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken();

      if (editingId) {
        // Update
        const res = await fetch("/api/suppliers", {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: editingId, ...formData }),
        });

        if (res.ok) {
          await fetchSuppliers();
          setShowModal(false);
        } else {
          const data = await res.json();
          alert(`Error: ${data.error}`);
        }
      } else {
        // Create
        const res = await fetch("/api/suppliers", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (res.ok) {
          await fetchSuppliers();
          setShowModal(false);
        } else {
          const data = await res.json();
          alert(`Error: ${data.error}`);
        }
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Failed to save supplier");
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken();

      const res = await fetch("/api/suppliers", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, isActive: !currentStatus }),
      });

      if (res.ok) {
        await fetchSuppliers();
      }
    } catch (error) {
      console.error("Toggle error:", error);
    }
  };

  // Filtered suppliers
  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.contactName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.contactEmail?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && supplier.isActive) ||
      (filterStatus === "inactive" && !supplier.isActive);

    return matchesSearch && matchesStatus;
  });

  // Stats
  const stats = {
    total: suppliers.length,
    active: suppliers.filter((s) => s.isActive).length,
    inactive: suppliers.filter((s) => !s.isActive).length,
    avgMarkup:
      suppliers.length > 0
        ? suppliers.reduce((sum, s) => sum + s.defaultMarkup, 0) / suppliers.length
        : 0,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Proveedores</h1>
              <p className="text-gray-600 mt-1">Gestiona proveedores mayoristas y precios base</p>
            </div>
            <a
              href="/admin"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Volver al Admin
            </a>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-600">
              <div className="text-sm text-gray-600 font-medium">Total Proveedores</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-600">
              <div className="text-sm text-gray-600 font-medium">Activos</div>
              <div className="text-2xl font-bold text-green-600 mt-1">{stats.active}</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-gray-600">
              <div className="text-sm text-gray-600 font-medium">Inactivos</div>
              <div className="text-2xl font-bold text-gray-600 mt-1">{stats.inactive}</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-600">
              <div className="text-sm text-gray-600 font-medium">Margen Promedio</div>
              <div className="text-2xl font-bold text-purple-600 mt-1">
                {((stats.avgMarkup - 1) * 100).toFixed(0)}%
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Buscar por nombre, contacto o email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filters and View Toggle */}
              <div className="flex gap-2 items-center">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Todos</option>
                  <option value="active">Activos</option>
                  <option value="inactive">Inactivos</option>
                </select>

                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("cards")}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      viewMode === "cards"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode("table")}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      viewMode === "table"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                </div>

                <button
                  onClick={() => handleOpenModal()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Agregar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Cards View */}
        {viewMode === "cards" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSuppliers.length === 0 ? (
              <div className="col-span-full">
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <p className="text-xl font-semibold text-gray-700 mb-2">No se encontraron proveedores</p>
                  <p className="text-gray-500 mb-6">
                    {searchQuery || filterStatus !== "all"
                      ? "Intenta ajustar tus filtros de búsqueda"
                      : "Agrega tu primer proveedor para comenzar a gestionar tu inventario"}
                  </p>
                  {!searchQuery && filterStatus === "all" && (
                    <button
                      onClick={() => handleOpenModal()}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Agregar Proveedor
                    </button>
                  )}
                </div>
              </div>
            ) : (
              filteredSuppliers.map((supplier) => (
                <div
                  key={supplier.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-200 overflow-hidden"
                >
                  {/* Card Header */}
                  <div className={`h-2 ${supplier.isActive ? "bg-green-500" : "bg-gray-400"}`} />
                  
                  <div className="p-6">
                    {/* Title and Status */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{supplier.name}</h3>
                        <button
                          onClick={() => handleToggleActive(supplier.id, supplier.isActive)}
                          className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full transition-all ${
                            supplier.isActive
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${supplier.isActive ? "bg-green-500" : "bg-gray-400"}`} />
                          {supplier.isActive ? "Activo" : "Inactivo"}
                        </button>
                      </div>
                      
                      {/* Markup Badge */}
                      <div className={`px-3 py-2 rounded-lg text-center ml-3 ${
                        supplier.defaultMarkup >= 1.3
                          ? "bg-green-50 border border-green-200"
                          : supplier.defaultMarkup >= 1.2
                          ? "bg-blue-50 border border-blue-200"
                          : supplier.defaultMarkup >= 1.1
                          ? "bg-yellow-50 border border-yellow-200"
                          : "bg-red-50 border border-red-200"
                      }`}>
                        <div className="text-xs text-gray-600 font-medium">Margen</div>
                        <div className={`text-xl font-bold ${
                          supplier.defaultMarkup >= 1.3
                            ? "text-green-700"
                            : supplier.defaultMarkup >= 1.2
                            ? "text-blue-700"
                            : supplier.defaultMarkup >= 1.1
                            ? "text-yellow-700"
                            : "text-red-700"
                        }`}>
                          {((supplier.defaultMarkup - 1) * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    {supplier.notes && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2 italic border-l-2 border-gray-200 pl-3">
                        {supplier.notes}
                      </p>
                    )}

                    {/* Contact Info */}
                    <div className="space-y-2 mb-4">
                      {supplier.contactName && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>{supplier.contactName}</span>
                        </div>
                      )}
                      {supplier.contactPhone && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span>{supplier.contactPhone}</span>
                        </div>
                      )}
                      {supplier.contactEmail && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="truncate">{supplier.contactEmail}</span>
                        </div>
                      )}
                      {!supplier.contactName && !supplier.contactPhone && !supplier.contactEmail && (
                        <p className="text-sm text-gray-400 italic">Sin información de contacto</p>
                      )}
                    </div>

                    {/* Actions */}
                    <button
                      onClick={() => handleOpenModal(supplier)}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg font-medium transition-colors"
                    >
                      Editar Proveedor
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Table View */}
        {viewMode === "table" && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Margen Base
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSuppliers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-gray-400">
                      <svg
                        className="w-12 h-12 mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                      </svg>
                      <p className="text-lg font-medium text-gray-600 mb-1">No se encontraron proveedores</p>
                      <p className="text-sm text-gray-500">
                        {searchQuery || filterStatus !== "all"
                          ? "Intenta ajustar tus filtros"
                          : "Agrega tu primer proveedor para comenzar"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{supplier.name}</div>
                      {supplier.notes && (
                        <div className="text-sm text-gray-500 mt-1 line-clamp-1">{supplier.notes}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {supplier.contactName && (
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {supplier.contactName}
                        </div>
                      )}
                      {supplier.contactPhone && (
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {supplier.contactPhone}
                        </div>
                      )}
                      {supplier.contactEmail && (
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {supplier.contactEmail}
                        </div>
                      )}
                      {!supplier.contactName && !supplier.contactPhone && !supplier.contactEmail && (
                        <span className="text-gray-400 italic">Sin información</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                          supplier.defaultMarkup >= 1.3
                            ? "bg-green-100 text-green-800"
                            : supplier.defaultMarkup >= 1.2
                            ? "bg-blue-100 text-blue-800"
                            : supplier.defaultMarkup >= 1.1
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {((supplier.defaultMarkup - 1) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(supplier.id, supplier.isActive)}
                        className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                          supplier.isActive
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {supplier.isActive ? "● Activo" : "○ Inactivo"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <button
                        onClick={() => handleOpenModal(supplier)}
                        className="text-blue-600 hover:text-blue-900 font-medium transition-colors"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingId ? "Editar Proveedor" : "Agregar Proveedor"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre del Proveedor <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="ej. Carnes Premium SA de CV"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Contact Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre de Contacto
                  </label>
                  <input
                    type="text"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    placeholder="ej. Juan Pérez"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Contact Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) =>
                        setFormData({ ...formData, contactPhone: e.target.value })
                      }
                      placeholder="33 1234 5678"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) =>
                        setFormData({ ...formData, contactEmail: e.target.value })
                      }
                      placeholder="contacto@ejemplo.com"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Default Markup */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Margen Base <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      max="3"
                      required
                      value={formData.defaultMarkup}
                      onChange={(e) =>
                        setFormData({ ...formData, defaultMarkup: parseFloat(e.target.value) })
                      }
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <div className={`px-6 py-2.5 rounded-lg font-bold text-lg flex items-center justify-center min-w-[100px] ${
                      formData.defaultMarkup >= 1.3
                        ? "bg-green-100 text-green-800"
                        : formData.defaultMarkup >= 1.2
                        ? "bg-blue-100 text-blue-800"
                        : formData.defaultMarkup >= 1.1
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {((formData.defaultMarkup - 1) * 100).toFixed(0)}%
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Multiplica el precio base (ej. 1.2 = 20% de margen). Mínimo recomendado: 1.1 (10%)
                  </p>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Notas / Observaciones
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    placeholder="Información adicional sobre el proveedor..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors shadow-sm"
                  >
                    {editingId ? "Actualizar" : "Crear Proveedor"}
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
