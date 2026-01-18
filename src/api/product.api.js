import axiosInstance from "../config/axios.config";

export const getAllProducts=() =>
    axiosInstance.get("/product/get/all");

export const getTrendingProducts=() =>
    axiosInstance.get("/product/get/trending");

export const getBestSellingProducts=() =>
    axiosInstance.get("/product/get/best-selling");

export const getProductById=(productId) =>
{
    console.log(productId);

    return axiosInstance.get(`/product/get/product/${productId}`);
}

export const getProductBySlug=(slug) =>
    axiosInstance.get(`/product/get/slug/${slug}`);

export const getProductsByCategory=(categoryId) =>
    axiosInstance.get(`/product/get/category/${categoryId}`);

export const getProductsByCategorySlug=(slug, limit, page) =>
{
    let url=`/product/get/category-slug/${slug}`;
    const params=[];
    if (limit) params.push(`limit=${limit}`);
    if (page) params.push(`page=${page}`);
    if (params.length>0) url+=`?${params.join('&')}`;
    return axiosInstance.get(url);
};
export const getProductsByConcern=(concernId) =>
    axiosInstance.get(`/product/get/concern/${concernId}`);

export const getProductsByConcernSlug=(slug, page=1, limit=16) =>
    axiosInstance.get(`/product/get/concern-slug/${slug}?page=${page}&limit=${limit}`);

export const createProduct=(productData) =>
    axiosInstance.post("/product/add", productData);

export const updateProduct=(productId, productData) =>
    axiosInstance.put(`/product/update/${productId}`, productData);

export const deleteProduct=(productId) =>
    axiosInstance.delete(`/product/delete/${productId}`);

export const toggleProductTrending=(productId) =>
    axiosInstance.patch(`/product/toggle-trending/${productId}`);

// FAQ APIs
export const getProductFAQs=(productId) =>
    axiosInstance.get(`/product/${productId}/faqs`);

export const addProductFAQ=(productId, faqData) =>
    axiosInstance.post(`/product/${productId}/faqs`, faqData);

export const updateProductFAQ=(faqId, faqData) =>
    axiosInstance.put(`/product/faqs/${faqId}`, faqData);

export const deleteProductFAQ=(faqId) =>
    axiosInstance.delete(`/product/faqs/${faqId}`);

// Direction (How to Use) APIs
export const getProductDirections=(productId) =>
    axiosInstance.get(`/product/${productId}/directions`);

export const addProductDirection=(productId, directionData) =>
    axiosInstance.post(`/product/${productId}/directions`, directionData);

export const updateProductDirection=(directionId, directionData) =>
    axiosInstance.put(`/product/directions/${directionId}`, directionData);

export const deleteProductDirection=(directionId) =>
    axiosInstance.delete(`/product/directions/${directionId}`);

// Image APIs
export const getProductImages=(productId) =>
    axiosInstance.get(`/product/image/${productId}/images`);

export const getImageById=(imageId) =>
    axiosInstance.get(`/product/image/${imageId}`);

export const uploadProductImages=(productId, formData) =>
    axiosInstance.post(`/product/image/${productId}/images`, formData, {
        headers: {"Content-Type": "multipart/form-data"}
    });

export const deleteAllProductImages=(productId) =>
    axiosInstance.delete(`/product/image/all/${productId}`);

export const deleteSingleProductImage=(imageId) =>
    axiosInstance.delete(`/product/image/${imageId}`);

export const setPrimaryProductImage=(productId, imageId) =>
    axiosInstance.patch(`/product/image/${productId}/images/${imageId}/primary`);
