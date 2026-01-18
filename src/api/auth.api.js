import axiosInstance from "../config/axios.config";

export const register=(email, password, firstName, lastName, phoneNumber) =>
    axiosInstance.post("/auth/register", {email, password, firstName, lastName, phoneNumber});

export const login=(email, password) =>
    axiosInstance.post("/auth/login", {email, password});

export const getCurrentUser=() =>
    axiosInstance.get("/auth/current/user");

export const completeProfile=(firstName, lastName, phoneNumber) =>
    axiosInstance.post("/auth/complete/profile", {firstName, lastName, phoneNumber});

export const updateProfile=(firstName, lastName, phoneNumber) =>
    axiosInstance.put("/auth/update", {firstName, lastName, phoneNumber});

export const logout=() =>
    axiosInstance.post("/auth/logout", {});

export const deleteAccount=() =>
    axiosInstance.delete("/auth/delete");

export const forgotPassword=(email) =>
    axiosInstance.post("/auth/forgot-password", {email});

export const resetPassword=(token, newPassword) =>
    axiosInstance.post("/auth/reset-password", {token, newPassword});

// Google OAuth - requires full page redirect, not AJAX request
export const googleAuth=() =>
{
    const API_BASE_URL=import.meta.env.VITE_API_BASE_URL||'http://localhost:3000/api';
    window.location.href=`${API_BASE_URL}/auth/google/auth`;
};
