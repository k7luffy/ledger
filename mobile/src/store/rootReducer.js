import { combineReducers } from "@reduxjs/toolkit";
// import accountsReducer from '../features/accounts/accountsSlice';
// import categoriesReducer from '../features/categories/categoriesSlice';
import transactionsReducer from "./transactionsSlice";

const rootReducer = combineReducers({
  transactions: transactionsReducer,
  // accounts: accountsReducer,
  // categories: categoriesReducer,
});

export default rootReducer;
