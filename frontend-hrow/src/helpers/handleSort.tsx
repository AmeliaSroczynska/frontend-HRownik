import { useState } from "react";

// This is a specialized hook for sorting in tables

export type SortDirection = "asc" | "desc";
export type SortKey<T> = keyof T | "__selected__";

export interface SortConfig<T> {
  key: SortKey<T> | null;
  direction: SortDirection;
}

export function useTableSort<T extends { id: number }>(
  rows: T[],
  selectedRows: number[]
) {
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>({
    key: null,
    direction: "asc",
  });

  const handleSort = (key: SortKey<T>) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedRows = [...rows].sort((a, b) => {
    const key = sortConfig.key;
    if (!key) return 0;

    // Sorting by checkbox selection
    if (key === "__selected__") {
      const aSel = selectedRows.includes(a.id);
      const bSel = selectedRows.includes(b.id);
      if (aSel === bSel) return 0;
      return sortConfig.direction === "asc" ? (aSel ? -1 : 1) : aSel ? 1 : -1;
    }

    const x = a[key];
    const y = b[key];

    if (x == null && y == null) return 0;
    if (x == null) return sortConfig.direction === "asc" ? -1 : 1;
    if (y == null) return sortConfig.direction === "asc" ? 1 : -1;

    if (typeof x === "number" && typeof y === "number") {
      return sortConfig.direction === "asc" ? x - y : y - x;
    }

    const xs = String(x).toLowerCase();
    const ys = String(y).toLowerCase();
    if (xs < ys) return sortConfig.direction === "asc" ? -1 : 1;
    if (xs > ys) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  return { sortedRows, handleSort, sortConfig };
}
