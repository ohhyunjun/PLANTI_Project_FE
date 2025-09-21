// MockPlants.js
import tomatoImg from "../assets/tomato.jpg";  
import strawberryImg from "../assets/strawberry.jpg";
import roseImg from "../assets/rose.jpg";

const plants = {
  tomato: {
    name: "토마토",
    image: tomatoImg,
    optimalTemp: { min: 20, max: 28 }
  },
  strawberry: {
    name: "딸기",
    image: strawberryImg,
    optimalTemp: { min: 18, max: 24 }
  },
  rose: {
    name: "장미",
    image: roseImg,
    optimalTemp: { min: 16, max: 22 }
  }
};

export default plants;
