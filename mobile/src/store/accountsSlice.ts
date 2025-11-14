import { PayloadAction, createSlice, nanoid } from "@reduxjs/toolkit";

export interface AccountItem {
  id: string;
  label: string;
  amount: number;
  icon: string;
}

export interface AccountGroup {
  id: string;
  title: string;
  items: AccountItem[];
}

export interface AccountsState {
  list: AccountGroup[];
}

const initialState: AccountsState = {
  list: [
    {
      id: "cash",
      title: "现金账户",
      items: [{ id: "cash", label: "现金", amount: 43.74, icon: "cash" }],
    },
    {
      id: "savings",
      title: "储蓄账户",
      items: [{ id: "bank", label: "银行卡", amount: 0, icon: "credit-card" }],
    },
    {
      id: "virtual",
      title: "虚拟账户",
      items: [
        { id: "wechat", label: "微信零钱", amount: 0, icon: "wechat" },
        { id: "alipay", label: "支付宝余额", amount: 0, icon: "qrcode-scan" },
      ],
    },
  ],
};

type AddAccountPayload = {
  type: "child";
  groupId: AccountGroup["id"];
  items: Array<Omit<AccountItem, "id">>;
};

type AddAccountPreparedPayload = {
  groupId: AccountGroup["id"];
  items: AccountItem[];
};

const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {
    addAccount: {
      prepare(account: AddAccountPayload) {
        const newItems = account.items.map((item) => ({
          id: nanoid(),
          ...item,
        }));
        return { payload: { groupId: account.groupId, items: newItems } };
      },
      reducer(state, action: PayloadAction<AddAccountPreparedPayload>) {
        const target = state.list.find((ap) => ap.id === action.payload.groupId);
        if (target) {
          target.items.push(...action.payload.items);
        }
      },
    },
    resetAccounts: () => initialState,
  },
});

export const { addAccount, resetAccounts } = accountsSlice.actions;
export default accountsSlice.reducer;

// Selectors
export const selectAllAccounts = (state: { accounts: AccountsState }) =>
  state.accounts.list;

export const selectAccountById = (
  state: { accounts: AccountsState },
  id: string
) => {
  const allItems = state.accounts.list.flatMap((group) => group.items);
  return allItems.find((item) => item.id === id);
};
