import { useState } from "react";
import { useBillsQuery } from "./useBillsQuery";
import { useGroupsQuery } from "@/features/groups/hooks/useGroupsQuery";
import { useRecurrentsQuery } from "@/features/recurrent/hooks/useRecurrentsQuery";
import {
  EStatusFilter,
  TStatusFilter,
} from "@/features/bills/types/TStatusFilter";
import IBill from "@/shared/interfaces/IBill";
import IBillPayload from "@/shared/interfaces/IBillPayload";
import IRecurrentPayload from "@/shared/interfaces/IRecurrentPayload";

const useBillsScreen = () => {
  const { query, create, update, remove } = useBillsQuery();
  const { query: groupsQuery } = useGroupsQuery();
  const { query: recurrentsQuery, create: createRecurrent } =
    useRecurrentsQuery();

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [editing, setEditing] = useState<IBill | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TStatusFilter>(
    EStatusFilter.All,
  );

  const handleClearDates = () => {
    setDateFrom("");
    setDateTo("");
  };

  const handleChangeDateFrom = (value: string) => setDateFrom(value);
  const handleChangeDateTo = (value: string) => setDateTo(value);
  const handleChangeSearch = (value: string) => setSearch(value);
  const handleChangeStatusFilter = (value: TStatusFilter) =>
    setStatusFilter(value);

  const handleOpenAdd = () => {
    setEditing(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (bill: IBill) => {
    setEditing(bill);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setEditing(null);
    setIsFormOpen(false);
  };

  const handleRemove = async (id: number) => {
    await remove.mutateAsync(id);
  };

  const handleSubmit = async (
    payload: IBillPayload,
    recurrentPayload?: IRecurrentPayload,
  ) => {
    if (editing) {
      await update.mutateAsync({ id: editing.id, payload });
    } else {
      // If recurrent, create the recurrent first, then link the bill
      if (recurrentPayload) {
        const recurrent = await createRecurrent.mutateAsync(recurrentPayload);
        await create.mutateAsync({ ...payload, recurrent_id: recurrent.id });
      } else {
        await create.mutateAsync(payload);
      }
    }

    setEditing(null);
    setIsFormOpen(false);
  };

  const handleTogglePaid = async (bill: IBill) => {
    await update.mutateAsync({
      id: bill.id,
      payload: { ...bill, paid: !bill.paid },
    });
  };

  const handleDuplicate = async (bill: IBill) => {
    const payload: IBillPayload = {
      name: bill.name,
      value: bill.value,
      group_id: bill.group_id,
      term: bill.term,
      ref: bill.ref,
      paid: bill.paid,
      recurrent_id: null,
    };
    await create.mutateAsync(payload);
  };

  const filteredBills = (query.data ?? []).filter((bill: IBill) => {
    const matchesSearch = bill.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === EStatusFilter.All ||
      (statusFilter === EStatusFilter.Paid ? bill.paid : !bill.paid);
    const matchesDateFrom =
      dateFrom && bill.term ? bill.term >= dateFrom : true;
    const matchesDateTo = dateTo && bill.term ? bill.term <= dateTo : true;
    return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
  });

  const sortedBills = [...filteredBills].sort((a: IBill, b: IBill) => {
    if (!a.term && !b.term) return 0;
    if (!a.term) return 1;
    if (!b.term) return -1;
    return a.term.localeCompare(b.term);
  });

  const totalValue = sortedBills.reduce(
    (sum: number, bill: IBill) => sum + bill.value,
    0,
  );

  return {
    dateFrom,
    dateTo,
    editing,
    error: query.error,
    filteredBills: sortedBills,
    groups: groupsQuery.data ?? [],
    isFormOpen,
    loading: query.isLoading,
    recurrents: recurrentsQuery.data ?? [],
    search,
    statusFilter,
    totalValue,
    handleClearDates,
    handleChangeDateFrom,
    handleChangeDateTo,
    handleChangeSearch,
    handleChangeStatusFilter,
    handleCloseForm,
    handleOpenAdd,
    handleOpenEdit,
    handleRemove,
    handleSubmit,
    handleTogglePaid,
    handleDuplicate,
  };
};

export default useBillsScreen;
