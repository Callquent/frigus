"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import CategoryPicker from "@/components/ui/CategoryPicker";
import { CATEGORIES, UNITS } from "@/lib/constants";
import type { FridgeInput, FridgeItem } from "@/types";

interface Props {
  editing: FridgeItem | null;
  onSubmit: (id: number | null, data: FridgeInput) => Promise<void>;
  onClose: () => void;
}

const empty = { name: "", category: CATEGORIES[0], unit: UNITS[0], quantity: "1", minQuantity: "0", expiresAt: "" };

function fromItem(item: FridgeItem) {
  return {
    name: item.product.name,
    category: item.product.category,
    unit: item.product.unit,
    quantity: String(item.quantity),
    minQuantity: String(item.minQuantity),
    expiresAt: item.expiresAt ? item.expiresAt.slice(0, 10) : "",
  };
}

export default function FridgeForm({ editing, onSubmit, onClose }: Props) {
  const [form, setForm] = useState(editing ? fromItem(editing) : empty);
  const [error, setError] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const set = (patch: Partial<typeof empty>) => setForm((f) => ({ ...f, ...patch }));

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await onSubmit(editing?.id ?? null, {
        name: form.name,
        category: form.category,
        unit: form.unit,
        quantity: Number(form.quantity),
        minQuantity: Number(form.minQuantity),
        expiresAt: form.expiresAt || null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inattendue");
      return;
    }
    if (editing) {
      onClose();
    } else {
      set({ name: "", expiresAt: "" });
      nameRef.current?.focus();
    }
  }

  return (
    <form onSubmit={submit} className="panel p-3 mb-3">
      {error && <div className="alert alert-danger py-2">{error}</div>}
      <div className="row g-3">
        <div className="col-12">
          <label className="form-label" htmlFor="f-name">Produit</label>
          <input id="f-name" ref={nameRef} className="form-control" placeholder="Ex. yaourts nature" value={form.name} onChange={(e) => set({ name: e.target.value })} required />
        </div>
        <div className="col-12">
          <span className="form-label d-block">Catégorie</span>
          <CategoryPicker value={form.category} onChange={(category) => set({ category })} />
        </div>
        <div className="col-6 col-sm-3">
          <label className="form-label" htmlFor="f-unit">Unité</label>
          <select id="f-unit" className="form-select" value={form.unit} onChange={(e) => set({ unit: e.target.value })}>
            {UNITS.map((u) => <option key={u}>{u}</option>)}
          </select>
        </div>
        <div className="col-6 col-sm-3">
          <label className="form-label" htmlFor="f-qty">Quantité</label>
          <input id="f-qty" type="number" min="0" step="any" className="form-control" value={form.quantity} onChange={(e) => set({ quantity: e.target.value })} />
        </div>
        <div className="col-6 col-sm-3">
          <label className="form-label" htmlFor="f-min">Racheter sous</label>
          <input id="f-min" type="number" min="0" step="any" className="form-control" value={form.minQuantity} onChange={(e) => set({ minQuantity: e.target.value })} />
        </div>
        <div className="col-6 col-sm-3">
          <label className="form-label" htmlFor="f-date">Date limite</label>
          <input id="f-date" type="date" className="form-control" value={form.expiresAt} onChange={(e) => set({ expiresAt: e.target.value })} />
        </div>
        <div className="col-12">
          <button className="btn btn-ink w-100 py-2">{editing ? "Enregistrer les modifications" : "Ajouter au frigo"}</button>
        </div>
      </div>
    </form>
  );
}
