import { deleteFridgeItem, updateFridgeItem } from "@/server/fridge";
import { handle, idFrom, json, noContent } from "@/server/http";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  return handle(async () => json(await updateFridgeItem(await idFrom(params), await req.json())));
}

export async function DELETE(_req: Request, { params }: Ctx) {
  return handle(async () => {
    await deleteFridgeItem(await idFrom(params));
    return noContent();
  });
}
