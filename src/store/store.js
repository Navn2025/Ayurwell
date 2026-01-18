import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./slices/auth.slice";
import productReducer from "./slices/product.slice";
import categoryReducer from "./slices/category.slice";
import cartReducer from "./slices/cart.slice";
import addressReducer from "./slices/address.slice";
import orderReducer from "./slices/order.slice";
import paymentReducer from "./slices/payment.slice";
import refundReducer from "./slices/refund.slice";
import searchReducer from "./slices/search.slice";
import adminReducer from "./slices/admin.slice";
import shipmentReducer from "./slices/shipment.slice";
import uiReducer from "./slices/ui.slice";
import codReducer from "./slices/cod.slice";
import reviewReducer from "./slices/review.slice";
import concernReducer from "./slices/concern.slice";
import returnReducer from "./slices/return.slice";
import contactReducer from "./slices/contact.slice";
import profileReducer from "./slices/profile.slice";

export const store=configureStore({
    reducer: {
        auth: authReducer,
        product: productReducer,
        category: categoryReducer,
        cart: cartReducer,
        address: addressReducer,
        order: orderReducer,
        payment: paymentReducer,
        refund: refundReducer,
        search: searchReducer,
        admin: adminReducer,
        shipment: shipmentReducer,
        ui: uiReducer,
        cod: codReducer,
        review: reviewReducer,
        concern: concernReducer,
return: returnReducer,
        contact: contactReducer,
        profile: profileReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
            },
        }),
    devTools: import.meta.env.DEV,
});

export default store;
