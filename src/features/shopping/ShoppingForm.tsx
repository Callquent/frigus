"use client";

import { FormEvent, useState } from "react";
import CategoryPicker from "@/components/ui/CategoryPicker";
import { CATEGORIES, UNITS } from "@/lib/constants";
import type { ShoppingInput, ShoppingItem } from "@/types";

interface Props {
  editing: ShoppingItem | null;
  onSubmit: (id: number | null, data: ShoppingInput) => Promise<void>;
  onCancel: () => void;
}

const empty = { name: "", category: CATEGORIES[0], unit: UNITS[0], quantity: "1" };

export default function ShoppingForm({ editing, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState(
    editing
      ? { name: editing.product.name, category: editing.product.category, unit: editing.product.unit, quantity: String(editing.quantity) }
      : empty
  );
  const [error, setError] = useState("");
  const set = (patch: Partial<typeof empty>) => setForm((f) => ({ ...f, ...patch }));

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await onSubmit(editing?.id ?? null, { ...form, quantity: Number(form.quantity) });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inattendue");
      return;
    }
    if (editing) onCancel();
    else set({ name: "", quantity: "1" });
  }

  return (
    <form onSubmit={submit} className="panel p-3 mb-3">
      {error && <div className="alert alert-danger py-2">{error}</div>}
      <div className="row g-2">
        <div className="col-12">
          <input className="form-control" placeholder="Ajouter un article" aria-label="Article à acheter" value={form.name} onChange={(e) => set({ name: e.target.value })} required />
        </div>
        <div className="col-12">
          <CategoryPicker value={form.category} onChange={(category) => set({ category })} />
        </div>
        <div className="col-4 col-sm-3">
          <input type="number" min="1" step="any" className="form-control" aria-label="Quantité" value={form.quantity} onChange={(e) => set({ quantity: e.target.value })} />
        </div>
        <div className="col-8 col-sm-4">
          <select className="form-select" aria-label="Unité" value={form.unit} onChange={(e) => set({ unit: e.target.value })}>
            {UNITS.map((u) => <option key={u}>{u}</option>)}
          </select>
        </div>
        <div className="col-12 col-sm-5">
          <div className="d-flex gap-2">
            <button className="btn btn-ink flex-fill">{editing ? "Enregistrer" : "Ajouter"}</button>
            {editing && <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Annuler</button>}
          </div>
        </div>
      </div>
    </form>
  );
}
