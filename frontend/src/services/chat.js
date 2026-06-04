import api from './api';

export const sendMessage = async (message) => {
    const res = await api.post('/chat/query', {
        question: message,
    });

    return res.data;
}
