import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export const json = (data: unknown, status = 200) => NextResponse.json(data, { status });
export const noContent = () => new NextResponse(null, { status: 204 });
export async function idFrom(params: Promise<{ id: string }>) {
  return Number((await params).id);
}

// Convertit les erreurs métier en réponses JSON ; les autres erreurs restent des 500
export async function handle(fn: () => Promise<Response>): Promise<Response> {
  try {
    return await fn();
  } catch (e) {
    if (e instanceof HttpError) return json({ error: e.message }, e.status);
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return json({ error: "Un produit porte déjà ce nom" }, 409);
    }
    throw e;
  }
}
