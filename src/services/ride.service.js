import api from './api';

const getAllRides = async () => {
  try {
    const response = await api.get('/rides');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  getAllRides,
};