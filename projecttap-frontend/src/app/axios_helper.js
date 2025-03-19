import axios from "axios";

axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.headers.post["Content-Type"] = 'application/json';

export const getAuthenticationToken = () => {
    return window.localStorage.getItem("auth_token");
};

export const setAuthenticationToken = (token) => {
    return window.localStorage.setItem("auth_token", token);
};

export const removeAuthenticationToken = () => {
    return window.localStorage.removeItem("auth_token");
};

export const request = (method, url, data) => {
    let headers = {};
    const token = getAuthenticationToken();
    
    if (token && token !== "null") {
        headers["Authorization"] = `Bearer ${token}`;
    }

    // If data is FormData, let axios handle headers (multipart/form-data)
    const isFormData = data instanceof FormData;

    return axios({
        method: method,
        url: url,
        data: data,
        headers: isFormData ? headers : { ...headers, "Content-Type": "application/json" }, // Only set Content-Type for JSON
    });
};


axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // removeAuthenticationToken();
            // window.localStorage.removeItem("loginInfo");

            // window.location.href = `/login?message=${encodeURIComponent("Your authentication token has expired. Please login again!")}`;
        }

        return Promise.reject(error);
    }
);
