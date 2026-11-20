import type { ShoppingItem } from "@/types";

interface Props {
  item: ShoppingItem;
  onToggle: (item: ShoppingItem) => void;
  onEdit: (item: ShoppingItem) => void;
  onRemove: (id: number) => void;
}

export default function ShoppingItemRow({ item, onToggle, onEdit, onRemove }: Props) {
  return (
    <div className={`item ${item.checked ? "done" : ""}`}>
      <input type="checkbox" id={`s-${item.id}`} className="form-check-input m-0 flex-none" style={{ width: 26, height: 26 }} checked={item.checked} onChange={() => onToggle(item)} />
      <label htmlFor={`s-${item.id}`} className="item-name me-auto flex-grow-1" style={{ cursor: "pointer" }}>{item.product.name}</label>
      <span className="item-meta">{item.quantity} {item.product.unit}</span>
      <div className="actions">
        <button className="ghost edit" onClick={() => onEdit(item)} aria-label={`Modifier ${item.product.name}`}>Modifier</button>
        <button className="ghost" onClick={() => onRemove(item.id)} aria-label={`Supprimer ${item.product.name}`}>Supprimer</button>
      </div>
    </div>
  );
}
