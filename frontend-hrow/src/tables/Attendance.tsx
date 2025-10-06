import * as React from "react";
import type { Worker } from "./Workers";

export interface AttendanceEntry {
  present: boolean;
  comment: string;
}

export interface AttendanceRecord {
  workerId: number;
  dates: { [date: string]: AttendanceEntry };
}

export interface AttendanceColumn {
  date: string;
  isDateValid: boolean;
}

interface AttendanceTableProps {
  workers: Worker[];

  // saved state (persisted)
  columns: AttendanceColumn[];
  setColumns: (cols: AttendanceColumn[]) => void;
  records: AttendanceRecord[];
  setRecords: (recs: AttendanceRecord[]) => void;

  // draft state (for editing / Apply/Cancel)
  editedColumns: AttendanceColumn[];
  setEditedColumns: (cols: AttendanceColumn[]) => void;
  editedRecords: AttendanceRecord[];
  setEditedRecords: (recs: AttendanceRecord[]) => void;

  // editing flag (from parent ButtonHolder flow)
  isEditing: boolean;

  // optional add-column callback (parent can provide, otherwise component will update edited state)
  onAddColumn?: () => void;
}

export default function AttendanceTable({
  workers,
  columns,
  setColumns,
  records,
  setRecords,
  editedColumns,
  setEditedColumns,
  editedRecords,
  setEditedRecords,
  isEditing,
  onAddColumn,
}: AttendanceTableProps) {
  const activeColumns = isEditing ? editedColumns : columns;
  const activeRecords = isEditing ? editedRecords : records;

  const isDateValid = (d: string) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(d) && !isNaN(Date.parse(d));
  };

  const ensureRecordsForWorkers = (recs: AttendanceRecord[]) => {
    const byId = new Map(recs.map((r) => [r.workerId, r]));
    return workers.map((w) =>
      byId.has(w.id) ? byId.get(w.id)! : { workerId: w.id, dates: {} }
    );
  };

  const handleDateChange = (colIndex: number, newDate: string) => {
    const valid = isDateValid(newDate);
    if (isEditing) {
      const oldDate = editedColumns[colIndex]?.date ?? "";
      const next = editedColumns.map((c, i) =>
        i === colIndex ? { ...c, date: newDate, isDateValid: valid } : c
      );
      setEditedColumns(next);

      if (oldDate && newDate && oldDate !== newDate) {
        setEditedRecords(
          editedRecords.map((r) => {
            if (r.dates[oldDate]) {
              const { [oldDate]: oldEntry, ...rest } = r.dates;
              return { ...r, dates: { ...rest, [newDate]: oldEntry } };
            }
            return r;
          })
        );
      }
    } else {
      const oldDate = columns[colIndex]?.date ?? "";
      const next = columns.map((c, i) =>
        i === colIndex ? { ...c, date: newDate, isDateValid: valid } : c
      );
      setColumns(next);

      if (oldDate && newDate && oldDate !== newDate) {
        setRecords(
          records.map((r) => {
            if (r.dates[oldDate]) {
              const { [oldDate]: oldEntry, ...rest } = r.dates;
              return { ...r, dates: { ...rest, [newDate]: oldEntry } };
            }
            return r;
          })
        );
      }
    }
  };

  // ✅ properly closed function
  const togglePresent = (workerId: number, date: string) => {
    if (!isEditing) return;
    if (!date || !isDateValid(date)) return;

    setEditedRecords(
      editedRecords.map((r) =>
        r.workerId === workerId
          ? {
              ...r,
              dates: {
                ...r.dates,
                [date]: {
                  ...(r.dates[date] ?? { present: false, comment: "" }),
                  present: !(r.dates[date]?.present ?? false),
                },
              },
            }
          : r
      )
    );
  };

  // ✅ separate function (was nested before)
  const updateComment = (workerId: number, date: string, value: string) => {
    if (!isEditing) return;
    if (!date || !isDateValid(date)) return;

    setEditedRecords(
      editedRecords.map((r) =>
        r.workerId === workerId
          ? {
              ...r,
              dates: {
                ...r.dates,
                [date]: {
                  ...(r.dates[date] ?? { present: false, comment: "" }),
                  comment: value,
                },
              },
            }
          : r
      )
    );
  };

  // ✅ separate function
  const addDateColumn = () => {
    if (onAddColumn) {
      onAddColumn();
      return;
    }
    const newCol: AttendanceColumn = { date: "", isDateValid: true };
    setEditedColumns([...editedColumns, newCol]);
    setEditedRecords(
      editedRecords.map((r) => ({
        ...r,
        dates: {
          ...r.dates,
          "": { present: false, comment: "" },
        },
      }))
    );
  };

  React.useEffect(() => {
    setRecords(ensureRecordsForWorkers(records));
    setEditedRecords(ensureRecordsForWorkers(editedRecords));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workers.map((w) => w.id).join(",")]);

  return (
    <div className="attendance-table-wrapper">
      <table>
        <thead>
          <tr className="dateEditor">
            <th></th>
            {activeColumns.map((col, colIndex) => (
              <th key={`date-${colIndex}`} colSpan={2}>
                <div>
                  <span>Date: </span>
                  <input
                    type="text"
                    value={col.date}
                    onChange={(e) => handleDateChange(colIndex, e.target.value)}
                    placeholder="YYYY-MM-DD"
                  />
                  {isEditing && colIndex === activeColumns.length - 1 && (
                    <button onClick={addDateColumn} className="add-date">
                      +
                    </button>
                  )}
                </div>
              </th>
            ))}
          </tr>

          <tr>
            <th>Full Name</th>
            {activeColumns.map((_, colIndex) => (
              <React.Fragment key={`hdr-${colIndex}`}>
                <th
                  key={`present-${colIndex}`}
                  className="presence-table-header"
                >
                  Present
                </th>
                <th
                  key={`comment-${colIndex}`}
                  className="presence-table-header"
                >
                  Comment
                </th>
              </React.Fragment>
            ))}
          </tr>
        </thead>

        <tbody>
          {workers.map((worker) => {
            // get the record for this worker from the appropriate array
            const record = activeRecords.find(
              (r) => r.workerId === worker.id
            ) ?? {
              workerId: worker.id,
              dates: {},
            };

            return (
              <tr key={worker.id}>
                <td>
                  {worker.name} {worker.surname}
                </td>

                {activeColumns.map((col, colIndex) => {
                  const dateKey = col.date;
                  const entry = record.dates[dateKey] ?? {
                    present: false,
                    comment: "",
                  };

                  const canEditCell = isEditing && !!dateKey && col.isDateValid;

                  return (
                    <React.Fragment key={`cells-${worker.id}-${colIndex}`}>
                      <td key={`check-${worker.id}-${colIndex}`}>
                        <input
                          type="checkbox"
                          checked={entry.present}
                          onChange={() => togglePresent(worker.id, dateKey)}
                          disabled={!canEditCell}
                        />
                      </td>

                      <td key={`comment-${worker.id}-${colIndex}`}>
                        <input
                          type="text"
                          value={entry.comment}
                          onChange={(e) =>
                            updateComment(worker.id, dateKey, e.target.value)
                          }
                          placeholder="Optional"
                          disabled={!canEditCell}
                        />
                      </td>
                    </React.Fragment>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Error message: show if any active column has invalid date */}
      {activeColumns.some((c) => !c.isDateValid) && (
        <p className="incorrect-date-alert">
          ❌ Please enter valid dates in YYYY-MM-DD format.
        </p>
      )}

      {/* (If parent didn't provide onAddColumn, the local addDateColumn will update edited state) */}
      {/* Note: Add button is rendered in the header next to the last date input when editing. */}
    </div>
  );
}
