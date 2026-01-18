import axiosInstance from "../config/axios.config";

export const initiatePayment=(orderId) =>
    axiosInstance.post(`/razorpay/initiate/${orderId}`, {});

export const verifyPayment=(razorpay_order_id, razorpay_payment_id, razorpay_signature) =>
    axiosInstance.post("/razorpay/verify", {razorpay_order_id, razorpay_payment_id, razorpay_signature});
