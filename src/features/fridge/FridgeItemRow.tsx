import CategoryIcon from "@/components/ui/CategoryIcon";
import type { FridgeItem } from "@/types";
import { daysLeft, expiryText, round, stepFor } from "./fridge.utils";

interface Props {
  item: FridgeItem;
  onQuantity: (id: number, quantity: number) => void;
  onEdit: (item: FridgeItem) => void;
  onRemove: (id: number) => void;
}

export default function FridgeItemRow({ item, onQuantity, onEdit, onRemove }: Props) {
  const days = daysLeft(item.expiresAt);
  const isLow = item.quantity <= item.minQuantity;
  const state = days !== null && days < 0 ? "expired" : days !== null && days <= 3 ? "soon" : isLow ? "low" : "";
  const step = stepFor(item.product.unit);
  const unit = item.product.unit;

  return (
    <div className={`item ${state}`}>
      <span className="cat-icon"><CategoryIcon category={item.product.category} /></span>
      <div className="me-auto">
        <div className="item-name">
          {item.product.name}
          {isLow && <span className="tag">À racheter</span>}
        </div>
        <div className="item-meta">
          {item.product.category}
          {item.expiresAt && ` – ${expiryText(days)}`}
        </div>
      </div>
      <div className="stepper">
        <button onClick={() => onQuantity(item.id, round(item.quantity - step))} aria-label={`Retirer ${step} ${unit}`}>−</button>
        <span className="qty">{item.quantity} {unit}</span>
        <button onClick={() => onQuantity(item.id, round(item.quantity + step))} aria-label={`Ajouter ${step} ${unit}`}>+</button>
      </div>
      <div className="actions">
        <button className="ghost edit" onClick={() => onEdit(item)} aria-label={`Modifier ${item.product.name}`}>Modifier</button>
        <button className="ghost" onClick={() => onRemove(item.id)} aria-label={`Supprimer ${item.product.name}`}>Supprimer</button>
      </div>
    </div>
  );
}
