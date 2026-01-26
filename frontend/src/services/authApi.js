import { apiSlice } from "./apiSlice";

const USER_URL = "/users";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: `${USER_URL}/login`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tasks", "User"],
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USER_URL}/logout`,
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
    register: builder.mutation({
      query: (body) => ({
        url: `${USER_URL}/register`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useRegisterMutation } =
  authApi;
