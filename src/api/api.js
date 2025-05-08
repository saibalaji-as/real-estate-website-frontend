import axios from "axios";

// const API_URL = "http://localhost:5001/api";
const API_URL = "https://real-estate-website-backend-sjr7.onrender.com/api";

export const registerUser = async (userData) => {
    return await axios.post(`${API_URL}/auth/register`, userData);
};

export const loginUser = async (userData) => {
    return await axios.post(`${API_URL}/auth/login`, userData);
};

export const getProperties = async (params) => {
    return await axios.get(`${API_URL}/properties`, params);
};
export const getRequests = async (params) => {
    return await axios.get(`${API_URL}/contact/all`, params);
};

export const addProperty = async (propertyData) => {
    return await axios.post(`${API_URL}/properties`, propertyData);
};

export const editProperty = async (id, updatedData) => {
    return await axios.put(`${API_URL}/properties/${id}`, updatedData);
};

export const deleteProperty = async (id) => {
    return await axios.delete(`${API_URL}/properties/${id}`);
};

export const contact = async (data) => {
    return await axios.post(`${API_URL}/contact`, data);
};
