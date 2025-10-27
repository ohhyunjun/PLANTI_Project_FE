import apiClient from './apiClient';

// 특정 식물의 다이어리 만들기
export const createDiary = (plantId, diaryData) => {
    return apiClient.post(`/api/plants/${plantId}/diaries`, diaryData);
};

// 전체 다이어리 불러오기
export const getAllDiaries = () => {
    return apiClient.get('/api/diaries');
};

// 특정 날짜의 다이어리 목록 불러오기
export const getDiariesByDate = (date) => {
    return apiClient.get('/api/diaries/by-date', {
        params: { date }
    });
};

// 특정 식물의 특정 다이어리 수정하기 - 계층적 URL로 변경
export const updateDiary = (plantId, diaryId, diaryData) => {
    return apiClient.put(`/api/plants/${plantId}/diaries/${diaryId}`, diaryData);
};

// 특정 식물의 특정 다이어리 삭제하기 - 계층적 URL로 변경
export const deleteDiary = (plantId, diaryId) => {
    return apiClient.delete(`/api/plants/${plantId}/diaries/${diaryId}`);
};