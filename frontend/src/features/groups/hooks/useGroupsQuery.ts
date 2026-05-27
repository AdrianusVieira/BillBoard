import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getGroups,
  createGroup,
  updateGroup,
  deleteGroup,
} from "@/services/groups.service";
import IGroupPayload from "@/shared/interfaces/IGroupPayload";

export const useGroupsQuery = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["groups"],
    queryFn: getGroups,
  });

  const create = useMutation({
    mutationFn: (payload: IGroupPayload) => createGroup(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["groups"] }),
  });

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: IGroupPayload }) =>
      updateGroup(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["groups"] }),
  });

  const remove = useMutation({
    mutationFn: (id: number) => deleteGroup(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["groups"] }),
  });

  return { query, create, update, remove };
};
