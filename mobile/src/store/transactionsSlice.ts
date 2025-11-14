import {
  PayloadAction,
  createSelector,
  createSlice,
  nanoid,
} from "@reduxjs/toolkit";

export type TransactionType = "income" | "expense";

export interface TransactionRecord {
  id: string;
  type: TransactionType;
  amount: number;
  categoryParent: string;
  categoryChildId: number;
  account: string;
  note?: string;
  dateISO?: string;
}

export interface TransactionsState {
  list: TransactionRecord[];
}

const initialState: TransactionsState = {
  list: [
    {
      id: "1",
      type: "expense",
      amount: 28.5,
      categoryParent: "食品酒水",
      categoryChildId: 1,
      account: "现金 (CNY)",
      note: "咖喱饭",
      dateISO: "2025-11-04T08:30:00.000Z",
    },
  ],
};

type NewTransactionPayload = Omit<TransactionRecord, "id">;
type UpdateTransactionPayload = Partial<NewTransactionPayload> &
  Pick<TransactionRecord, "id">;

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    addTransaction: {
      prepare(transaction: NewTransactionPayload) {
        return { payload: { id: nanoid(), ...transaction } };
      },
      reducer(state, action: PayloadAction<TransactionRecord>) {
        state.list.unshift(action.payload);
      },
    },
    updateTransaction(
      state,
      action: PayloadAction<UpdateTransactionPayload>
    ) {
      const idx = state.list.findIndex((t) => t.id === action.payload.id);
      if (idx !== -1)
        state.list[idx] = { ...state.list[idx], ...action.payload };
    },
    removeTransaction(state, action: PayloadAction<TransactionRecord["id"]>) {
      state.list = state.list.filter((t) => t.id !== action.payload);
    },
    resetTransactions: () => initialState,
  },
});

export const {
  addTransaction,
  updateTransaction,
  removeTransaction,
  resetTransactions,
} = transactionsSlice.actions;
export default transactionsSlice.reducer;

// Selectors
export const selectAllRecords = (state: { transactions: TransactionsState }) =>
  state.transactions.list;

export const makeSelectRecordsByMonth = () =>
  createSelector(
    [
      (state: { transactions: TransactionsState }) =>
        state.transactions.list,
      (_: unknown, yyyyMm: string) => yyyyMm,
    ],
    (list, yyyyMm) =>
      list.filter((record) => (record.dateISO ?? "").startsWith(yyyyMm))
  );

export const selectRecordsByDate = (
  state: { transactions: TransactionsState },
  yyyyMmDd: string
) =>
  state.transactions.list.filter((r) =>
    (r.dateISO ?? "").startsWith(yyyyMmDd)
  );
