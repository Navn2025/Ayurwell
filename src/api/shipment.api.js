import axiosInstance from "../config/axios.config";

export const getShipment=(orderId) =>
    axiosInstance.get(`/shipment/order/${orderId}`);

export const getShipmentByOrder=(orderId) =>
    axiosInstance.get(`/shipment/order/${orderId}`);

export const getShipmentById=(shipmentId) =>
    axiosInstance.get(`/shipment/${shipmentId}`);

export const getAllShipments=(params={}) =>
    axiosInstance.get("/shipment", {params});

export const cancelShipment=(orderId) =>
    axiosInstance.post(`/shipment/order/${orderId}/cancel`, {});

export const requestRTO=(orderId) =>
    axiosInstance.post(`/shipment/order/${orderId}/request-rto`, {});

export const calculateShipping=(shipmentData) =>
    axiosInstance.post("/shipment/calculate-shipping", shipmentData);

export const calculateCartShipping=(pincode) =>
    axiosInstance.post("/shipment/calculate-cart-shipping", {pincode});

export const createShipment=(orderId) =>
    axiosInstance.post(`/shipment/order/${orderId}`, {});

export const trackShipment=(shipmentId) =>
    axiosInstance.get(`/shipment/${shipmentId}/track`);

export const schedulePickup=(shipmentId) =>
    axiosInstance.post(`/shipment/${shipmentId}/schedule-pickup`, {});

export const generateLabel=(shipmentId) =>
    axiosInstance.get(`/shipment/${shipmentId}/label`);

export const generateManifest=(shipmentIds) =>
    axiosInstance.post("/shipment/manifest", {shipmentIds});
