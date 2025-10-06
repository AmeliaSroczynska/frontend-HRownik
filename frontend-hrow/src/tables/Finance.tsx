import { type Worker } from "./Workers";
import { useTableSort } from "../helpers/handleSort";
export interface FinanceEntry {
  id: number;
  name: string;
  amount: number;
  workerId: number | null; // responsible worker
}

type FinanceType = "expense" | "revenue";

interface FinanceTableProps {
  title: string;
  type: FinanceType;
  workers: Worker[];
  data: FinanceEntry[];
  selectedRows: number[];
  setSelectedRows: (rows: number[]) => void;
  isEditing: boolean;
  editedData: FinanceEntry[];
  setEditedData: (data: FinanceEntry[]) => void;
  onAdd: () => void;
}

export default function FinanceTable({
  title,
  type,
  workers,
  data,
  selectedRows,
  setSelectedRows,
  isEditing,
  editedData,
  setEditedData,
  onAdd,
}: FinanceTableProps) {
  const toggleSelected = (id: number) => {
    setSelectedRows(
      selectedRows.includes(id)
        ? selectedRows.filter((x) => x !== id)
        : [...selectedRows, id]
    );
  };
  const { sortedRows, handleSort, sortConfig } = useTableSort<FinanceEntry>(
    isEditing ? editedData : data,
    selectedRows
  );

  const handleEditChange = (
    rowIndex: number,
    key: keyof FinanceEntry,
    value: string | number | null
  ) => {
    const updated = [...editedData];
    updated[rowIndex] = {
      ...updated[rowIndex],
      [key]:
        key === "amount"
          ? Number(value)
          : key === "workerId"
          ? (value as number | null)
          : value,
    };
    setEditedData(updated);
  };

  const columns: {
    header: string;
    key: keyof FinanceEntry;
    sortable?: boolean;
    editable?: boolean;
  }[] = [
    { header: "Name", key: "name", editable: true },
    { header: "Amount", key: "amount", editable: true },
    { header: "Responsible", key: "workerId", editable: true },
  ];

  return (
    <div className="finance-wrapper">
      <h2>{title}</h2>
      <table className={`finance-${type}`}>
        <thead>
          <tr>
            <th
              className="select-column"
              onClick={() => handleSort("__selected__")}
            >
              ✔
              {sortConfig.key === "__selected__" &&
                (sortConfig.direction === "asc" ? " ▲" : " ▼")}
            </th>
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
              <td className="select-cell">
                <input
                  type="checkbox"
                  checked={selectedRows.includes(row.id)}
                  onChange={() => toggleSelected(row.id)}
                />
              </td>
              {columns.map((col) => (
                <td key={col.key} className={`data-cell column-${col.key}`}>
                  {isEditing && col.editable ? (
                    col.key === "workerId" ? (
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
                        <option value="">-- None --</option>
                        {workers.map((w) => (
                          <option key={w.id} value={w.id}>
                            {w.name} {w.surname}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={col.key === "amount" ? "number" : "text"}
                        value={editedData[i]?.[col.key] ?? ""}
                        onChange={(e) =>
                          handleEditChange(i, col.key, e.target.value)
                        }
                        className={
                          col.key === "amount"
                            ? type === "expense"
                              ? "amount-expense"
                              : "amount-revenue"
                            : ""
                        }
                      />
                    )
                  ) : col.key === "workerId" ? (
                    workers.find((w) => w.id === row.workerId) ? (
                      `${workers.find((w) => w.id === row.workerId)!.name} ${
                        workers.find((w) => w.id === row.workerId)!.surname
                      }`
                    ) : (
                      "—"
                    )
                  ) : (
                    <span
                      className={
                        col.key === "amount"
                          ? type === "expense"
                            ? "amount-expense"
                            : "amount-revenue"
                          : ""
                      }
                    >
                      {row[col.key]}
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>

        {isEditing && (
          <tfoot>
            <tr>
              <td colSpan={columns.length + 1}>
                <button className="add-btn" type="button" onClick={onAdd}>
                  ➕ Add {type === "expense" ? "Expense" : "Revenue"}
                </button>
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
