import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const todoItemApi = createApi({
  reducerPath: "todoItemApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_ENDPOINT,
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      headers.set("content-type", "application/json");
    },
  }),
  tagTypes: ["TodoItem", "TodoList","Tag"],
  endpoints: (builder) => ({
    createTodoItem: builder.mutation({
      query: (todoItemRequest) => ({
        url: "/todo-item/create",
        method: "POST",
        body: todoItemRequest,
      }),
      invalidatesTags: ["TodoItem","TodoList"],
    }),
    completeTodoItem: builder.mutation({
      query: (id) => ({
        url: `/todo-item/${id}/complete`,
        method: "PATCH",
      }),
      invalidatesTags: ["TodoItem","TodoList"],
    }),
    uncompleteTodoItem: builder.mutation({
      query: (id) => ({
        url: `/todo-item/${id}/uncomplete`,
        method: "PATCH",
      }),
      invalidatesTags: ["TodoItem","TodoList"],
    }),
    createTag: builder.mutation({
      query: ({ name, tagColor, todoItemId }) => ({
        url: "/tags/to-do",
        method: "POST",
        body: {
          name,
          tagColor,
          todoItemId,
        },
      }),
      invalidatesTags: ["Tag"],
    }),
  }),
});

export const{
    useCreateTodoItemMutation,
    useCompleteTodoItemMutation,
    useUncompleteTodoItemMutation,
    useCreateTagMutation
} = todoItemApi
