import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://auth-task-mern-app-backend.vercel.app/api",
    credentials: "include",
  }),
  tagTypes: ["User", "Tasks"],
  endpoints: () => ({}),
});
