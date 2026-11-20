"use client";

import { CATEGORIES } from "@/lib/constants";
import CategoryIcon from "./CategoryIcon";

export default function CategoryPicker({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <div className="cat-picker" role="radiogroup" aria-label="Catégorie">
      {CATEGORIES.map((c) => (
        <button type="button" key={c} role="radio" aria-checked={value === c} className={`cat-pick ${value === c ? "active" : ""}`} onClick={() => onChange(c)}>
          <CategoryIcon category={c} size={22} />
          <span>{c}</span>
        </button>
      ))}
    </div>
  );
}
