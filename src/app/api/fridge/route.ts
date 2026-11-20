import { addFridgeItem, listFridge } from "@/server/fridge";
import { handle, json } from "@/server/http";

export const dynamic = "force-dynamic";

export async function GET() {
  return handle(async () => json(await listFridge()));
}

export async function POST(req: Request) {
  return handle(async () => json(await addFridgeItem(await req.json()), 201));
}
