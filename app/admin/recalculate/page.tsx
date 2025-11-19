'use client';

import { useState, useEffect } from 'react';
import { parseWeightUpdates } from '@/lib/orders/parser';
import { recalculateOrder, formatRecalculationMessage } from '@/lib/orders/recalculate';
import type { MenuItem } from '@/lib/menu/types';
import type { Region } from '@/lib/orders/types';

export default function RecalculatePage() {
  const [region, setRegion] = useState<Region>('colima');
  const [weightsInput, setWeightsInput] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load menu data on mount
  useEffect(() => {
    async function loadMenu() {
      try {
        const response = await fetch(`/api/menu?region=${region}`);
        const data = await response.json();
        setMenuItems(data.items || []);
        setLoading(false);
      } catch (err) {
        setError('Error cargando menú');
        setLoading(false);
      }
    }
    loadMenu();
  }, [region]);

  const handleCalculate = () => {
    setError('');
    setResult('');

    try {
      // Parse weight updates
      const updates = parseWeightUpdates(weightsInput);
      
      if (updates.length === 0) {
        setError('No se encontraron pesos válidos. Formato esperado:\nCerdo costilla baby back 1.180 kg\nRes arrachera 250: 1.04 kg');
        return;
      }

      // Recalculate
      const recalculated = recalculateOrder(menuItems, region, updates);
      
      // Format message
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

        <div>
          <label className="block text-sm font-medium mb-2">
            Pesos Reales del Distribuidor
            <span className="text-xs text-slate-500 ml-2">
              (uno por línea, ej: "Cerdo costilla baby back 1.180 kg")
            </span>
          </label>
          <textarea
            className="w-full border rounded-lg p-3 font-mono text-sm h-64"
            placeholder="Cerdo costilla baby back 1.180 kg
Res arrachera 250: 1.04 kg
Res hamburguesa arrachera .500kg
Res rib eye 1.220kg"
            value={weightsInput}
            onChange={(e) => setWeightsInput(e.target.value)}
          />
        </div>

        <button
          onClick={handleCalculate}
          className="btn btn-primary w-full"
          disabled={!weightsInput.trim()}
        >
          Calcular Total Final
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            <p className="font-semibold">Error:</p>
            <pre className="text-sm whitespace-pre-wrap mt-1">{error}</pre>
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
          <li>Pega los pesos reales del distribuidor (uno por línea)</li>
          <li>Click en "Calcular Total Final"</li>
          <li>Copia el mensaje generado y envíalo al cliente por WhatsApp</li>
        </ol>
        <p className="text-xs text-slate-500 mt-4">
          El sistema buscará automáticamente cada producto en el menú y aplicará los precios correctos de la región.
        </p>
      </div>
    </div>
  );
}
