import axiosInstance from "../config/axios.config";

export const createOrderFromCart=(paymentMethod, addressId) =>
    axiosInstance.post("/order/create/cart/orders", {paymentMethod, addressId});

export const createOrderFromProduct=(productId, quantity, paymentMethod, addressId) =>
    axiosInstance.post("/order/create/product/order", {productId, quantity, paymentMethod, addressId});

export const getAllOrders=() =>
    axiosInstance.get("/order/all");

export const getOrderById=(orderId) =>
    axiosInstance.get(`/order/${orderId}`);

export const getOrdersByCategory=(categoryId) =>
    axiosInstance.get(`/order/category/${categoryId}`);

export const getOrdersByStatus=(status) =>
    axiosInstance.get(`/order/status/${status}`);

export const updateOrderStatus=(orderId, status) =>
    axiosInstance.put(`/order/update/status/${orderId}`, {status});

export const cancelOrder=(orderId) =>
    axiosInstance.put(`/order/cancel/${orderId}`, {});
