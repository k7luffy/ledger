import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Category {
  id: string;
  userId: string; // 属于谁的自定义分类 (如果是系统预设则为 'SYSTEM')
  parentId: string | null; // 父类 ID，大类为 null

  name: string; // 分类名称
  icon: string; // 图标名称 (对应 SFSymbols 或 FontAwesome)
  color: string; // UI 显示颜色 (Hex: "#E36F58")

  type: "EXPENSE" | "INCOME"; // 分类所属的账目类型
  sortOrder: number; // 用于排序，数字越小越靠前
  isActive: boolean; // 是否启用 (用户删除分类时建议置为 false，而非物理删除)
}

export interface CategoriesState {
  items: Category[];
}

const initialState: CategoriesState = {
  items: [
    {
      id: "cat_food",
      userId: "SYSTEM",
      parentId: null,
      name: "餐饮",
      icon: "food-drumstick-outline",
      color: "#E36F58", // 橙色：食欲
      type: "EXPENSE",
      sortOrder: 1,
      isActive: true,
    },

    // --- 购物消费 ---
    {
      id: "cat_shopping",
      userId: "SYSTEM",
      parentId: null,
      name: "购物",
      icon: "cart-outline",
      color: "#E36F58", // 红色：购物冲动
      type: "EXPENSE",
      sortOrder: 2,
      isActive: true,
    },
    {
      id: "cat_cloth",
      userId: "SYSTEM",
      parentId: "cat_shopping",
      name: "服饰",
      icon: "tshirt-crew-outline",
      color: "#E36F58",
      type: "EXPENSE",
      sortOrder: 3,
      isActive: true,
    },
    {
      id: "cat_daily",
      userId: "SYSTEM",
      parentId: "cat_shopping",
      name: "日用",
      icon: "bottle-tonic-outline",
      color: "#E36F58",
      type: "EXPENSE",
      sortOrder: 4,
      isActive: true,
    },
    {
      id: "cat_digital",
      userId: "SYSTEM",
      parentId: "cat_shopping",
      name: "数码",
      icon: "cellphone",
      color: "#E36F58",
      type: "EXPENSE",
      sortOrder: 5,
      isActive: true,
    },

    // --- 个人形象 (美妆/护肤) ---
    {
      id: "cat_beauty_root",
      userId: "SYSTEM",
      parentId: null,
      name: "形象",
      icon: "face-woman-shimmer-outline",
      color: "#E36F58", // 紫色：气质
      type: "EXPENSE",
      sortOrder: 6,
      isActive: true,
    },
    {
      id: "cat_beauty",
      userId: "SYSTEM",
      parentId: "cat_beauty_root",
      name: "美妆",
      icon: "lipstick",
      color: "#E36F58",
      type: "EXPENSE",
      sortOrder: 7,
      isActive: true,
    },
    {
      id: "cat_skin",
      userId: "SYSTEM",
      parentId: "cat_beauty_root",
      name: "护肤",
      icon: "bottle-tonic-plus-outline",
      color: "#E36F58",
      type: "EXPENSE",
      sortOrder: 8,
      isActive: true,
    },

    // --- 居住与交通 ---
    {
      id: "cat_house",
      userId: "SYSTEM",
      parentId: null,
      name: "住房",
      icon: "home-city-outline",
      color: "#E36F58", // 浅蓝：安稳
      type: "EXPENSE",
      sortOrder: 9,
      isActive: true,
    },
    {
      id: "cat_traffic",
      userId: "SYSTEM",
      parentId: null,
      name: "交通",
      icon: "bus",
      color: "#E36F58", // 深蓝：物流
      type: "EXPENSE",
      sortOrder: 10,
      isActive: true,
    },
    {
      id: "cat_car",
      userId: "SYSTEM",
      parentId: "cat_traffic",
      name: "汽车",
      icon: "car-outline",
      color: "#E36F58",
      type: "EXPENSE",
      sortOrder: 11,
      isActive: true,
    },

    // --- 娱乐与社交 ---
    {
      id: "cat_game",
      userId: "SYSTEM",
      parentId: null,
      name: "娱乐",
      icon: "gamepad-variant-outline",
      color: "#E36F58", // 黄色：快乐
      type: "EXPENSE",
      sortOrder: 12,
      isActive: true,
    },
    {
      id: "cat_travel_root",
      userId: "SYSTEM",
      parentId: "cat_game",
      name: "旅行",
      icon: "bag-suitcase-outline",
      color: "#E36F58",
      type: "EXPENSE",
      sortOrder: 13,
      isActive: true,
    },
    {
      id: "cat_vacation",
      userId: "SYSTEM",
      parentId: "cat_game",
      name: "度假",
      icon: "palm-tree",
      color: "#E36F58",
      type: "EXPENSE",
      sortOrder: 14,
      isActive: true,
    },
    {
      id: "cat_social",
      userId: "SYSTEM",
      parentId: null,
      name: "社交",
      icon: "account-group-outline",
      color: "#E36F58", // 靛蓝
      type: "EXPENSE",
      sortOrder: 15,
      isActive: true,
    },
    {
      id: "cat_favor",
      userId: "SYSTEM",
      parentId: "cat_social",
      name: "人情",
      icon: "hand-heart-outline",
      color: "#E36F58",
      type: "EXPENSE",
      sortOrder: 16,
      isActive: true,
    },

    // --- 生活琐事与医疗 ---
    {
      id: "cat_medical",
      userId: "SYSTEM",
      parentId: null,
      name: "医疗",
      icon: "medical-bag",
      color: "#E36F58", // 绿色：健康
      type: "EXPENSE",
      sortOrder: 17,
      isActive: true,
    },
    {
      id: "cat_baby",
      userId: "SYSTEM",
      parentId: null,
      name: "育儿",
      icon: "baby-face-outline",
      color: "#E36F58",
      type: "EXPENSE",
      sortOrder: 18,
      isActive: true,
    },
    {
      id: "cat_pet",
      userId: "SYSTEM",
      parentId: null,
      name: "宠物",
      icon: "paw-outline",
      color: "#E36F58", // 灰色
      type: "EXPENSE",
      sortOrder: 19,
      isActive: true,
    },

    // --- 办公与学习 ---
    {
      id: "cat_study",
      userId: "SYSTEM",
      parentId: null,
      name: "学习",
      icon: "book-open-page-variant-outline",
      color: "#E36F58",
      type: "EXPENSE",
      sortOrder: 20,
      isActive: true,
    },
    {
      id: "cat_office",
      userId: "SYSTEM",
      parentId: null,
      name: "办公",
      icon: "printer-outline",
      color: "#E36F58",
      type: "EXPENSE",
      sortOrder: 21,
      isActive: true,
    },

    // --- 其他 ---
    {
      id: "cat_smoke",
      userId: "SYSTEM",
      parentId: null,
      name: "烟酒",
      icon: "glass-cocktail",
      color: "#E36F58",
      type: "EXPENSE",
      sortOrder: 22,
      isActive: true,
    },
    {
      id: "cat_lottery",
      userId: "SYSTEM",
      parentId: null,
      name: "彩票",
      icon: "ticket-outline",
      color: "#E36F58",
      type: "EXPENSE",
      sortOrder: 23,
      isActive: true,
    },
    {
      id: "cat_salary",
      userId: "SYSTEM",
      parentId: null,
      name: "工资",
      icon: "cash-multiple",
      color: "#60C170",
      type: "INCOME",
      sortOrder: 101,
      isActive: true,
    },
    {
      id: "cat_bonus",
      userId: "SYSTEM",
      parentId: null,
      name: "奖金",
      icon: "gift-outline",
      color: "#60C170",
      type: "INCOME",
      sortOrder: 102,
      isActive: true,
    },
    {
      id: "cat_investment",
      userId: "SYSTEM",
      parentId: null,
      name: "理财",
      icon: "chart-line",
      color: "#60C170",
      type: "INCOME",
      sortOrder: 103,
      isActive: true,
    },
    {
      id: "cat_refund_income",
      userId: "SYSTEM",
      parentId: null,
      name: "退款收入",
      icon: "keyboard-return",
      color: "#60C170",
      type: "INCOME",
      sortOrder: 104,
      isActive: true,
    },
  ],
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategories(state, action: PayloadAction<Category[]>) {
      state.items = action.payload;
    },
    addCategory(state, action: PayloadAction<Category>) {
      state.items.push(action.payload);
    },
    upsertCategory(state, action: PayloadAction<Category>) {
      const next = action.payload;
      const index = state.items.findIndex((item) => item.id === next.id);

      if (index === -1) {
        state.items.push(next);
        return;
      }

      state.items[index] = next;
    },
    updateCategory(
      state,
      action: PayloadAction<{ id: string; changes: Partial<Category> }>,
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
    removeCategory(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearCategories(state) {
      state.items = [];
    },
    resetCategories: () => initialState,
  },
});

export const {
  setCategories,
  addCategory,
  upsertCategory,
  updateCategory,
  removeCategory,
  clearCategories,
  resetCategories,
} = categoriesSlice.actions;

export const selectCategories = (state: { categories: CategoriesState }) =>
  state.categories.items;

export const selectCategoryById =
  (id: string) => (state: { categories: CategoriesState }) =>
    state.categories.items.find((item) => item.id === id);

export default categoriesSlice.reducer;
