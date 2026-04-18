import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { LiveMod } from "./useLiveServers";

export type ModCategory = "VEHICULOS" | "ARMAS" | "MAPAS" | "SCRIPTS" | "OTROS";

export const MOD_CATEGORIES: { key: ModCategory | "TODOS"; label: string }[] = [
  { key: "TODOS", label: "TODOS" },
  { key: "VEHICULOS", label: "VEHÍCULOS" },
  { key: "ARMAS", label: "ARMAS" },
  { key: "MAPAS", label: "MAPAS" },
  { key: "SCRIPTS", label: "SCRIPTS" },
  { key: "OTROS", label: "OTROS" },
];

export const useModCategories = (mods: LiveMod[]) => {
  // Stable key based on mod IDs so it only refetches when the set of mods changes
  const idsKey = mods.map((m) => m.modId).sort().join(",");

  return useQuery({
    queryKey: ["mod-categories", idsKey],
    queryFn: async (): Promise<Record<string, ModCategory>> => {
      if (mods.length === 0) return {};
      const { data, error } = await supabase.functions.invoke("classify-mods", {
        body: { mods: mods.map((m) => ({ modId: m.modId, name: m.name })) },
      });
      if (error) throw error;
      return (data?.categories ?? {}) as Record<string, ModCategory>;
    },
    enabled: mods.length > 0,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};
