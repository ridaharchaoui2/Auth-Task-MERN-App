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
  }),
});

export const { useGetAllTasksQuery } = taskApi;
