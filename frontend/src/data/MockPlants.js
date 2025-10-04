// MockPlants.js
import tomatoImg from "../assets/tomato.jpg";  
import strawberryImg from "../assets/strawberry.jpg";
import roseImg from "../assets/rose.jpg";

const plants = [
{
id: "tomato",
name: "토마토",
category: "열매식물",
imageUrl: tomatoImg,
description: "영양가 높은 빨간 열매를 맺는 채소",
optimalTemp: { min: 20, max: 28 }
},
{
id: "strawberry",
name: "딸기",
category: "열매식물",
imageUrl: strawberryImg,
description: "달콤한 빨간 과일",
optimalTemp: { min: 18, max: 24 }
},
{
id: "rose",
name: "장미",
category: "꽃식물",
imageUrl: roseImg,
description: "아름다운 향기와 화려한 꽃을 피우는 식물",
optimalTemp: { min: 16, max: 22 }
}
];

export default plants;
