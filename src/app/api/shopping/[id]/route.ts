import { handle, idFrom, json, noContent } from "@/server/http";
import { deleteShoppingItem, updateShoppingItem } from "@/server/shopping";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  return handle(async () => json(await updateShoppingItem(await idFrom(params), await req.json())));
}

export async function DELETE(_req: Request, { params }: Ctx) {
  return handle(async () => {
    await deleteShoppingItem(await idFrom(params));
    return noContent();
  });
}
