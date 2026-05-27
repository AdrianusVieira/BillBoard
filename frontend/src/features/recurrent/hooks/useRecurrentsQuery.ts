import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRecurrents,
  createRecurrent,
  updateRecurrent,
  deleteRecurrent,
} from "@/services/recurrent.service";
import IRecurrentPayload from "@/shared/interfaces/IRecurrentPayload";

export const useRecurrentsQuery = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["recurrents"],
    queryFn: getRecurrents,
    // Avoid aggressive retries/refetches in development or when the backend is unavailable
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const create = useMutation({
    mutationFn: (payload: IRecurrentPayload) => createRecurrent(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["recurrents"] }),
  });

  const update = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<IRecurrentPayload>;
    }) => updateRecurrent(id, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["recurrents"] }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteRecurrent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurrents"] });
      queryClient.invalidateQueries({ queryKey: ["bills"] });
    },
  });

  return { query, create, update, remove };
};
