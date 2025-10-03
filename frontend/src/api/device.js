import apiClient from './apiClient';

//시리얼 번호와 닉네임을 사용하여 새 기기를 현재 로그인한 사용자에게 등록합니다.
export const registerDevice = (serialNumber, deviceNickname) => {
    const payload = {
        serialNumber,
        deviceNickname
    };
    return apiClient.post('/api/devices/register', payload);
};