// src/data/plants.js
// -----------------------------
// 식물별 정보 및 권장 조건
// -----------------------------
const plants = {
  tomato: {
    id: "tomato",
    name: "토마토",
    optimalTemp: { min: 18, max: 28 }, // 적정 온도 범위
    image: "/assets/tomato.png",       // public/assets/ 에 이미지 추가 필요
    category: "열매식물",
  },
  strawberry: {
    id: "strawberry",
    name: "딸기",
    optimalTemp: { min: 15, max: 25 },
    image: "/assets/strawberry.png",
    category: "열매식물",
  },
  lettuce: {
    id: "lettuce",
    name: "상추",
    optimalTemp: { min: 15, max: 25 },
    image: "/assets/lettuce.png",
    category: "잎식물",
  },
  spinach: {
    id: "spinach",
    name: "시금치",
    optimalTemp: { min: 10, max: 22 },
    image: "/assets/spinach.png",
    category: "잎식물",
  },
  basil: {
    id: "basil",
    name: "바질",
    optimalTemp: { min: 16, max: 26 },
    image: "/assets/basil.png",
    category: "꽃식물",
  },
  rose: {
    id: "rose",
    name: "장미",
    optimalTemp: { min: 18, max: 26 },
    image: "/assets/rose.png",
    category: "꽃식물",
  },
  aloe: {
    id: "aloe",
    name: "알로에",
    optimalTemp: { min: 12, max: 25 },
    image: "/assets/aloe.png",
    category: "다육&선인장",
  },
  cactus: {
    id: "cactus",
    name: "선인장",
    optimalTemp: { min: 10, max: 35 },
    image: "/assets/cactus.png",
    category: "다육&선인장",
  },
};

// ✅ 유틸: 카테고리별 그룹화 (페이지에서 사용하기 편리)
export const getPlantsByCategory = (category) => {
  return Object.values(plants).filter((plant) => plant.category === category);
};

export default plants;
