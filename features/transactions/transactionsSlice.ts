import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Transaction {
  id: string; // 客户端生成的 UUID
  userId: string;

  // --- 财务核心 ---
  amount: number; // 金额（单位：分）
  type: "EXPENSE" | "INCOME" | "TRANSFER";
  currency: string; // 货币代码：如 "CNY", "USD"

  // --- 分类与账户 ---
  categoryId: string;
  rootCategoryId: string;
  accountId: string;
  toAccountId?: string; // 转账目标账户

  // --- 逻辑标记 ---
  isExcludeFromStats: boolean; // 不计入收支统计
  isExcludeFromBudget: boolean; // 不计入预算 (如报销、人情往来)
  status: "COMPLETED" | "PENDING"; // 状态：已完成、待确认 (如预授权)

  // --- 退款处理 ---
  // 如果这笔账单是退款，则记录原账单 ID；如果是原账单被退款，可记录已退金额
  refundStatus?: "NONE" | "PARTIAL" | "FULL";
  relatedTransactionId?: string; // 关联的原账单 ID 或退款单 ID

  // --- 时间 ---
  date: number; // 交易发生时间戳
  createdAt: number; // 记录创建时间
  updatedAt: number; // 记录修改时间

  // --- 附加信息 ---
  note: string; // 备注
  tags: string[]; // 标签数组，支持多维度检索 (如 ["出差", "报销"])
  images: string[]; // 图片附件路径 (iOS 本地沙盒路径或远程 URL)
}

export interface TransactionsState {
  items: Transaction[];
}

const toTimestamp = (date: string, time: string) =>
  new Date(`${date}T${time}:00`).getTime();

const initialState: TransactionsState = {
  items: [
    {
      id: "tx_1",
      userId: "demo-user",
      amount: 663400,
      type: "EXPENSE",
      currency: "CNY",
      categoryId: "cat_food",
      rootCategoryId: "cat_food",
      accountId: "acc_default_cny",
      isExcludeFromStats: false,
      isExcludeFromBudget: false,
      status: "COMPLETED",
      refundStatus: "NONE",
      date: toTimestamp("2026-02-26", "13:50"),
      createdAt: toTimestamp("2026-02-26", "13:50"),
      updatedAt: toTimestamp("2026-02-26", "13:50"),
      note: "",
      tags: [],
      images: [],
    },
    {
      id: "tx_2",
      userId: "demo-user",
      amount: 64700,
      type: "EXPENSE",
      currency: "CNY",
      categoryId: "cat_food",
      rootCategoryId: "cat_food",
      accountId: "acc_default_cny",
      isExcludeFromStats: false,
      isExcludeFromBudget: false,
      status: "COMPLETED",
      refundStatus: "NONE",
      date: toTimestamp("2026-02-26", "13:50"),
      createdAt: toTimestamp("2026-02-26", "13:50"),
      updatedAt: toTimestamp("2026-02-26", "13:50"),
      note: "",
      tags: [],
      images: [],
    },
    {
      id: "tx_3",
      userId: "demo-user",
      amount: 8500,
      type: "EXPENSE",
      currency: "CNY",
      categoryId: "cat_food",
      rootCategoryId: "cat_food",
      accountId: "acc_default_cny",
      isExcludeFromStats: false,
      isExcludeFromBudget: false,
      status: "COMPLETED",
      refundStatus: "NONE",
      date: toTimestamp("2026-02-26", "13:50"),
      createdAt: toTimestamp("2026-02-26", "13:50"),
      updatedAt: toTimestamp("2026-02-26", "13:50"),
      note: "",
      tags: [],
      images: [],
    },
    {
      id: "tx_4",
      userId: "demo-user",
      amount: 300,
      type: "EXPENSE",
      currency: "CNY",
      categoryId: "cat_food",
      rootCategoryId: "cat_food",
      accountId: "acc_default_cny",
      isExcludeFromStats: false,
      isExcludeFromBudget: false,
      status: "COMPLETED",
      refundStatus: "NONE",
      date: toTimestamp("2026-02-26", "13:50"),
      createdAt: toTimestamp("2026-02-26", "13:50"),
      updatedAt: toTimestamp("2026-02-26", "13:50"),
      note: "",
      tags: [],
      images: [],
    },
    {
      id: "tx_5",
      userId: "demo-user",
      amount: 500,
      type: "EXPENSE",
      currency: "CNY",
      categoryId: "cat_food",
      rootCategoryId: "cat_food",
      accountId: "acc_default_cny",
      isExcludeFromStats: false,
      isExcludeFromBudget: false,
      status: "COMPLETED",
      refundStatus: "NONE",
      date: toTimestamp("2026-02-26", "21:15"),
      createdAt: toTimestamp("2026-02-26", "21:15"),
      updatedAt: toTimestamp("2026-02-26", "21:15"),
      note: "",
      tags: [],
      images: [],
    },
    {
      id: "tx_6",
      userId: "demo-user",
      amount: 500,
      type: "EXPENSE",
      currency: "CNY",
      categoryId: "cat_food",
      rootCategoryId: "cat_food",
      accountId: "acc_default_cny",
      isExcludeFromStats: false,
      isExcludeFromBudget: false,
      status: "COMPLETED",
      refundStatus: "NONE",
      date: toTimestamp("2026-02-27", "10:37"),
      createdAt: toTimestamp("2026-02-27", "10:37"),
      updatedAt: toTimestamp("2026-02-27", "10:37"),
      note: "",
      tags: [],
      images: [],
    },
    {
      id: "tx_7",
      userId: "demo-user",
      amount: 5800,
      type: "EXPENSE",
      currency: "CNY",
      categoryId: "cat_food",
      rootCategoryId: "cat_food",
      accountId: "acc_default_cny",
      isExcludeFromStats: false,
      isExcludeFromBudget: false,
      status: "COMPLETED",
      refundStatus: "NONE",
      date: toTimestamp("2026-02-26", "13:50"),
      createdAt: toTimestamp("2026-02-26", "13:50"),
      updatedAt: toTimestamp("2026-02-26", "13:50"),
      note: "",
      tags: [],
      images: [],
    },
  ],
};

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setTransactions(state, action: PayloadAction<Transaction[]>) {
      state.items = action.payload;
    },
    addTransaction(state, action: PayloadAction<Transaction>) {
      state.items.push(action.payload);
    },
    addTransactions(state, action: PayloadAction<Transaction[]>) {
      state.items.push(...action.payload);
    },
    upsertTransaction(state, action: PayloadAction<Transaction>) {
      const next = action.payload;
      const index = state.items.findIndex((item) => item.id === next.id);

      if (index === -1) {
        state.items.push(next);
        return;
      }

      state.items[index] = next;
    },
    updateTransaction(
      state,
      action: PayloadAction<{ id: string; changes: Partial<Transaction> }>,
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
    removeTransaction(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearTransactions: () => initialState,
  },
});

export const {
  setTransactions,
  addTransaction,
  addTransactions,
  upsertTransaction,
  updateTransaction,
  removeTransaction,
  clearTransactions,
} = transactionsSlice.actions;

export const selectTransactions = (state: {
  transactions: TransactionsState;
}) => state.transactions.items;

export const selectTransactionById =
  (id: string) => (state: { transactions: TransactionsState }) =>
    state.transactions.items.find((item) => item.id === id);

export default transactionsSlice.reducer;
