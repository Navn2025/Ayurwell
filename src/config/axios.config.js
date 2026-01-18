import axios from 'axios';

const API_BASE_URL=import.meta.env.VITE_API_BASE_URL||'http://localhost:3000/api';

const axiosInstance=axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // 🔑 This enables sending cookies with every request
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout
});

/**
 * REQUEST INTERCEPTOR
 */
axiosInstance.interceptors.request.use(
    (config) =>
    {
        console.log(`📤 [${config.method.toUpperCase()}] ${config.url}`);
        return config;
    },
    (error) =>
    {
        console.error('❌ Request Error:', error.message);
        return Promise.reject(error);
    }
);

/**
 * RESPONSE INTERCEPTOR
 */
axiosInstance.interceptors.response.use(
    (response) =>
    {
        console.log(`✅ Response: ${response.status}`, response.data);
        return response.data; // Return only data, not the whole response
    },
    (error) =>
    {
        if (error.response)
        {
            const {status, data}=error.response;
            console.error(`❌ Response Error [${status}]:`, data?.message||data);

            if (status===401)
            {
                console.error('🔐 Unauthorized - Please login again');
            } else if (status===403)
            {
                console.error('🚫 Forbidden - Access Denied');
            } else if (status===404)
            {
                console.error('🔍 Resource not found');
            } else if (status===400)
            {
                console.error('⚠️ Bad Request - Check your data');
            } else if (status===500)
            {
                console.error('💥 Server Error - Try again later');
            }
        } else if (error.request)
        {
            console.error('❌ No Response from Server:', error.message);
        } else
        {
            console.error('❌ Request Setup Error:', error.message);
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;