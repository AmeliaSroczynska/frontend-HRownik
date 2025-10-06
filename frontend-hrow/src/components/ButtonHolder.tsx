export interface ButtonHolderProps {
  activeTable: string;
  hasSelection: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onApply: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onGroup: () => void; // simplified, no args needed
}

export default function ButtonHolder({
  activeTable,
  hasSelection,
  isEditing,
  onEdit,
  onApply,
  onCancel,
  onDelete,
  onGroup,
}: ButtonHolderProps) {
  return (
    <div className="button-holder">
      {/* Edit / Apply */}
      {!isEditing ? (
        <button onClick={onEdit} className="edit">
          Edit
        </button>
      ) : (
        <button onClick={onApply} className="apply">
          Apply
        </button>
      )}

      {/* Groups — only when Workers table is active */}
      {activeTable === "workers" && !isEditing && (
        <button className="group" onClick={onGroup}>
          Groups
        </button>
      )}

      {/* Delete / Cancel */}
      {!isEditing ? (
        <button onClick={onDelete} className="delete" disabled={!hasSelection}>
          Delete
        </button>
      ) : (
        <button onClick={onCancel} className="cancel">
          Cancel
        </button>
      )}
    </div>
  );
}
