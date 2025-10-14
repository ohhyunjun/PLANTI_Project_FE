import apiClient from './apiClient';

// 현재 로그인된 사용자의 모든 알림 목록을 조회합니다.
export const getNotifications = () => {
    return apiClient.get('/api/notices');
};

// 특정 알림을 읽음 처리합니다.
export const markNotificationAsRead = (noticeId) => {
    return apiClient.put(`/api/notices/${noticeId}/read`);
};

// 모든 알림을 읽음 처리합니다.
export const markAllNotificationsAsRead = () => {
    return apiClient.put('/api/notices/read-all');
};

// 특정 알림을 삭제합니다.
export const deleteNotificationById = (noticeId) => {
    return apiClient.delete(`/api/notices/${noticeId}`);
};