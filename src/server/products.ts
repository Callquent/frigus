import { prisma } from "@/lib/prisma";

export function upsertProduct(name: string, category?: string, unit?: string) {
  const clean = name.trim();
  return prisma.product.upsert({
    where: { name: clean },
    update: {},
    create: { name: clean, category: category || "Divers", unit: unit || "unité" },
  });
}

export async function updateProduct(
  id: number,
  body: { name?: string; category?: string; unit?: string }
) {
  const data: { name?: string; category?: string; unit?: string } = {};
  if (body.name?.trim()) data.name = body.name.trim();
  if (body.category) data.category = body.category;
  if (body.unit) data.unit = body.unit;
  if (Object.keys(data).length) await prisma.product.update({ where: { id }, data });
}
