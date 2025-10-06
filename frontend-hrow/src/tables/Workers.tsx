import { useTableSort } from "../helpers/handleSort";

export interface Worker {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  index: string;
  fieldOfStudy: string;
  section: string;
}

interface WorkersTableProps {
  selectedRows: number[];
  setSelectedRows: (rows: number[]) => void;
  isEditing: boolean;
  editedData: Worker[];
  setEditedData: (data: Worker[]) => void;
  data: Worker[];
  handleAddEntry: () => void;
}

export default function WorkersTable({
  selectedRows,
  setSelectedRows,
  isEditing,
  editedData,
  setEditedData,
  data,
  handleAddEntry,
}: WorkersTableProps) {
  //   const [sortConfig, setSortConfig] = useState<{
  //     key: SortKey;
  //     direction: SortDirection;
  //   }>({ key: null, direction: "asc" });

  const toggleSelected = (id: number) => {
    setSelectedRows(
      selectedRows.includes(id)
        ? selectedRows.filter((x) => x !== id)
        : [...selectedRows, id]
    );
  };
  const { sortedRows, handleSort, sortConfig } = useTableSort(
    isEditing ? editedData : data,
    selectedRows
  );

  const handleEditChange = (id: number, key: keyof Worker, value: string) => {
    const updated = editedData.map((row) =>
      row.id === id ? { ...row, [key]: value } : row
    );
    setEditedData(updated);
  };

  const columns: {
    header: string;
    key: keyof Worker;
    sortable?: boolean;
    editable?: boolean;
  }[] = [
    { header: "ID", key: "id", editable: false },
    { header: "Name", key: "name", editable: true },
    { header: "Surname", key: "surname", editable: true },
    { header: "Email", key: "email", sortable: false, editable: true },
    { header: "Phone", key: "phone", sortable: false, editable: true },
    { header: "Index", key: "index", editable: true },
    { header: "Field of Study", key: "fieldOfStudy", editable: true },
    { header: "Section", key: "section", editable: true },
  ];

  return (
    <div>
      <table className="workers-table">
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
          {sortedRows.map((row) => (
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
                <td key={col.key} className="data-cell">
                  {isEditing && col.editable !== false ? (
                    <input
                      type="text"
                      value={
                        editedData.find((r) => r.id === row.id)?.[col.key] ?? ""
                      }
                      onChange={(e) =>
                        handleEditChange(row.id, col.key, e.target.value)
                      }
                    />
                  ) : (
                    row[col.key]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {isEditing && (
        <button className="add-btn" onClick={handleAddEntry}>
          ➕ Add Worker
        </button>
      )}
    </div>
  );
}
