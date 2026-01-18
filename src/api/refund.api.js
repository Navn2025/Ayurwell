import axiosInstance from "../config/axios.config";

export const cancelOrderWithRefund=(orderId) =>
    axiosInstance.post(`/refund/cancel/${orderId}`, {});

export const getRefundStatus=(orderId) =>
    axiosInstance.get(`/refund/order/${orderId}`);

export const getRefundById=(refundId) =>
    axiosInstance.get(`/refund/${refundId}`);

export const getAllRefunds=() =>
    axiosInstance.get("/refund/all");

export const processRTORefund=(orderId) =>
    axiosInstance.post(`/refund/rto/${orderId}`, {});

export const processReturnRefund=(returnId) =>
    axiosInstance.post(`/refund/return/${returnId}`, {});

export const initiateAdminRefund=(orderId, reason) =>
    axiosInstance.post(`/refund/admin/${orderId}`, {reason});

export const retryFailedRefund=(refundId) =>
    axiosInstance.post(`/refund/retry/${refundId}`, {});
