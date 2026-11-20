"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { ShoppingInput, ShoppingItem } from "@/types";

export function useShopping() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    try {
      setItems(await api.get<ShoppingItem[]>("/api/shopping"));
    } catch {
      /* on garde la liste affichée */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Lève une ApiError si le serveur refuse : le formulaire l'affiche
  const save = useCallback(
    async (id: number | null, data: ShoppingInput) => {
      if (id) await api.patch(`/api/shopping/${id}`, data);
      else await api.post("/api/shopping", data);
      await load();
    },
    [load]
  );

  const toggle = useCallback(
    async (item: ShoppingItem) => {
      try {
        await api.patch(`/api/shopping/${item.id}`, { checked: !item.checked });
      } catch {
        /* ignoré */
      }
      await load();
    },
    [load]
  );

  const remove = useCallback(
    async (id: number) => {
      try {
        await api.delete(`/api/shopping/${id}`);
      } catch {
        /* ignoré */
      }
      await load();
    },
    [load]
  );

  const checkout = useCallback(async () => {
    try {
      await api.post("/api/shopping/checkout");
    } catch {
      /* ignoré */
    }
    await load();
  }, [load]);

  return { items, loaded, save, toggle, remove, checkout };
}
