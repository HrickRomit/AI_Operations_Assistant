import api from './api';

export const registerUser = async (email, password, businessName) => {
  const response = await api.post('/auth/register', {
    email,
    password,
    business_name: businessName,
  });
  return response.data;
};

export const loginUser = async (email, password) => {
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);

  const response = await api.post('/auth/login', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data;
};

export const fetchCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};
