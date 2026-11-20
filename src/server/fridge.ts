import { prisma } from "@/lib/prisma";
import { HttpError } from "./http";
import { updateProduct, upsertProduct } from "./products";
import { syncShopping } from "./shopping";

export const listFridge = () => prisma.fridgeItem.findMany({ include: { product: true } });

export async function addFridgeItem(input: {
  name?: string;
  category?: string;
  unit?: string;
  quantity?: number;
  minQuantity?: number;
  expiresAt?: string | null;
}) {
  if (!input.name?.trim()) throw new HttpError(400, "Le nom est obligatoire");
  const product = await upsertProduct(input.name, input.category, input.unit);
  const quantity = Number(input.quantity ?? 1);
  const minQuantity = Number(input.minQuantity ?? 0);
  const date = input.expiresAt ? new Date(input.expiresAt) : null;

  const existing = await prisma.fridgeItem.findUnique({ where: { productId: product.id } });
  const item = existing
    ? await prisma.fridgeItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity, minQuantity, expiresAt: date ?? existing.expiresAt },
        include: { product: true },
      })
    : await prisma.fridgeItem.create({
        data: { productId: product.id, quantity, minQuantity, expiresAt: date },
        include: { product: true },
      });

  await syncShopping(product.id, item.quantity, item.minQuantity);
  return item;
}

export async function updateFridgeItem(
  id: number,
  body: {
    name?: string;
    category?: string;
    unit?: string;
    quantity?: number;
    minQuantity?: number;
    expiresAt?: string | null;
  }
) {
  const current = await prisma.fridgeItem.findUnique({ where: { id } });
  if (!current) throw new HttpError(404, "Produit introuvable");

  const data: { quantity?: number; minQuantity?: number; expiresAt?: Date | null } = {};
  if (body.quantity !== undefined) data.quantity = Math.max(Number(body.quantity), 0);
  if (body.minQuantity !== undefined) data.minQuantity = Math.max(Number(body.minQuantity), 0);
  if (body.expiresAt !== undefined) data.expiresAt = body.expiresAt ? new Date(body.expiresAt) : null;

  await updateProduct(current.productId, body);
  const item = await prisma.fridgeItem.update({ where: { id }, data, include: { product: true } });
  await syncShopping(item.productId, item.quantity, item.minQuantity);
  return item;
}

export const deleteFridgeItem = (id: number) => prisma.fridgeItem.delete({ where: { id } });
