import api from './api';

const getAllRides = async () => {
  try {
    const response = await api.get('/rides');
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getRidesByStatus = async (status) => {
  try {
    const response = await api.get('/rides', {
      params: { status }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateRide = async (rideId, data) => {
  try {
    const response = await api.put(`/rides/${rideId}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  getAllRides,
  getRidesByStatus,
  updateRide,
};