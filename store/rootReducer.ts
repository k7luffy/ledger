import { combineReducers } from "@reduxjs/toolkit";
import accountsReducer from "../features/accounts/accountsSlice";
import categoriesReducer from "../features/categories/categoriesSlice";
import transactionsReducer from "../features/transactions/transactionsSlice";

const rootReducer = combineReducers({
  transactions: transactionsReducer,
  categories: categoriesReducer,
  accounts: accountsReducer,
});

export default rootReducer;
