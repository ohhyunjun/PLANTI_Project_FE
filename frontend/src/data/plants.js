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
    category: "과일류",
  },
  lettuce: {
    id: "lettuce",
    name: "상추",
    optimalTemp: { min: 15, max: 25 },
    image: "/assets/lettuce.png",
    category: "잎채소",
  },
  basil: {
    id: "basil",
    name: "바질",
    optimalTemp: { min: 16, max: 26 },
    image: "/assets/basil.png",
    category: "허브",
  },
};

export default plants;
