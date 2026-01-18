import axiosInstance from "../config/axios.config";

// NOTE: COD route exists in backend but is NOT MOUNTED in app.js yet
// Ask backend team to mount cod.route.js in app.js

export const createCODShipment=(orderId) =>
    axiosInstance.post(`/cod/${orderId}`);
