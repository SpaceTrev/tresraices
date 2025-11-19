'use client';

import { useState, useEffect, useRef } from 'react';
import { recalculateOrder, formatRecalculationMessage } from '@/lib/orders/recalculate';
import type { MenuItem } from '@/lib/menu/types';
import type { Region, WeightUpdate } from '@/lib/orders/types';

export default function RecalculatePage() {
  const [region, setRegion] = useState<Region>('colima');
  const [selectedItem, setSelectedItem] = useState('');
  const [weight, setWeight] = useState('');
  const [items, setItems] = useState<WeightUpdate[]>([]);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load menu data on mount and when region changes
  useEffect(() => {
    async function loadMenu() {
      setLoading(true);
      try {
        const response = await fetch(`/api/menu?region=${region}`);
        const data = await response.json();
        // API returns array directly, not { items: [...] }
        setMenuItems(Array.isArray(data) ? data : (data.items || []));
        setLoading(false);
      } catch (err) {
        setError('Error cargando menú');
        setLoading(false);
      }
    }
    loadMenu();
  }, [region]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddItem = () => {
    if (!selectedItem || !weight) {
      setError('Selecciona un producto y peso');
      return;
    }

    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      setError('Peso inválido');
      return;
    }

    const menuItem = menuItems.find(item => item.id === selectedItem);
    if (!menuItem) {
      setError('Producto no encontrado');
      return;
    }

    setItems([...items, { itemName: menuItem.name, actualWeight: weightNum }]);
    setSelectedItem('');
    setSearchQuery('');
    setWeight('');
    setError('');
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedItem(itemId);
    const item = menuItems.find(i => i.id === itemId);
    setSearchQuery(item ? `${item.category} - ${item.name}` : '');
    setIsDropdownOpen(false);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleProcess = () => {
    setError('');
    setResult('');

    if (items.length === 0) {
      setError('Agrega al menos un producto');
      return;
    }

    try {
      const recalculated = recalculateOrder(menuItems, region, items);
      const message = formatRecalculationMessage(recalculated);
      setResult(message);
    } catch (err: any) {
      setError(err.message || 'Error al calcular');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      alert('¡Copiado al portapapeles!');
    } catch (err) {
      alert('Error al copiar');
    }
  };

  const handleClear = () => {
    setItems([]);
    setResult('');
    setError('');
  };

  // Filter menu items based on search query
  const filteredItems = menuItems.filter(item => {
    const query = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
  });

  // Group filtered items by category
  const categorizedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="card p-6">Cargando menú...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Recalcular Pedido</h1>
        <a href="/admin" className="text-sm text-federalBlue hover:underline">
          ← Volver a Admin
        </a>
      </div>

      <div className="card p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Región</label>
          <select
            className="w-full border rounded-lg p-3"
            value={region}
            onChange={(e) => setRegion(e.target.value as Region)}
          >
            <option value="guadalajara">Guadalajara (+15%)</option>
            <option value="colima">Colima (+20%)</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Producto</label>
            <div className="relative" ref={dropdownRef}>
              <input
                type="text"
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-federalBlue focus:border-federalBlue"
                placeholder="Buscar producto... (ej: arrachera, cerdo, hamburguesa)"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsDropdownOpen(true);
                  setSelectedItem('');
                }}
                onFocus={() => setIsDropdownOpen(true)}
              />
              
              {isDropdownOpen && filteredItems.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                  {Object.entries(categorizedItems).map(([category, items]) => (
                    <div key={category}>
                      <div className="bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 sticky top-0">
                        {category}
                      </div>
                      {items.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          className="w-full text-left px-3 py-2 hover:bg-federalBlue hover:text-white transition-colors text-sm"
                          onClick={() => handleSelectItem(item.id)}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {isDropdownOpen && searchQuery && filteredItems.length === 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg p-4 text-center text-slate-500 text-sm">
                  No se encontraron productos
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Peso (kg)</label>
            <input
              type="number"
              step="0.001"
              min="0"
              className="w-full border rounded-lg p-3"
              placeholder="1.180"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddItem();
                }
              }}
            />
          </div>
        </div>

        <button
          onClick={handleAddItem}
          className="btn btn-primary w-full"
          disabled={!selectedItem || !weight}
        >
          ➕ Agregar Producto
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm">
            {error}
          </div>
        )}

        {items.length > 0 && (
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Productos Agregados ({items.length})</h3>
              <button
                onClick={handleClear}
                className="text-sm text-red-600 hover:underline"
              >
                Limpiar todo
              </button>
            </div>
            <ul className="space-y-2">
              {items.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-slate-50 p-3 rounded"
                >
                  <span className="text-sm">
                    <span className="font-medium capitalize">{item.itemName}</span>
                    <span className="text-slate-500 ml-2">— {item.actualWeight.toFixed(3)} kg</span>
                  </span>
                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    ✕ Quitar
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={handleProcess}
              className="btn btn-primary w-full"
            >
              🧮 Procesar y Generar Mensaje
            </button>
          </div>
        )}

        {result && (
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-green-900">Mensaje Listo para Copiar:</p>
              <button
                onClick={handleCopy}
                className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                📋 Copiar
              </button>
            </div>
            <pre className="bg-white p-4 rounded border text-sm whitespace-pre-wrap">
{result}
            </pre>
          </div>
        )}
      </div>

      <div className="card p-6 bg-slate-50">
        <h2 className="font-semibold mb-2">Instrucciones:</h2>
        <ol className="text-sm space-y-2 list-decimal list-inside text-slate-700">
          <li>Selecciona la región del pedido (Guadalajara o Colima)</li>
          <li>Selecciona un producto del menú</li>
          <li>Ingresa el peso real del distribuidor</li>
          <li>Click en "Agregar Producto" (o presiona Enter)</li>
          <li>Repite para cada producto del pedido</li>
          <li>Click en "Procesar y Generar Mensaje"</li>
          <li>Copia el mensaje y envíalo al cliente por WhatsApp</li>
        </ol>
      </div>
    </div>
  );
}
