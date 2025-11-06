import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  list: [
    {
      id: 1,
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

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    addTransaction: {
      prepare(transaction) {
        return { payload: { id: nanoid(), ...transaction } };
      },
      reducer(state, action) {
        state.list.unshift(action.payload);
      },
    },
    updateTransaction: {
      reducer(state, action) {
        const idx = state.list.findIndex((t) => t.id === action.payload.id);
        if (idx !== -1)
          state.list[idx] = { ...state.list[idx], ...action.payload };
      },
    },
    removeTransaction: {
      reducer(state, action) {
        state.list = state.list.filter((t) => t.id !== action.payload);
      },
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
export const selectAllRecords = (state) => state.transactions.list;
export const selectRecordsByDate = (state, yyyyMmDd) =>
  state.transactions.list.filter((r) => (r.dateISO ?? "").startsWith(yyyyMmDd));
