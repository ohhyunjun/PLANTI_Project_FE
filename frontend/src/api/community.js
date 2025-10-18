import apiClient from './apiClient'; 

/**
 * FormData 변환을 API 함수에서 처리
 */
export const createPost = (postData) => {
    const formData = new FormData();
    
    // JSON 데이터를 Blob으로 변환
    formData.append('postData', new Blob([JSON.stringify({
        title: postData.title,
        content: postData.content
    })], { type: 'application/json' }));
    
    // 이미지 파일 추가
    if (postData.file) {
        formData.append('file', postData.file);
    }
    
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

// 게시글 수정 - 파일 업로드 지원 추가
export const updatePost = (postId, postData) => {
    const formData = new FormData();
    
    // JSON 데이터를 Blob으로 변환
    formData.append('postData', new Blob([JSON.stringify({
        title: postData.title,
        content: postData.content
    })], { type: 'application/json' }));
    
    // 새 이미지 파일이 있으면 추가
    if (postData.file) {
        formData.append('file', postData.file);
    }
    
    // 파일 삭제 플래그 (기존 파일을 삭제하고 싶을 때)
    if (postData.deleteFile) {
        formData.append('deleteFile', 'true');
    }
    
    return apiClient.put(`/api/posts/${postId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
};

export const deletePost = (postId) => {
    return apiClient.delete(`/api/posts/${postId}`);
};

export const createComment = (postId, commentData) => {
    return apiClient.post(`/api/posts/${postId}/comments`, commentData);
};