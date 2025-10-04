import apiClient from './apiClient';

//현재 로그인된 사용자의 모든 식물 목록을 조회합니다
export const getPlants = () => {
    return apiClient.get('/api/plants');
};

//특정 식물의 상세 정보를 조회합니다.
export const getPlantById = (plantId) => {
    return apiClient.get(`/api/plants/${plantId}`);
};

//식물 정보를 수정합니다. (부분 업데이트)
export const updatePlant = (plantId, plantData) => {
    return apiClient.patch(`/api/plants/${plantId}`, plantData);
};
//특정 식물을 삭제합니다.
export const deletePlant = (plantId) => {
    return apiClient.delete(`/api/plants/${plantId}`);
};

//새 식물을 생성하여 특정 기기에 등록
export const createPlant = (plantData) => {
    return apiClient.post('/api/plants', plantData);
};