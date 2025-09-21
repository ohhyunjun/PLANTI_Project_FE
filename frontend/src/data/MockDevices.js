// src/data/MockDevices.js
// -----------------------------
// Mock 기기 데이터 (로컬 테스트용)
// -----------------------------
export const devices = [
  {
    id: 1,
    name: "스마트 화분 1",
    plant: null, // 아직 식물 미등록
    plantedAt: null,
    sensors: {
      temperature: null,
      humidity: null,
      soil: null, // GrowPage.jsx에서 soil 필드 사용
      light: { on: false, brightness: 0, duration: 0 },
    },
  },
  {
    id: 2,
    name: "스마트 화분 2",
    plant: "tomato", // GrowPage.jsx의 plants["tomato"]와 연결
    plantedAt: "2025-09-15", // 일차 계산용
    sensors: {
      temperature: 24.5,
      humidity: 65,
      soil: 40,
      light: { on: true, brightness: 3, duration: 12 },
    },
  },
  {
    id: 3,
    name: "스마트 화분 3",
    plant: "lettuce",
    plantedAt: "2025-09-18",
    sensors: {
      temperature: 22,
      humidity: 55,
      soil: 50,
      light: { on: false, brightness: 2, duration: 10 },
    },
  },
];
