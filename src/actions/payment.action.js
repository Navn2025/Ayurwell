import axios from "axios";

const API="http://localhost:3000/api";

export const createOrder=(productId, quantity, paymentMethod, addressId) =>
{
    return axios.post(
        `${API}/order/create/product/order`,
        {productId, quantity, paymentMethod, addressId},
        {withCredentials: true}
    );
};

export const initiatePayment=(orderId) =>
{
    return axios.post(
        `${API}/razorpay/initiate/${orderId}`,
        {},
        {withCredentials: true}
    );
};

export const verifyPayment=(paymentData) =>
{
    return axios.post(
        `${API}/razorpay/verify`,
        paymentData,
        {withCredentials: true}
    );
};
