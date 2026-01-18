import axiosInstance from "../config/axios.config";

export const getCart=() =>
    axiosInstance.get("/cart/get");

export const addToCart=(productId, quantity) =>
    axiosInstance.post("/cart/add", {productId, quantity});

export const updateCartItem=(productId, quantity) =>
    axiosInstance.put("/cart/update", {productId, quantity});

export const removeFromCart=(productId) =>
    axiosInstance.delete("/cart/delete", {data: {productId}});

export const clearCart=() =>
    axiosInstance.delete("/cart/clear");
