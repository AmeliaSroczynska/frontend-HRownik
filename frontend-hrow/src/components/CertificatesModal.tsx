import { createPortal } from "react-dom";

interface Group {
  name: string;
  workerIds: number[];
}

interface CertificatesModalProps {
  groups: Group[];
  selectedGroup: string;
  setSelectedGroup: (value: string) => void;
  handleCreateCertificate: () => void;
  onClose: () => void;
}

export default function CertificatesModal({
  groups,
  selectedGroup,
  setSelectedGroup,
  handleCreateCertificate,
  onClose,
}: CertificatesModalProps) {
  return createPortal(
    <div className="certificates-overlay">
      <div className="certificates-modal">
        <h2>Certificates</h2>

        <select
          name="select"
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="certificates-select"
        >
          <option value="">Select a group...</option>
          {groups.map((g) => (
            <option key={g.name} value={g.name}>
              {g.name}
            </option>
          ))}
        </select>

        <div className="certificates-actions">
          <button
            onClick={handleCreateCertificate}
            disabled={!selectedGroup}
            className="btn-create"
          >
            Create
          </button>
          <button onClick={onClose} className="btn-close">
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
