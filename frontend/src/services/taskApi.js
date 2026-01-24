import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const taskApi = createApi({
  reducerPath: "taskApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/tasks",
    credentials: "include",
  }),
  tagTypes: ["Tasks"],
  endpoints: (builder) => ({
    getAllTasks: builder.query({
      query: () => "/all",
      providesTags: ["Tasks"],
      invalidatesTags: ["Tasks"],
    }),
    updateTask: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/update/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Tasks"],
    }),
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks"],
    }),
    AddTask: builder.mutation({
      query: (body) => ({
        url: `/create`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tasks"],
    }),
  }),
});

export const {
  useGetAllTasksQuery,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
  useAddTaskMutation,
} = taskApi;
