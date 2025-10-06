import { useState } from "react";
import { useEffect } from "react";

import Toolbar from "./components/Menu";
import ButtonHolder from "./components/ButtonHolder";

import WorkersTable, { type Worker } from "./tables/Workers";
import AttendanceTable, {
  type AttendanceColumn,
  type AttendanceRecord,
} from "./tables/Attendance";
import { getData, getFinance } from "./helpers/getData";
import type { FinanceEntry } from "./tables/Finance";
import type { Partner } from "./tables/Partners";
import FinanceTable from "./tables/Finance";
import PartnersTable from "./tables/Partners";
import GroupsModal, { type Group } from "./components/GroupsModal";
import CertificatesModal from "./components/CertificatesModal";

type TableType = "workers" | "attendance" | "finance" | "partners";

export default function TableWithToolbar() {
  const [activeTable, setActiveTable] = useState<TableType>("workers");

  // Generic editing flag and selection
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  // Workers state
  const [workers, setWorkers] = useState<Worker[]>(getData());
  const [editedWorkers, setEditedWorkers] = useState<Worker[]>(workers);

  // Partners state
  const [partners, setPartners] = useState<Partner[]>([]);
  const [editedPartners, setEditedPartners] = useState<Partner[]>([]);

  // Expenses state
  const [expenses, setExpenses] = useState<FinanceEntry[]>(getFinance());
  const [editedExpenses, setEditedExpenses] =
    useState<FinanceEntry[]>(expenses);
  const [selectedExpenses, setSelectedExpenses] = useState<number[]>([]);

  // Revenue state
  const [revenues, setRevenues] = useState<FinanceEntry[]>(getFinance());
  const [editedRevenues, setEditedRevenues] =
    useState<FinanceEntry[]>(revenues);
  const [selectedRevenues, setSelectedRevenues] = useState<number[]>([]);

  //Attendance state
  const [columns, setColumns] = useState<AttendanceColumn[]>([
    { date: "", isDateValid: true },
  ]);
  const [editedColumns, setEditedColumns] = useState<AttendanceColumn[]>(() => [
    ...columns,
  ]);

  const [records, setRecords] = useState<AttendanceRecord[]>(() =>
    workers.map((w) => ({ workerId: w.id, dates: {} }))
  );
  const [editedRecords, setEditedRecords] = useState<AttendanceRecord[]>(() => [
    ...records,
  ]);

  // Grouping state
  const [groups, setGroups] = useState<Group[]>([]);
  const [showGroups, setShowGroups] = useState(false);
  // Certificates state
  const [showCertificates, setShowCertificates] = useState(false);

  const [selectedGroup, setSelectedGroup] = useState<string>("");

  const handleCreateCertificate = () => {
    if (!selectedGroup) return alert("Please select a group first.");
    const group = groups.find((g) => g.name === selectedGroup);
    if (!group) return alert("Group not found.");
    alert(
      `This will create a certificate in full version for workers: ${group.workerIds.join(
        ", "
      )}`
    );
    setShowCertificates(false);
  };

  useEffect(() => {
    setRecords((prev) => {
      const byId = new Map(prev.map((r) => [r.workerId, r]));
      return workers.map((w) =>
        byId.has(w.id) ? byId.get(w.id)! : { workerId: w.id, dates: {} }
      );
    });
    setEditedRecords((prev) => {
      const byId = new Map(prev.map((r) => [r.workerId, r]));
      return workers.map((w) =>
        byId.has(w.id) ? byId.get(w.id)! : { workerId: w.id, dates: {} }
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workers.map((w) => w.id).join(",")]);

  // a specific handler for the finance table pair
  const hasSelection =
    activeTable === "finance"
      ? selectedExpenses.length > 0 || selectedRevenues.length > 0
      : selectedRows.length > 0;

  // helpers that switch by activeTable
  const handleEdit = () => {
    switch (activeTable) {
      case "workers":
        setEditedWorkers([...workers]);
        break;
      case "partners":
        setEditedPartners([...partners]);
        break;
      case "finance":
        setEditedExpenses([...expenses]);
        setEditedRevenues([...revenues]);
        break;
      case "attendance":
        setEditedColumns([...columns]);
        setEditedRecords([...records]);
        break;
    }
    setIsEditing(true);
  };

  //helpers for creating entries
  const createNewWorker = (): Worker => ({
    id: Date.now() + Math.floor(Math.random() * 1000),
    name: "",
    surname: "",
    email: "",
    phone: "",
    index: "",
    fieldOfStudy: "",
    section: "",
  });

  const createNewPartner = (): Partner => ({
    id: Date.now() + Math.floor(Math.random() * 1000),
    name: "",
    workerId: null,
    phone: "",
    email: "",
    status: "Pending", // default status
    comment: "",
  });

  const createNewFinanceEntry = (): FinanceEntry => ({
    id: Date.now() + Math.floor(Math.random() * 1000),
    name: "",
    amount: 0,
    workerId: null,
  });

  const handleApply = () => {
    switch (activeTable) {
      case "workers":
        setWorkers([...editedWorkers]);
        break;
      case "partners":
        setPartners([...editedPartners]);
        break;
      case "finance":
        setExpenses([...editedExpenses]);
        setRevenues([...editedRevenues]);
        break;
      case "attendance":
        setColumns([...editedColumns]);
        setRecords([...editedRecords]);
        break;
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    switch (activeTable) {
      case "workers":
        setEditedWorkers([...workers]);
        break;
      case "partners":
        setEditedPartners([...partners]);
        break;
      case "finance":
        setEditedExpenses([...expenses]);
        setEditedRevenues([...revenues]);
        break;
      case "attendance":
        setEditedColumns([...columns]);
        setEditedRecords([...records]);
        break;
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    switch (activeTable) {
      case "workers":
        setWorkers(workers.filter((w) => !selectedRows.includes(w.id)));
        setEditedWorkers(
          editedWorkers.filter((w) => !selectedRows.includes(w.id))
        );
        break;
      case "partners":
        setPartners(partners.filter((p) => !selectedRows.includes(p.id)));
        setEditedPartners(
          editedPartners.filter((p) => !selectedRows.includes(p.id))
        );
        break;
      case "finance":
        setExpenses(expenses.filter((e) => !selectedExpenses.includes(e.id)));
        setEditedExpenses(
          editedExpenses.filter((e) => !selectedExpenses.includes(e.id))
        );
        setSelectedExpenses([]);

        setRevenues(revenues.filter((r) => !selectedRevenues.includes(r.id)));
        setEditedRevenues(
          editedRevenues.filter((r) => !selectedRevenues.includes(r.id))
        );
        setSelectedRevenues([]);
        break;
    }
    setSelectedRows([]);
  };

  const handleAdd = (type?: "expense" | "revenue") => {
    switch (activeTable) {
      case "workers": {
        const newWorker = createNewWorker();
        setEditedWorkers([...editedWorkers, newWorker]);
        break;
      }
      case "partners": {
        const newPartner = createNewPartner();
        setEditedPartners([...editedPartners, newPartner]);
        break;
      }
      case "finance": {
        const newEntry = createNewFinanceEntry();
        if (type === "expense") {
          setEditedExpenses([...editedExpenses, newEntry]);
        } else if (type === "revenue") {
          setEditedRevenues([...editedRevenues, newEntry]);
        }
        break;
      }
      case "attendance":
        // create new blank column in draft state and add blank entries into editedRecords:
        setEditedColumns((prev) => [...prev, { date: "", isDateValid: true }]);
        setEditedRecords((prev) =>
          prev.map((r) => ({
            ...r,
            dates: {
              ...r.dates,
              "": r.dates[""] ?? { present: false, comment: "" },
            },
          }))
        );
        setIsEditing(true);
        break;
    }
  };

  const handleGroupWorkers = () => {
    if (activeTable === "workers") {
      setShowGroups((prev) => !prev);
    }
  };

  const handleAddToGroup = (groupName: string, workerIds: number[]) => {
    setGroups((prev) => {
      const existing = prev.find((g) => g.name === groupName);
      if (existing) {
        return prev.map((g) =>
          g.name === groupName
            ? {
                ...g,
                workerIds: Array.from(new Set([...g.workerIds, ...workerIds])),
              }
            : g
        );
      } else {
        return [...prev, { name: groupName, workerIds }];
      }
    });
  };

  const handleSelectGroup = (groupName: string) => {
    const group = groups.find((g) => g.name === groupName);
    if (!group) return;
    // Only select workers that still exist
    const validIds = group.workerIds.filter((id: number) =>
      workers.some((w) => w.id === id)
    );
    setSelectedRows(validIds);
    setShowGroups(false);
  };

  // === Render correct table depending on activeTable ===
  const renderTable = () => {
    switch (activeTable) {
      case "workers":
        return (
          <WorkersTable
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            isEditing={isEditing}
            editedData={editedWorkers}
            setEditedData={setEditedWorkers}
            data={workers}
            handleAddEntry={handleAdd}
          />
        );
      case "attendance":
        return (
          <AttendanceTable
            workers={workers}
            columns={columns}
            setColumns={setColumns}
            records={records}
            setRecords={setRecords}
            editedColumns={editedColumns}
            setEditedColumns={setEditedColumns}
            editedRecords={editedRecords}
            setEditedRecords={setEditedRecords}
            isEditing={isEditing}
          />
        );
      case "finance":
        return (
          <div className="finance-tables">
            <FinanceTable
              title="Expenses"
              type="expense"
              workers={workers}
              data={expenses}
              editedData={editedExpenses}
              setEditedData={setEditedExpenses}
              selectedRows={selectedExpenses}
              setSelectedRows={setSelectedExpenses}
              isEditing={isEditing}
              onAdd={() => handleAdd("expense")}
            />

            <div className="divider" />

            <FinanceTable
              title="Revenues"
              type="revenue"
              workers={workers}
              data={revenues}
              editedData={editedRevenues}
              setEditedData={setEditedRevenues}
              selectedRows={selectedRevenues}
              setSelectedRows={setSelectedRevenues}
              isEditing={isEditing}
              onAdd={() => handleAdd("revenue")}
            />
          </div>
        );
      case "partners":
        return (
          <PartnersTable
            workers={workers}
            data={partners}
            editedData={editedPartners}
            setEditedData={setEditedPartners}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            isEditing={isEditing}
            handleAddEntry={handleAdd}
          />
        );
      default:
        return <div>Select a table</div>;
    }
  };

  return (
    <div className="flex-container">
      <Toolbar
        activeTable={activeTable}
        onChange={(t: TableType) => {
          setActiveTable(t);
          setSelectedRows([]);
        }}
        groups={groups}
        onOpenCertificates={() => setShowCertificates(true)} // ✅
      />
      <div className="main">{renderTable()}</div>
      <ButtonHolder
        activeTable={activeTable}
        hasSelection={hasSelection}
        isEditing={isEditing}
        onEdit={handleEdit}
        onApply={handleApply}
        onCancel={handleCancel}
        onDelete={handleDelete}
        onGroup={handleGroupWorkers}
      />
      {showGroups && (
        <GroupsModal
          workers={workers}
          groups={groups}
          selectedWorkerIds={selectedRows}
          onClose={() => setShowGroups(false)}
          onAddToGroup={handleAddToGroup}
          onSelectGroup={handleSelectGroup}
        />
      )}

      {/* ✅ Certificates modal rendered in same layer */}
      {showCertificates && (
        <CertificatesModal
          groups={groups}
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
          handleCreateCertificate={handleCreateCertificate}
          onClose={() => setShowCertificates(false)}
        />
      )}

      <footer>
        <div>
          Made with <span aria-label="love">❤️</span> by Solvro © 2025
        </div>
        <a href="mailto:kn.solvro@pwr.edu.pl">kn.solvro@pwr.edu.pl</a>
      </footer>
    </div>
  );
}
