import { useState } from "react";
import { useBillsQuery } from "./useBillsQuery";
import { useGroupsQuery } from "@/features/groups/hooks/useGroupsQuery";
import IBill from "@/shared/types/IBill";
import IBillPayload from "@/shared/types/IBillPayload";
import { EStatusFilter, TStatusFilter} from "@/features/bills/types/TStatusFilter";

const useBillsScreen = () => {
  const { query, create, update, remove } = useBillsQuery();
  const { query: groupsQuery } = useGroupsQuery();

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [editing, setEditing] = useState<IBill | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TStatusFilter>(
    EStatusFilter.All
  );

  const handleClearDates = () => {
    setDateFrom("");
    setDateTo("");
  };

  const handleChangeDateFrom = (value: string) => {
    setDateFrom(value);
  };

  const handleChangeDateTo = (value: string) => {
    setDateTo(value);
  };

  const handleChangeSearch = (value: string) => {
    setSearch(value);
  };

  const handleChangeStatusFilter = (value: TStatusFilter) => {
    setStatusFilter(value);
  };

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

  const handleSubmit = async (payload: IBillPayload) => {
    if (editing) {
      await update.mutateAsync({ id: editing.id, payload });
    } else {
      await create.mutateAsync(payload);
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

  const totalValue = filteredBills.reduce(
    (sum: number, bill: IBill) => sum + bill.value,
    0,
  );

  return {
    dateFrom,
    dateTo,
    editing,
    error: query.error,
    filteredBills,
    groups: groupsQuery.data ?? [],
    isFormOpen,
    loading: query.isLoading,
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
  };
};

export default useBillsScreen;
