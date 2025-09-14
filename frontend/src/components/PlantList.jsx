import React from "react";
import styled from "styled-components";

const ListContainer = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 400px;
  overflow-y: auto;
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const PlantImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 5px;
  margin-right: 15px;
  object-fit: cover;
`;

const PlantList = ({ plants, onSelectPlant }) => {
  return (
    <ListContainer>
      {plants.length > 0 ? (
        plants.map((plant) => (
          <ListItem key={plant.id} onClick={() => onSelectPlant(plant)}>
            <PlantImage src={plant.imageUrl} alt={plant.name} />
            <div>
              <p className="font-bold">{plant.name}</p>
            </div>
          </ListItem>
        ))
      ) : (
        <p className="text-center text-gray-500">선택된 카테고리에 식물이 없습니다.</p>
      )}
    </ListContainer>
  );
};

export default PlantList;