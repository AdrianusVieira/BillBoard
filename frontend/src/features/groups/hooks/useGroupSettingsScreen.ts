import { useState } from "react";
import { useGroupsQuery } from "./useGroupsQuery";
import IGroup from "@/shared/interfaces/IGroup";

const useGroupSettingsScreen = () => {
  const { query, create, update, remove } = useGroupsQuery();

  const [description, setDescription] = useState("");
  const [editing, setEditing] = useState<IGroup | null>(null);
  const [name, setName] = useState("");

  const handleCancel = () => {
    setEditing(null);
    setName("");
    setDescription("");
  };

  const handleChangeDescription = (value: string) => {
    setDescription(value);
  };
  const handleChangeName = (value: string) => {
    setName(value);
  };

  const handleEdit = (group: IGroup) => {
    setEditing(group);
    setName(group.name);
    setDescription(group.description ?? "");
  };

  const handleRemove = async (id: number) => {
    await remove.mutateAsync(id);
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;

    if (editing) {
      await update.mutateAsync({
        id: editing.id,
        payload: { name, description },
      });
      setEditing(null);
    } else {
      await create.mutateAsync({ name, description });
    }

    setName("");
    setDescription("");
  };

  return {
    description,
    editing,
    error: query.error,
    groups: query.data ?? [],
    loading: query.isLoading,
    name,
    handleCancel,
    handleChangeDescription,
    handleChangeName,
    handleEdit,
    handleRemove,
    handleSubmit,
  };
};

export default useGroupSettingsScreen;
