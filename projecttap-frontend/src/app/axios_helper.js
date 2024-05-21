import axios from "axios";

axios.defaults.baseURL = 'http://localhost:8080'
axios.defaults.headers.post["Content-Type"] = 'application/json'

export const getAuthenticationToken = () => {
    return window.localStorage.getItem("auth_token")
}

export const setAuthenticationToken = (token) => {
    return window.localStorage.setItem("auth_token", token) //storing the JWT token in local storage
}

export const request = (method, url, data) => {
    let headers = {};
    if (getAuthenticationToken() !== null && getAuthenticationToken() !== "null"){
        headers = {"Authorization": `Bearer ${getAuthenticationToken()}`};
    }

    return axios({
        method: method,
        headers: headers,
        url: url,
        data: data
    });
};