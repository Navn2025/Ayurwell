import axiosInstance from "../config/axios.config";

export const searchSuggestions=(query) =>
    axiosInstance.get("/search/suggestions", {params: {query}});

export const globalSearch=(query) =>
    axiosInstance.get("/search/global", {params: {query}});

export const searchProducts=(query) =>
    axiosInstance.get("/search/products", {params: {query}});
