import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const USER_URL = "/api/users";
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/" }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: `${USER_URL}/login`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
