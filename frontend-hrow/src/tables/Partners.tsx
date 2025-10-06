import type { Worker } from "./Workers";
import { useTableSort } from "../helpers/handleSort";

export interface Partner {
  id: number;
  name: string;
  workerId: number | null;
  phone: string;
  email: string;
  status: "Pending" | "Approved" | "Rejected";
  comment: string;
}

interface PartnersTableProps {
  workers: Worker[];
  selectedRows: number[];
  setSelectedRows: (rows: number[]) => void;
  isEditing: boolean;
  editedData: Partner[];
  setEditedData: (data: Partner[]) => void;
  data: Partner[];
  handleAddEntry: () => void;
}

export default function PartnersTable({
  workers,
  selectedRows,
  setSelectedRows,
  isEditing,
  editedData,
  setEditedData,
  data,
  handleAddEntry,
}: PartnersTableProps) {
  const { sortedRows, handleSort, sortConfig } = useTableSort(
    isEditing ? editedData : data,
    selectedRows
  );

  const toggleSelected = (id: number) => {
    setSelectedRows(
      selectedRows.includes(id)
        ? selectedRows.filter((x) => x !== id)
        : [...selectedRows, id]
    );
  };
  const handleEditChange = (
    rowIndex: number,
    key: keyof Partner,
    value: string | number | null
  ) => {
    const updated = [...editedData];
    updated[rowIndex] = { ...updated[rowIndex], [key]: value };
    setEditedData(updated);
  };

  const columns: {
    header: string;
    key: keyof Partner | "__selected__";
    sortable?: boolean;
    render?: (row: Partner, i: number) => React.ReactNode;
  }[] = [
    {
      header: "✔",
      key: "__selected__",
      sortable: true,
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedRows.includes(row.id)}
          onChange={() => toggleSelected(row.id)}
        />
      ),
    },
    {
      header: "Name",
      key: "name",
      sortable: true,
      render: (row, i) =>
        isEditing ? (
          <input
            type="text"
            maxLength={64}
            value={editedData[i]?.name ?? ""}
            onChange={(e) => handleEditChange(i, "name", e.target.value)}
          />
        ) : (
          row.name
        ),
    },
    {
      header: "Worker",
      key: "workerId",
      sortable: true,
      render: (row, i) =>
        isEditing ? (
          <select
            value={editedData[i]?.workerId ?? ""}
            onChange={(e) =>
              handleEditChange(
                i,
                "workerId",
                e.target.value ? Number(e.target.value) : null
              )
            }
          >
            <option value="">-- Select Worker --</option>
            {workers.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name} {w.surname}
              </option>
            ))}
          </select>
        ) : (
          workers.find((w) => w.id === row.workerId)?.name ?? ""
        ),
    },
    {
      header: "Phone",
      key: "phone",
      sortable: false,
      render: (row, i) =>
        isEditing ? (
          <input
            type="text"
            value={editedData[i]?.phone ?? ""}
            onChange={(e) => handleEditChange(i, "phone", e.target.value)}
          />
        ) : (
          row.phone
        ),
    },
    {
      header: "Email",
      key: "email",
      sortable: false,
      render: (row, i) =>
        isEditing ? (
          <input
            type="text"
            value={editedData[i]?.email ?? ""}
            onChange={(e) => handleEditChange(i, "email", e.target.value)}
          />
        ) : (
          row.email
        ),
    },
    {
      header: "Status",
      key: "status",
      sortable: true,
      render: (row, i) =>
        isEditing ? (
          <select
            value={editedData[i]?.status ?? "Pending"}
            onChange={(e) =>
              handleEditChange(i, "status", e.target.value as Partner["status"])
            }
          >
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        ) : (
          row.status
        ),
    },
    {
      header: "Comment",
      key: "comment",
      sortable: false,
      render: (row, i) =>
        isEditing ? (
          <input
            type="text"
            value={editedData[i]?.comment ?? ""}
            onChange={(e) => handleEditChange(i, "comment", e.target.value)}
          />
        ) : (
          row.comment
        ),
    },
  ];

  return (
    <div className="partners-table-wrapper">
      <table className="partners-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={col.sortable === false ? "" : "sortable"}
                onClick={() =>
                  col.sortable === false ? undefined : handleSort(col.key)
                }
              >
                {col.header}
                {sortConfig.key === col.key &&
                  (sortConfig.direction === "asc" ? " ▲" : " ▼")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row, i) => (
            <tr
              key={row.id}
              className={selectedRows.includes(row.id) ? "selected-row" : ""}
            >
              {columns.map((col) => (
                <td key={col.key as string}>
                  {col.render
                    ? col.render(row, i)
                    : row[col.key as keyof Partner]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {isEditing && (
        <button className="add-btn" onClick={handleAddEntry}>
          ➕ Add Partner
        </button>
      )}
    </div>
  );
}
