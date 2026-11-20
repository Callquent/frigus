"use client";

import { useState } from "react";
import CategoryIcon from "@/components/ui/CategoryIcon";
import { CATEGORIES } from "@/lib/constants";
import type { ShoppingItem } from "@/types";
import { buildListText, copyText, downloadText, shareText } from "./export";
import ShoppingForm from "./ShoppingForm";
import ShoppingItemRow from "./ShoppingItemRow";
import { useShopping } from "./useShopping";

export default function ShoppingView() {
  const { items, loaded, save, toggle, remove, checkout } = useShopping();
  const [editing, setEditing] = useState<ShoppingItem | null>(null);
  const [notice, setNotice] = useState("");

  function flash(msg: string) {
    setNotice(msg);
    setTimeout(() => setNotice(""), 2500);
  }

  function startEdit(item: ShoppingItem) {
    setEditing(item);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const listText = buildListText(items);
  const toBuy = items.filter((i) => !i.checked).length;
  const done = items.length - toBuy;
  const pct = items.length ? Math.round((done / items.length) * 100) : 0;
  const grouped = CATEGORIES.map((c) => ({ category: c, items: items.filter((i) => i.product.category === c) })).filter((g) => g.items.length > 0);

  async function copy() {
    try {
      await copyText(listText);
      flash("Liste copiée");
    } catch {
      flash("Copie impossible");
    }
  }

  async function share() {
    try {
      if ((await shareText(listText)) === "copied") flash("Liste copiée");
    } catch {
      flash("Partage impossible");
    }
  }

  return (
    <>
      <h1 className="page-title mb-3">Liste de courses</h1>

      <ShoppingForm key={editing?.id ?? "new"} editing={editing} onSubmit={save} onCancel={() => setEditing(null)} />

      {items.length > 0 && (
        <div className="mb-2">
          <div className="d-flex justify-content-between small text-muted mb-1">
            <span>{done} sur {items.length} dans le panier</span>
            <span>{pct} %</span>
          </div>
          <div className="progress" style={{ height: 8 }} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
            <div className="progress-bar" style={{ width: `${pct}%`, background: "var(--mint)" }} />
          </div>
        </div>
      )}

      {toBuy > 0 && (
        <div className="export-bar">
          <button className="btn btn-outline-secondary" onClick={share}>Partager</button>
          <button className="btn btn-outline-secondary" onClick={copy}>Copier</button>
          <button className="btn btn-outline-secondary" onClick={() => downloadText(listText)}>Télécharger</button>
        </div>
      )}
      {notice && <div className="toast-note" role="status">{notice}</div>}

      {loaded && items.length === 0 && (
        <p className="empty">La liste est vide. Les produits du frigo passés sous leur seuil minimum s'ajoutent ici automatiquement.</p>
      )}

      {grouped.map((g) => (
        <section key={g.category}>
          <h2 className="category-title"><CategoryIcon category={g.category} size={18} />{g.category} ({g.items.length})</h2>
          <div className="d-grid gap-2">
            {g.items.map((item) => (
              <ShoppingItemRow key={item.id} item={item} onToggle={toggle} onEdit={startEdit} onRemove={remove} />
            ))}
          </div>
        </section>
      ))}

      {done > 0 && (
        <div className="checkout-bar">
          <button className="btn btn-ink w-100 py-2" onClick={checkout}>
            Ranger {done} article{done > 1 ? "s" : ""} dans le frigo
          </button>
        </div>
      )}
    </>
  );
}
