"use client";

import { useState } from "react";
import CategoryIcon from "@/components/ui/CategoryIcon";
import FridgeIcon from "@/components/ui/FridgeIcon";
import { CATEGORIES } from "@/lib/constants";
import type { FridgeItem } from "@/types";
import FridgeForm from "./FridgeForm";
import FridgeItemRow from "./FridgeItemRow";
import { daysLeft } from "./fridge.utils";
import { useFridge } from "./useFridge";

export default function FridgeView() {
  const { items, loaded, save, update, remove } = useFridge();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<FridgeItem | null>(null);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("");

  function closeForm() {
    setEditing(null);
    setOpen(false);
  }

  function startEdit(item: FridgeItem) {
    setEditing(item);
    setOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const soon = items.filter((i) => {
    const d = daysLeft(i.expiresAt);
    return d !== null && d <= 3;
  }).length;
  const low = items.filter((i) => i.quantity <= i.minQuantity).length;
  const presentCats = CATEGORIES.filter((c) => items.some((i) => i.product.category === c));

  const visible = items
    .filter((i) => (!cat || i.product.category === cat) && i.product.name.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => {
      if (!a.expiresAt) return 1;
      if (!b.expiresAt) return -1;
      return a.expiresAt.localeCompare(b.expiresAt);
    });

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-3 gap-2">
        <h1 className="page-title d-flex align-items-center gap-2"><FridgeIcon size={28} />Dans le frigo</h1>
        <button className="btn btn-ink" onClick={() => (open ? closeForm() : setOpen(true))} aria-expanded={open}>
          {open ? "Fermer" : "Ajouter un produit"}
        </button>
      </div>

      {open && <FridgeForm key={editing?.id ?? "new"} editing={editing} onSubmit={save} onClose={closeForm} />}

      {loaded && items.length > 0 && (
        <>
          <div className="panel stats mb-3">
            <div><strong>{items.length}</strong><span>en stock</span></div>
            <div className={soon ? "warn" : ""}><strong>{soon}</strong><span>à consommer vite</span></div>
            <div className={low ? "alert-low" : ""}><strong>{low}</strong><span>à racheter</span></div>
          </div>

          <input type="search" className="form-control mb-2" placeholder="Rechercher un produit" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Rechercher un produit" />
          <div className="chips mb-3">
            <button className={`chip ${cat === "" ? "active" : ""}`} onClick={() => setCat("")}>Tout</button>
            {presentCats.map((c) => (
              <button key={c} className={`chip ${cat === c ? "active" : ""}`} onClick={() => setCat(c)}>
                <CategoryIcon category={c} size={16} />{c}
              </button>
            ))}
          </div>
        </>
      )}

      {loaded && items.length === 0 && (
        <div className="empty">
          <p className="mb-3">Le frigo est vide. Ajoutez vos premiers produits pour suivre les dates et préparer vos courses.</p>
          {!open && <button className="btn btn-ink" onClick={() => setOpen(true)}>Ajouter un produit</button>}
        </div>
      )}

      {items.length > 0 && visible.length === 0 && <p className="empty">Aucun produit ne correspond à cette recherche.</p>}

      <div className="d-grid gap-2">
        {visible.map((item) => (
          <FridgeItemRow key={item.id} item={item} onQuantity={(id, quantity) => update(id, { quantity })} onEdit={startEdit} onRemove={remove} />
        ))}
      </div>
    </>
  );
}
