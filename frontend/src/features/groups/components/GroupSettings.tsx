import { Pencil, Trash2 } from "lucide-react";
import useGroupSettingsScreen from "@/features/groups/hooks/useGroupSettingsScreen";
import IGroup from "@/shared/interfaces/IGroup";

const TEXTS = {
  buttons: {
    cancel: "Cancel",
    newGroup: "Add Group",
    updateGroup: "Update Group",
  },
  editTitle: "Edit Group",
  loadError: "Failed to load groups.",
  loading: "Loading groups...",
  placeholders: {
    description: "Description (optional)",
    name: "Group name",
  },
  newTitle: "New Group",
};

const GroupSettings = () => {
  const {
    description,
    editing,
    error,
    groups,
    loading,
    name,
    handleCancel,
    handleChangeDescription,
    handleChangeName,
    handleEdit,
    handleRemove,
    handleSubmit,
  } = useGroupSettingsScreen();

  const shouldRenderContent = !loading && !error;

  const showLoading = () => (
    <p className="text-sm text-muted-foreground">{TEXTS.loading}</p>
  );
  const showError = () => (
    <p className="text-sm text-destructive">{TEXTS.loadError}</p>
  );

  const showGroups = () => {
    return (
      <div className="flex flex-col gap-2">
        {groups.map((group: IGroup) => (
          <div
            key={group.id}
            className="flex items-start justify-between p-3 border rounded-lg"
          >
            <div>
              <p className="text-sm font-medium">{group.name}</p>
              {group.description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {group.description}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(group)}
                className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/50 active:scale-95"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleRemove(group.id)}
                className="text-muted-foreground hover:text-destructive cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/50 active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };
  const showForms = () => {
    return (
      <div className="flex flex-col gap-3 border-t pt-4">
        <p className="text-sm font-medium">
          {editing ? TEXTS.editTitle : TEXTS.newTitle}
        </p>
        <input
          type="text"
          placeholder={TEXTS.placeholders.name}
          value={name}
          onChange={(e) => handleChangeName(e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-sm"
        />
        <textarea
          placeholder={TEXTS.placeholders.description}
          value={description}
          onChange={(e) => handleChangeDescription(e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-sm resize-none h-20"
        />
        <div className="flex gap-2 justify-end">
          {editing && (
            <button
              onClick={handleCancel}
              className="text-sm px-4 py-2 border rounded-md cursor-pointer transition-colors hover:bg-muted/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/50 active:scale-95"
            >
              {TEXTS.buttons.cancel}
            </button>
          )}
          <button
            onClick={handleSubmit}
            className="text-sm px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer transition-transform hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/50 active:scale-95"
          >
            {editing ? TEXTS.buttons.updateGroup : TEXTS.buttons.newGroup}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {loading && showLoading()}
      {error && showError()}
      {shouldRenderContent && (
        <>
          {showGroups()}
          {showForms()}
        </>
      )}
    </div>
  );
};

export default GroupSettings;
