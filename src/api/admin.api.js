import axiosInstance from "../config/axios.config";

// ============ DASHBOARD ============
export const getDashboardStats=() =>
    axiosInstance.get("/admin/dashboard");

// ============ COD ORDERS ============
export const getCODOrders=(params={}) =>
    axiosInstance.get("/admin/cod-orders", {params});

export const settleCODOrder=(orderId) =>
    axiosInstance.post(`/admin/settle-cod/${orderId}`, {});

// ============ USERS ============
export const getAllUsers=(params={}) =>
    axiosInstance.get("/admin/users", {params});

export const getUserById=(userId) =>
    axiosInstance.get(`/admin/users/${userId}`);

export const updateUserRole=(userId, role) =>
    axiosInstance.patch(`/admin/users/${userId}/role`, {role});

export const deleteUser=(userId) =>
    axiosInstance.delete(`/admin/users/${userId}`);

// ============ PAYMENTS ============
export const getAllPayments=(params={}) =>
    axiosInstance.get("/admin/payments", {params});

export const getPaymentById=(paymentId) =>
    axiosInstance.get(`/admin/payments/${paymentId}`);

// Alias for backward compatibility
export const getPaymentDetails=getPaymentById;

// ============ SHIPMENTS ============
export const retryAWBAssignment=() =>
    axiosInstance.post(`/admin/retry-awb/`, {});

// ============ ORDERS ============
export const getAdminOrders=(params={}) =>
    axiosInstance.get("/admin/orders", {params});

export const updateOrder=(orderId, orderData) =>
    axiosInstance.patch(`/admin/orders/${orderId}`, orderData);

// ============ REPORTS ============
export const getInventoryReport=() =>
    axiosInstance.get("/admin/reports/inventory");

export const getSalesReport=(params={}) =>
    axiosInstance.get("/admin/reports/sales", {params});
