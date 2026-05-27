import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBills,
  createBill,
  updateBill,
  deleteBill,
} from "@/services/bills.service";
import IBillPayload from "@/shared/interfaces/IBillPayload";

export const useBillsQuery = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["bills"],
    queryFn: getBills,
  });

  const create = useMutation({
    mutationFn: (payload: IBillPayload) => createBill(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bills"] }),
  });

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: IBillPayload }) =>
      updateBill(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bills"] }),
  });

  const remove = useMutation({
    mutationFn: (id: number) => deleteBill(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bills"] }),
  });

  return { query, create, update, remove };
};
