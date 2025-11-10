import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  list: [
    {
      title: "最近使用",
      key: "recent",
      items: [
        {
          id: 1,
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
          id: 2,
          label: "早午晚餐",
          icon: "silverware-fork-knife",
          tint: "#FF8B66",
        },
        { id: 3, label: "烟酒茶", icon: "glass-cocktail", tint: "#FFB347" },
        { id: 4, label: "水果零食", icon: "ice-cream", tint: "#4FA8FF" },
      ],
    },
    {
      title: "行车交通",
      key: "transport",
      items: [
        { id: 5, label: "公共交通", icon: "bus", tint: "#4CB0FF" },
        { id: 6, label: "打车租车", icon: "car", tint: "#FF9B6A" },
        { id: 7, label: "私家车费用", icon: "car-cog", tint: "#8C77FF" },
      ],
    },
    {
      title: "居家物业",
      key: "home",
      items: [
        { id: 8, label: "水电煤气", icon: "water", tint: "#32C48C" },
        {
          id: 9,
          label: "房租物业",
          icon: "home-city-outline",
          tint: "#FF779E",
        },
        {
          id: 10,
          label: "维修清洁",
          icon: "toolbox-outline",
          tint: "#3E82FF",
        },
      ],
    },
  ],
};

// add data:
// 1. add parent
// {
//   type: "parent",
//   title: "食品酒水",
//   key: "food",
// }
// 2. add child
// {
//   type: "child",
//   key: "food",
//   items: [
//     { label: "早午晚餐", icon: "silverware-fork-knife", tint: "#FFE8E8" },
//     { label: "烟酒茶", icon: "glass-cocktail", tint: "#FFF3D7" },
//     { label: "水果零食", icon: "ice-cream", tint: "#E7F6FF" },
//   ],
// }

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    addCategories: {
      prepare(category) {
        if ((category.type = "child")) {
          const newItmes = category.items.map((item) => ({
            id: nanoid(),
            ...item,
          }));
          return { payload: { key: category.key, items: newItmes } };
        }
      },
      reducer(state, actions) {
        const target = state.list.find((d) => d.key === actions.payload.key);
        if (target) {
          target.items.push(...actions.payload.items);
        }
      },
    },
    resetCategories: () => initialState,
  },
});

export const { addCategories, resetCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer;

// Selectors
export const selectAllCategories = (state) => state.categories.list;
export const selectCategoryById = (state, id) => {
  const allItems = state.categories.list.flatMap((group) => group.items);

  return allItems.find((item) => item.id === id);
};
