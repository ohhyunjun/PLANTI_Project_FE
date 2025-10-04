import React from "react";
import styled from "styled-components";

// 식물 목록 전체를 감싸는 컨테이너
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

// 목록의 각 항목
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

// 식물 이미지
const PlantImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 5px;
  margin-right: 15px;
  object-fit: cover;
`;

// 이미지 로딩 실패 시 보여줄 대체 아이콘
const PlantIconFallback = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 5px;
  margin-right: 15px;
  background-color: #e8f5e9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;

const PlantList = ({ plants, onSelectPlant }) => {
  // 이미지 로드에 실패했을 때 실행될 함수
  const handleImageError = (e) => {
    // 현재 이미지(e.target)를 숨깁니다.
    e.target.style.display = 'none';
    // 바로 다음에 오는 형제 요소(대체 아이콘)를 보여줍니다.
    e.target.nextSibling.style.display = 'flex';
  };

  return (
    <ListContainer>
      {plants.length > 0 ? (
        plants.map((plant) => (
          <ListItem key={plant.id} onClick={() => onSelectPlant(plant)}>
            {/* - onError 이벤트 핸들러를 추가하여 이미지 로딩 실패를 감지합니다.
              - 실패 시 handleImageError 함수가 실행됩니다.
            */}
            <PlantImage
              src={plant.imageUrl}
              alt={plant.name}
              onError={handleImageError}
            />
            {/* - 평소에는 숨겨져 있다가(display: 'none'), 
              - 이미지가 실패했을 때만 보이게 될 대체 아이콘입니다.
            */}
            <PlantIconFallback style={{ display: 'none' }}>
              🌱
            </PlantIconFallback>
            
            <div>
              <p className="font-bold">{plant.name}</p>
              {plant.description && (
                <p className="text-sm text-gray-600">{plant.description}</p>
              )}
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