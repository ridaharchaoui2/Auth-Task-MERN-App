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
  }),
});

export const {
  useGetAllUsersQuery,
  useGetAllAdminTasksQuery,
  useDeleteUserMutation,
  useGetEngagementStatsQuery,
} = adminApi;
