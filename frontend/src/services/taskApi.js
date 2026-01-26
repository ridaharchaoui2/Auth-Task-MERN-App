import { apiSlice } from "./apiSlice";

const TASKS_URL = "/tasks";

export const taskApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllTasks: builder.query({
      query: () => `${TASKS_URL}/all`,
      providesTags: ["Tasks"],
    }),
    updateTask: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${TASKS_URL}/update/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Tasks"],
    }),
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `${TASKS_URL}/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks"],
    }),
    AddTask: builder.mutation({
      query: (body) => ({
        url: `${TASKS_URL}/create`,
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
