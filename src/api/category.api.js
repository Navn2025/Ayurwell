import axiosInstance from "../config/axios.config";

export const getAllCategories=() =>
    axiosInstance.get("/category/tree");

export const getCategoryBySlug=(slug) =>
    axiosInstance.get(`/category/slug/${slug}`);

export const getCategoryById=(id) =>
    axiosInstance.get(`/category/id/${id}`);

export const createCategory=(categoryData) =>
    axiosInstance.post("/category", categoryData);

export const updateCategory=(id, categoryData) =>
    axiosInstance.put(`/category/id/${id}`, categoryData);

export const deleteCategory=(id) =>
    axiosInstance.delete(`/category/id/${id}`);

// Category Image operations (Single image)
export const uploadCategoryImage=(id, formData) =>
    axiosInstance.post(`/category/id/${id}/image`, formData, {
        headers: {"Content-Type": "multipart/form-data"}
    });

export const deleteCategoryImage=(id) =>
    axiosInstance.delete(`/category/id/${id}/image`);
