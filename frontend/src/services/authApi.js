import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const USER_URL = "/api/users";
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/",
    credentials: "include", // This enables cookies
  }),
  tagTypes: ["User", "Tasks"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: `${USER_URL}/login`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tasks"],
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USER_URL}/logout`,
        method: "POST",
      }),
      invalidatesTags: ["Tasks"],
    }),
    register: builder.mutation({
      query: (body) => ({
        url: `${USER_URL}/register`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useRegisterMutation } =
  authApi;
