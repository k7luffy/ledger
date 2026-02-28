// src/store/index.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import rootReducer from "./rootReducer";
import type { PersistConfig } from "redux-persist";

/**
 * 1) redux-persist 的核心配置
 * - key:     存储在本地的命名空间前缀
 * - storage: 用什么存（在 RN 里就是 AsyncStorage）
 * - version: 数据结构版本号（以后数据结构变了可用 migrate 迁移）
 * - whitelist: 想要持久化的切片（slice）名单
 *   ⚠️ 只有列表里的 slice 会被持久化到 AsyncStorage
 */
type RootReducerState = ReturnType<typeof rootReducer>;

const persistConfig: PersistConfig<RootReducerState> = {
  key: "root",
  storage: AsyncStorage,
  version: 1,
  whitelist: ["transactions", "categories", "accounts"], // 只保存 transactions；想保存 accounts 就加 'accounts'
  // migrate: async (state) => state, // 需要做数据迁移时再打开
};

/**
 * 2) 把根 reducer 包一层 persistReducer
 *   这一步相当于把 “持久化能力” 嵌入到 Redux 的 reducer 里
 */
const persistedReducer = persistReducer(persistConfig, rootReducer);

/**
 * 3) 创建 Redux store
 * - 使用 Redux Toolkit 的 configureStore 简化配置
 * - middleware.serializableCheck：忽略 redux-persist 内部 action 的序列化校验
 *   否则开发时控制台会有一堆“非序列化值”的警告（因为 persist 里确实带有非序列化对象）
 */
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  // devTools: process.env.NODE_ENV !== 'production', // 需要时可打开
});

/**
 * 4) 创建 persistor
 * - persistor 负责：把 store 里的“受管 slice”写入 AsyncStorage，
 *   并在 App 启动时从 AsyncStorage 读回来（rehydrate）
 */
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
