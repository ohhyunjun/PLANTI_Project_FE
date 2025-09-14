// MockPlants.js
import tomatoImg from "./assets/tomato.jpg";  // ✅ 로컬 이미지 import
import strawberryImg from "./assets/strawberry.jpg";
import roseImg from "./assets/rose.jpg";

export const plants = [
  {
    id: 1,
    name: "방울토마토",
    category: "열매식물",
    imageUrl: tomatoImg   // ✅ 변수로 대입
  },
  {
    id: 2,
    name: "딸기",
    category: "열매식물",
    imageUrl: strawberryImg
  },
  {
    id: 3,
    name: "장미",
    category: "꽃식물",
    imageUrl: roseImg
  },
  {
    id: 4,
    name: "국화",
    category: "꽃식물",
    imageUrl: "https://via.placeholder.com/50/FFD700"
  },
  {
    id: 5,
    name: "선인장",
    category: "다육&선인장 식물",
    imageUrl: "https://via.placeholder.com/50/90EE90"
  },
  {
    id: 6,
    name: "몬스테라",
    category: "잎식물",
    imageUrl: "https://via.placeholder.com/50/3CB371"
  }
];
