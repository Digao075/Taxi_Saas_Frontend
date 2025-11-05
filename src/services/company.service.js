import api from './api';

const getAllCompanies = async () => {
  try {
    const response = await api.get('/companies');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  getAllCompanies,
};