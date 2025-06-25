import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_ENDPOINT,
    prepareHeaders: (headers, { getState }) => {
      // Add authorization header if needed
      return headers;
    },
  }),
  endpoints: (build) => ({
    getLogin: build.mutation({
      query: ({ email, password }) => ({
        url: "/auth/login",
        method: "POST",
        body: { email, password },
      }),
    }),
    getVerified: build.mutation({
      query: (accessToken) => ({
        url: "/auth/verify/me",
        method: "POST",
        body: { accessToken },
      }),
    }),
    sigup: build.mutation({
      query: ({
        username,
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
      }) => ({
        url: "/auth/register",
        method: "POST",
        body: {
          username,
          email,
          password,
          confirmPassword,
          firstName,
          lastName,
        },
      }),
    }),
    verifyEmail: build.mutation({
      query: ({ email, verificationCode }) => ({
        url: "/auth/verify",
        method: "POST",
        body: {
          email: email.trim(),
          verificationCode: verificationCode.trim(),
        },
      }),
    }),
    updateUser: build.mutation({
      query: ({ uuid, userData, accessToken }) => ({
        url: `/user/update/${uuid}`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }),
      invalidatesTags: ["User"],
    }),
    uploadProfileImage: build.mutation({
      query: ({ file, accessToken }) => {
        console.log("Preparing upload request for file:", file.name, "Size:", file.size, "Type:", file.type);
        const formData = new FormData();
        formData.append("file", file);
        // You might need to append additional fields based on your API requirements
        // formData.append("type", "profile");

        return {
          url: "/files", // Adjust this to match your actual endpoint
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            // Don't set Content-Type for FormData - let the browser set it with boundary
          },
          body: formData,
        };
      },
      transformResponse: (response, meta, arg) => {
        console.log("=== UPLOAD RESPONSE DEBUG ===");
        console.log("Raw response:", response);
        console.log("Response type:", typeof response);
        console.log("Response keys:", response && typeof response === 'object' ? Object.keys(response) : 'N/A');
        console.log("Meta:", meta);
        console.log("==============================");
        
        // Don't transform - return as-is so we can debug in the component
        return response;
      },
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetLoginMutation,
  useGetVerifiedMutation,
  useSigupMutation,
  useVerifyEmailMutation,
  useUpdateUserMutation,
  useUploadProfileImageMutation,
} = authApi;
