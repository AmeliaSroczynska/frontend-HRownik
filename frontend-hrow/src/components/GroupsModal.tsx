import { useState } from "react";
import type { Worker } from "../tables/Workers";

export interface Group {
  name: string;
  workerIds: number[];
}

interface GroupsModalProps {
  workers: Worker[];
  groups: Group[];
  selectedWorkerIds: number[];
  onClose: () => void;
  onAddToGroup: (groupName: string, workerIds: number[]) => void;
  onSelectGroup: (groupName: string) => void;
}

export default function GroupsModal({
  groups,
  selectedWorkerIds,
  onClose,
  onAddToGroup,
  onSelectGroup,
}: GroupsModalProps) {
  const [newGroupName, setNewGroupName] = useState("");

  const handleAdd = () => {
    const trimmed = newGroupName.trim();
    if (!trimmed) return alert("Please enter a group name.");
    if (selectedWorkerIds.length === 0)
      return alert("Select at least one worker before creating a group.");

    onAddToGroup(trimmed, selectedWorkerIds);
    setNewGroupName("");
  };

  return (
    <div className="groups-overlay">
      <div className="groups-modal">
        <h2>Groups</h2>

        <ul className="groups-list">
          {groups.length === 0 ? (
            <li className="empty">No groups yet</li>
          ) : (
            groups.map((g) => (
              <li key={g.name} onClick={() => onSelectGroup(g.name)}>
                {g.name}
              </li>
            ))
          )}
        </ul>

        <div className="group-input">
          <input
            type="text"
            placeholder="Group name..."
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
          <button onClick={handleAdd}>Create</button>
        </div>
        <div className="modal-actions">
          <button onClick={onClose} className="btn btn-close">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
