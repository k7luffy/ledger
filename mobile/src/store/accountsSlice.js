import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
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

const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {
    addAccount: {
      prepare(account) {
        if ((account.type = "child")) {
          const newItems = account.items.map((item) => ({
            id: nanoid(),
            ...item,
          }));
          return { payload: { key: account.key, items: newItems } };
        }
      },
      reducer(state, actions) {
        const target = state.list.find((ap) => ap.key === actions.payload.key);
        if (target) {
          target.items.push(...actions.payload.items);
        }
      },
    },
    resetAccounts: () => initialState,
  },
});

export const { addAccount, resetAccounts } = accountsSlice.actions;
export default accountsSlice.reducer;

// Selectors
export const selectAllAccounts = (state) => state.accounts.list;
export const selectAccountById = (state, id) => {
  const allItems = state.accounts.list.flatMap((group) => group.items);
  return allItems.find((item) => item.id === id);
};
