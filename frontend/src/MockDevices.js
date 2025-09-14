// src/mockDevices.js
export const devices = [
  {
    id: 1,
    name: "스마트 화분 1",
    plant: null, // 아직 식물 미등록
    sensors: {
      temperature: null,
      humidity: null,
      soilMoisture: null,
    },
  },
  {
    id: 2,
    name: "스마트 화분 2",
    plant: "토마토",
    sensors: {
      temperature: 24.5,
      humidity: 65,
      soilMoisture: 40,
    },
  },
];
