// import { useState } from "react";

type TableType = "workers" | "attendance" | "partners" | "finance";

interface Group {
  name: string;
  workerIds: number[];
}

interface ToolbarProps {
  activeTable: TableType;
  onChange: (table: TableType) => void;
  groups: Group[];
  onOpenCertificates: () => void; // ✅ new prop
}

export default function Menu({
  activeTable,
  onChange,
  // // groups,
  onOpenCertificates,
}: ToolbarProps) {
  return (
    <div className="navigation">
      <img src="/hrownik-header.png" className="nav-image" />

      <div className="nav-buttons">
        {(["workers", "attendance", "partners", "finance"] as TableType[]).map(
          (table) => (
            <button
              key={table}
              className={`nav-button ${activeTable === table ? "active" : ""}`}
              onClick={() => onChange(table)}
            >
              {table.toUpperCase()}
            </button>
          )
        )}

        <button className="nav-button" onClick={onOpenCertificates}>
          CERTIFICATES
        </button>
      </div>
    </div>
  );
}
