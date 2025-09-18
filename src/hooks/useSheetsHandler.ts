/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useCallback, useEffect, useState } from "react";
import type { Pagination, Sheets } from "../types/types";
import { getSheets, indexSheets } from "../api/api";

export function useSheetsHandler(isOpen: boolean) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sheets, setSheets] = useState<{ sheets: Sheets[]; pagination: Pagination }>();
  const [isLoadingSheets, setIsLoadingSheets] = useState(false);
  const [selectedSheets, setSelectedSheets] = useState<Sheets[]>([]);
  const [selectedForIndexing, setSelectedForIndexing] = useState<Set<string>>(
    new Set()
  );

  const totalPages = sheets?.pagination?.totalPages || 1;

  useEffect(() => {
    if (!isOpen) return;
    const controller = new AbortController();

    const fetchSheets = async () => {
      setIsLoadingSheets(true);
      try {
        const res = await getSheets(currentPage);
        if (!controller.signal.aborted) {
          setSheets(res);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error("getFiles error:", err);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingSheets(false);
        }
      }
    };

    fetchSheets();
    return () => controller.abort();
  }, [isOpen, currentPage]);

  const toggleSheetsSelection = useCallback(
    (id: string) => {
      if (!sheets) return;
      const sheet = sheets.sheets?.find((f) => String(f.id) === id);
      if (!sheet || sheet.name.startsWith("_indexed")) return;

      setSelectedForIndexing((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
      });
    },
    [sheets]
  );

  const handleCancel = useCallback(() => {
    setSelectedSheets([]);
    setSelectedForIndexing(new Set());
  }, []);

  const handleIndexing = useCallback(
    async (clearAll: boolean) => {
      const ids = Array.from(selectedForIndexing);
      indexSheets(clearAll, ids);
    },
    [selectedForIndexing]
  );

  return {
    sheets,
    handleCancel,
    toggleSheetsSelection,
    selectedSheets,
    selectedForIndexing,
    isLoadingSheets,
    handleIndexing,
    setCurrentPage,
    currentPage,
    totalPages
  } as const;
}
