import apiClient from './apiClient'; 

export const createPost = (formData) => {
    return apiClient.post('/api/posts', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
};

export const getPosts = () => {
    return apiClient.get('/api/posts');
};

export const getPostById = (postId) => {
    return apiClient.get(`/api/posts/${postId}`);
};

export const updatePost = (postId, postData) => {
    return apiClient.patch(`/api/posts/${postId}`, postData);
};

export const deletePost = (postId) => {
    return apiClient.delete(`/api/posts/${postId}`);
};