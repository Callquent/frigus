import { listFridge } from "@/server/fridge";
import { handle, json } from "@/server/http";

export const dynamic = "force-dynamic";

/**
 * Flux « frigo » lu par les autres applications (ex. Recipere) via Triviae > Liens.
 *   GET /api/frigo -> { items: [{ name, category, quantity, unit, expiresAt }] }
 * Seuls les produits réellement présents (quantité > 0) sont listés.
 */
export async function GET() {
  return handle(async () => {
    const items = (await listFridge())
      .filter((i) => i.quantity > 0)
      .map((i) => ({
        name: i.product.name,
        category: i.product.category,
        quantity: i.quantity,
        unit: i.product.unit,
        expiresAt: i.expiresAt ? i.expiresAt.toISOString().slice(0, 10) : null,
      }));
    return json({ items });
  });
}
