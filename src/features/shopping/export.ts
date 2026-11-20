import { CATEGORIES } from "@/lib/constants";
import type { ShoppingItem } from "@/types";

// Texte de la liste : uniquement les articles restant à acheter, groupés par catégorie
export function buildListText(items: ShoppingItem[]) {
  const toBuy = items.filter((i) => !i.checked);
  const sections = CATEGORIES.map((c) => ({ c, list: toBuy.filter((i) => i.product.category === c) }))
    .filter((g) => g.list.length > 0)
    .flatMap((g) => ["", g.c, ...g.list.map((i) => `☐ ${i.product.name} (${i.quantity} ${i.product.unit})`)]);
  return ["Liste de courses", ...sections].join("\n");
}

export async function copyText(text: string) {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
    return;
  }
  // Repli quand la page n'est pas servie en HTTPS
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  ta.setSelectionRange(0, ta.value.length);
  document.execCommand("copy");
  document.body.removeChild(ta);
}

export async function shareText(text: string): Promise<"shared" | "copied"> {
  if (navigator.share) {
    try {
      await navigator.share({ title: "Liste de courses", text });
    } catch {
      /* partage annulé */
    }
    return "shared";
  }
  await copyText(text);
  return "copied";
}

export function downloadText(text: string, filename = "liste-de-courses.txt") {
  const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
