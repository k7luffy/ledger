import { PayloadAction, createSlice, nanoid } from "@reduxjs/toolkit";

export interface CategoryItem {
  id: string;
  label: string;
  icon: string;
  tint: string;
}

export interface CategoryGroup {
  title: string;
  key: string;
  items: CategoryItem[];
}

export interface CategoriesState {
  list: CategoryGroup[];
}

const initialState: CategoriesState = {
  list: [
    {
      title: "最近使用",
      key: "recent",
      items: [
        {
          id: "1",
          label: "早午晚餐",
          icon: "silverware-fork-knife",
          tint: "#FF8B66",
        },
      ],
    },
    {
      title: "食品酒水",
      key: "food",
      items: [
        {
          id: "2",
          label: "早午晚餐",
          icon: "silverware-fork-knife",
          tint: "#FF8B66",
        },
        { id: "3", label: "烟酒茶", icon: "glass-cocktail", tint: "#FFB347" },
        { id: "4", label: "水果零食", icon: "ice-cream", tint: "#4FA8FF" },
      ],
    },
    {
      title: "行车交通",
      key: "transport",
      items: [
        { id: "5", label: "公共交通", icon: "bus", tint: "#4CB0FF" },
        { id: "6", label: "打车租车", icon: "car", tint: "#FF9B6A" },
        { id: "7", label: "私家车费用", icon: "car-cog", tint: "#8C77FF" },
      ],
    },
    {
      title: "居家物业",
      key: "home",
      items: [
        { id: "8", label: "水电煤气", icon: "water", tint: "#32C48C" },
        {
          id: "9",
          label: "房租物业",
          icon: "home-city-outline",
          tint: "#FF779E",
        },
        {
          id: "10",
          label: "维修清洁",
          icon: "toolbox-outline",
          tint: "#3E82FF",
        },
      ],
    },
  ],
};

type AddChildCategoryPayload = {
  type: "child";
  key: string;
  items: Array<Omit<CategoryItem, "id">>;
};

interface AddCategoryPreparedPayload {
  key: string;
  items: CategoryItem[];
}

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    addCategories: {
      prepare(category: AddChildCategoryPayload) {
        const newItems = category.items.map((item) => ({
          id: nanoid(),
          ...item,
        }));
        return { payload: { key: category.key, items: newItems } };
      },
      reducer(state, action: PayloadAction<AddCategoryPreparedPayload>) {
        const target = state.list.find((d) => d.key === action.payload.key);
        if (target) {
          target.items.push(...action.payload.items);
        }
      },
    },
    resetCategories: () => initialState,
  },
});

export const { addCategories, resetCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer;

// Selectors
export const selectAllCategories = (state: { categories: CategoriesState }) =>
  state.categories.list;

export const selectCategoryById = (
  state: { categories: CategoriesState },
  id: string
) => {
  const allItems = state.categories.list.flatMap((group) => group.items);

  return allItems.find((item) => item.id === id);
};
