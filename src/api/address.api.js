import axiosInstance from "../config/axios.config";

export const getAllAddresses=() =>
    axiosInstance.get("/address");

export const createAddress=(addressData) =>
    axiosInstance.post("/address", addressData);

export const updateAddress=(addressData) =>
    axiosInstance.put("/address", addressData);

export const deleteAddress=(addressId) =>
    axiosInstance.delete(`/address/${addressId}`);

export const setDefaultAddress=(addressId) =>
    axiosInstance.patch(`/address/${addressId}/default`);
