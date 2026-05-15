import { useCallback, useEffect, useState } from "react";
import { caseRepository } from "@/lib/storage/caseRepository";
import type { Case } from "@/types/case";

export function useCase(id: string | undefined) {
  const [caseItem, setCaseItem] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    if (!id) {
      setCaseItem(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await caseRepository.getCase(id);
      setCaseItem(data ?? null);
    } catch (e) {
      setError(e instanceof Error ? e : new Error("Nie udało się wczytać sprawy"));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { caseItem, loading, error, refresh, setCaseItem };
}
