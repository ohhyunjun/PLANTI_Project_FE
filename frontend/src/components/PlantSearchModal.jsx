import React, { useState } from "react";
import { plants } from "../MockPlants";
import styled from "styled-components";
import PlantList from "./PlantList";

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  position: relative;
`;

const CategoriesContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  overflow-x: auto;
`;

const CategoryButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background-color: ${(props) => (props.active ? "#4CAF50" : "#f0f0f0")};
  color: ${(props) => (props.active ? "white" : "black")};
  cursor: pointer;
  white-space: nowrap;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

const categories = ["꽃식물", "열매식물", "다육&선인장 식물", "잎식물"];

const PlantSearchModal = ({ onSelectPlant, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState("꽃식물");
  const filteredPlants = plants.filter(plant => plant.category === selectedCategory);

  return (
    <ModalBackground onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <h2 className="text-xl font-bold mb-4">키우실 식물을 선택해주세요</h2>
        <CategoriesContainer>
          {categories.map(category => (
            <CategoryButton
              key={category}
              type="button"
              active={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </CategoryButton>
          ))}
        </CategoriesContainer>
        <PlantList plants={filteredPlants} onSelectPlant={onSelectPlant} />
      </ModalContent>
    </ModalBackground>
  );
};

export default PlantSearchModal;