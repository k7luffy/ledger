import { combineReducers } from "@reduxjs/toolkit";
// import accountsReducer from '../features/accounts/accountsSlice';
// import categoriesReducer from '../features/categories/categoriesSlice';
import transactionsReducer from "./transactionsSlice";
import categoriesReducer from "./categoriesSlice";

const rootReducer = combineReducers({
  transactions: transactionsReducer,
  categories: categoriesReducer,
  // accounts: accountsReducer,
  // categories: categoriesReducer,
});

export default rootReducer;
