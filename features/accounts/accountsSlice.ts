import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Account {
  id: string;
  userId: string;

  name: string; // 如“美金储蓄卡”、“我的钱包”
  icon: string;
  color: string;

  // --- 货币与金额 [新] ---
  currency: string; // 货币类型，例如 "USD", "CNY", "JPY"
  balance: number; // 该账户货币下的余额（单位：分）
  initialBalance: number; // 开户初始金额

  accountType: "CASH" | "DEBIT" | "CREDIT" | "INVESTMENT";
  excludeFromTotal: boolean; // 是否不计入总资产

  isActive: boolean; // 账户是否隐藏/停用
}

export interface AccountsState {
  items: Account[];
}

const initialState: AccountsState = {
  items: [
    {
      id: "acc_default_cny",
      userId: "demo-user",
      name: "默认账本",
      icon: "wallet-outline",
      color: "#3E94FD",
      currency: "CNY",
      balance: 0,
      initialBalance: 0,
      accountType: "DEBIT",
      excludeFromTotal: false,
      isActive: true,
    },
  ],
};

const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {
    setAccounts(state, action: PayloadAction<Account[]>) {
      state.items = action.payload;
    },
    addAccount(state, action: PayloadAction<Account>) {
      state.items.push(action.payload);
    },
    upsertAccount(state, action: PayloadAction<Account>) {
      const next = action.payload;
      const index = state.items.findIndex((item) => item.id === next.id);

      if (index === -1) {
        state.items.push(next);
        return;
      }

      state.items[index] = next;
    },
    updateAccount(
      state,
      action: PayloadAction<{ id: string; changes: Partial<Account> }>,
    ) {
      const { id, changes } = action.payload;
      const index = state.items.findIndex((item) => item.id === id);

      if (index === -1) {
        return;
      }

      state.items[index] = {
        ...state.items[index],
        ...changes,
        id: state.items[index].id,
      };
    },
    removeAccount(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearAccounts(state) {
      state.items = [];
    },
  },
});

export const {
  setAccounts,
  addAccount,
  upsertAccount,
  updateAccount,
  removeAccount,
  clearAccounts,
} = accountsSlice.actions;

export const selectAccounts = (state: { accounts: AccountsState }) =>
  state.accounts.items;

export const selectAccountById =
  (id: string) => (state: { accounts: AccountsState }) =>
    state.accounts.items.find((item) => item.id === id);

export default accountsSlice.reducer;
