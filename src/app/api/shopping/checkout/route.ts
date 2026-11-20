import { handle, json } from "@/server/http";
import { checkoutShopping } from "@/server/shopping";

export async function POST() {
  return handle(async () => json(await checkoutShopping()));
}
