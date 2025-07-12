import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const todoListApi = createApi({
  reducerPath: "todoListApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_ENDPOINT,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["TodoList"],
  endpoints: (builder) => ({
    getTodoLists: builder.query({
      query: (uuid) => `user/${uuid}/todo-lists`,
      providesTags: ["TodoList"],
    }),
    createTodoList: builder.mutation({
      query: (todoListRequest) => ({
        url: "/todo-lists/createTodoList",
        method: "POST",
        body: todoListRequest,
      }),
      invalidatesTags: ["TodoList"],
    }),
    deleteTodoList: builder.mutation({
      query: (id) => ({
        url: `/todo-lists/delete/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["TodoList"]
    })
  }),
});

export const { useGetTodoListsQuery, useCreateTodoListMutation, useDeleteTodoListMutation } = todoListApi;
