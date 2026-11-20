"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { FridgeInput, FridgeItem } from "@/types";

export function useFridge() {
  const [items, setItems] = useState<FridgeItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    try {
      setItems(await api.get<FridgeItem[]>("/api/fridge"));
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
    async (id: number | null, data: FridgeInput) => {
      if (id) await api.patch(`/api/fridge/${id}`, data);
      else await api.post("/api/fridge", data);
      await load();
    },
    [load]
  );

  const update = useCallback(
    async (id: number, data: Partial<FridgeInput>) => {
      try {
        await api.patch(`/api/fridge/${id}`, data);
      } catch {
        /* ignoré : la liste est rechargée */
      }
      await load();
    },
    [load]
  );

  const remove = useCallback(
    async (id: number) => {
      try {
        await api.delete(`/api/fridge/${id}`);
      } catch {
        /* ignoré */
      }
      await load();
    },
    [load]
  );

  return { items, loaded, save, update, remove };
}
