import { create } from "zustand";
import IGroup from "@/shared/types/IGroup";

interface GroupStore {
  groups: IGroup[];
  setGroups: (groups: IGroup[]) => void;
  addGroup: (group: IGroup) => void;
  updateGroup: (updated: IGroup) => void;
  removeGroup: (id: number) => void;
}

export const useGroupStore = create<GroupStore>((set) => ({
  groups: [],
  setGroups: (groups) => set({ groups }),
  addGroup: (group) => set((state) => ({ groups: [...state.groups, group] })),
  updateGroup: (updated) =>
    set((state) => ({
      groups: state.groups.map((g) => (g.id === updated.id ? updated : g)),
    })),
  removeGroup: (id) =>
    set((state) => ({
      groups: state.groups.filter((g) => g.id !== id),
    })),
}));
