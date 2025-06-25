import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./service/authSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import { todoListApi } from "../redux/service/todoListSlice";
import { todoItemApi } from "./service/todoItemSlice";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [todoListApi.reducerPath]: todoListApi.reducer,
    [todoItemApi.reducerPath]: todoItemApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(todoListApi.middleware)
      .concat(todoItemApi.middleware),
});

setupListeners(store.dispatch);
