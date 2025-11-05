import api from './api';

const getAllDrivers = async () => {
  try {
    const response = await api.get('/drivers');
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateDriver = async (id, data) => {
  try {
    const response = await api.put(`/drivers/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getDriverById = async (id) => {
  try {
    const response = await api.get(`/drivers/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  getAllDrivers,
  updateDriver,
  getDriverById,
};