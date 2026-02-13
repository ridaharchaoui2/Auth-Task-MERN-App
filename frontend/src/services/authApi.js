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
    getUserProfile: builder.query({
      query: (id) => `${USER_URL}/profile/${id}`,
      providesTags: ["User"],
    }),
    updateUserProfile: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${USER_URL}/profile/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    uploadAvatar: builder.mutation({
      query: (formData) => ({
        url: `${USER_URL}/upload-avatar`, // Match your backend route
        method: "POST",
        body: formData,
        // IMPORTANT: Do not add headers here.
        // RTK Query detects FormData and handles headers automatically.
      }),
      invalidatesTags: ["User"], // Refresh profile data after upload
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useUploadAvatarMutation,
} = authApi;
