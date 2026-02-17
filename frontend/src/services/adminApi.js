import { apiSlice } from "./apiSlice";

const ADMIN_URL = "/admin";

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => `${ADMIN_URL}/users`,
      providesTags: ["User"],
    }),
    getAllAdminTasks: builder.query({
      query: () => `${ADMIN_URL}/tasks`,
      providesTags: ["Tasks"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_URL}/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    getEngagementStats: builder.query({
      query: () => `${ADMIN_URL}/engagement-stats`,
      providesTags: ["Stats"],
    }),
    deleteAdminTask: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_URL}/tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks"],
    }),
    updateAdminTask: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${ADMIN_URL}/tasks/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Tasks"],
    }),
    getSystemStats: builder.query({
      query: () => `${ADMIN_URL}/system-stats`,
      providesTags: ["Stats"],
    }),
    clearActivityLogs: builder.mutation({
      query: () => ({
        url: `${ADMIN_URL}/clear-logs`,
        method: "DELETE",
      }),
      invalidatesTags: ["Stats"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetAllAdminTasksQuery,
  useDeleteUserMutation,
  useGetEngagementStatsQuery,
  useDeleteAdminTaskMutation,
  useUpdateAdminTaskMutation,
  useGetSystemStatsQuery,
  useClearActivityLogsMutation,
} = adminApi;
