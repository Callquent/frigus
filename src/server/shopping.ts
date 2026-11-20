import { prisma } from "@/lib/prisma";
import { HttpError } from "./http";
import { updateProduct, upsertProduct } from "./products";

export const listShopping = () =>
  prisma.shoppingItem.findMany({ include: { product: true }, orderBy: { createdAt: "asc" } });

export async function addShoppingItem(input: {
  name?: string;
  category?: string;
  unit?: string;
  quantity?: number;
}) {
  if (!input.name?.trim()) throw new HttpError(400, "Le nom est obligatoire");
  const product = await upsertProduct(input.name, input.category, input.unit);
  return prisma.shoppingItem.create({
    data: { productId: product.id, quantity: Number(input.quantity ?? 1) },
    include: { product: true },
  });
}

export async function updateShoppingItem(
  id: number,
  body: { checked?: boolean; quantity?: number; name?: string; category?: string; unit?: string }
) {
  const current = await prisma.shoppingItem.findUnique({ where: { id } });
  if (!current) throw new HttpError(404, "Article introuvable");

  const data: { checked?: boolean; quantity?: number } = {};
  if (body.checked !== undefined) data.checked = Boolean(body.checked);
  if (body.quantity !== undefined) data.quantity = Math.max(Number(body.quantity), 1);

  await updateProduct(current.productId, body);
  return prisma.shoppingItem.update({ where: { id }, data, include: { product: true } });
}

export const deleteShoppingItem = (id: number) => prisma.shoppingItem.delete({ where: { id } });

// Transfère les articles cochés dans le frigo, puis les retire de la liste
export async function checkoutShopping() {
  const checked = await prisma.shoppingItem.findMany({ where: { checked: true } });
  for (const s of checked) {
    const existing = await prisma.fridgeItem.findUnique({ where: { productId: s.productId } });
    if (existing) {
      await prisma.fridgeItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + s.quantity },
      });
    } else {
      await prisma.fridgeItem.create({ data: { productId: s.productId, quantity: s.quantity } });
    }
  }
  await prisma.shoppingItem.deleteMany({ where: { checked: true } });
  return { moved: checked.length };
}

// Ajoute le produit à la liste de courses si le stock est sous le seuil minimum
export async function syncShopping(productId: number, quantity: number, minQuantity: number) {
  if (quantity > minQuantity) return;
  const pending = await prisma.shoppingItem.findFirst({ where: { productId, checked: false } });
  if (pending) return;
  await prisma.shoppingItem.create({
    data: { productId, quantity: Math.max(minQuantity - quantity, 1) },
  });
}
