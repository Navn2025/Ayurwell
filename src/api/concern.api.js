import axiosInstance from "../config/axios.config";

// Concern CRUD
export const getAllConcerns=(includeInactive=false) =>
    axiosInstance.get(`/concern${includeInactive? '?includeInactive=true':''}`);

export const getConcernById=(id) =>
    axiosInstance.get(`/concern/id/${id}`);

export const getConcernBySlug=(slug) =>
    axiosInstance.get(`/concern/slug/${slug}`);

export const createConcern=(concernData) =>
    axiosInstance.post("/concern", concernData);

export const updateConcern=(id, concernData) =>
    axiosInstance.put(`/concern/${id}`, concernData);

export const deleteConcern=(id) =>
    axiosInstance.delete(`/concern/${id}`);

// Concern Image operations (Single image)
export const uploadConcernImage=(concernId, formData) =>
    axiosInstance.post(`/concern/${concernId}/image`, formData, {
        headers: {"Content-Type": "multipart/form-data"}
    });

export const deleteConcernImage=(concernId) =>
    axiosInstance.delete(`/concern/${concernId}/image`);
