import { handle, json } from "@/server/http";
import { addShoppingItem, listShopping } from "@/server/shopping";

export const dynamic = "force-dynamic";

export async function GET() {
  return handle(async () => json(await listShopping()));
}

export async function POST(req: Request) {
  return handle(async () => json(await addShoppingItem(await req.json()), 201));
}
