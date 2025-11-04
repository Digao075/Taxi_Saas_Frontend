import api from './api';


const adminLogin = async (email, password) => {
  try {
    const response = await api.post('/auth/admin/login', {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  adminLogin,
};