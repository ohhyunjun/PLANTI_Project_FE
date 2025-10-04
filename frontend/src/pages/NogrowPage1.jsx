// src/pages/NogrowPage1.jsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PlantSearchModal from "../components/PlantSearchModal";
import Layout from "../components/Layout";
import { createPlant } from "../api/plant";

function NogrowPage1() {
  const { id: serialNumber } = useParams();
  const navigate = useNavigate();
  const [selectedPlant, setSelectedPlant] = useState(null); // 사용자가 '식물 찾기'로 선택한 식물 품종 정보
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 식물 등록 처리 함수를 백엔드 API와 연동합니다.
  const handleRegister = async () => {
    if (!selectedPlant) {
      alert("먼저 등록할 식물을 찾아 선택해주세요.");
      return;
    }

    const plantName = prompt(`'${selectedPlant.name}'의 애칭을 지어주세요:`);
    if (!plantName || !plantName.trim()) {
      alert("식물의 애칭을 입력해야 합니다.");
      return;
    }

    // PlantRequestDto 형식에 맞춰 백엔드로 보낼 데이터를 구성합니다.
    const plantData = {
      name: plantName,               // 사용자가 입력한 식물 애칭
      species: selectedPlant.name,   // 찾기에서 선택한 식물 품종
      plantedAt: new Date().toISOString(), // 심은 날짜는 현재 시간으로 설정
      stage: 'SEED',                 // 초기 단계는 'SEED'로 고정
      serialNumber: serialNumber     // URL 파라미터에서 가져온 기기 시리얼 번호
    };

    try {
      // API 함수를 호출하여 식물을 생성합니다.
      await createPlant(plantData);
      alert(`'${plantName}'이(가) 성공적으로 등록되었습니다!`);
      // 등록 성공 후, 해당 식물의 관리 페이지로 이동합니다.
      // plantId를 백엔드에서 반환받아 사용해야 하지만, 우선 메인 페이지로 이동하여 리프레시되도록 합니다.
      navigate(`/main`);
    } catch (error) {
      console.error("식물 등록 실패:", error);
      alert(error.response?.data || "식물 등록에 실패했습니다.");
    }
  };


  return (
    <Layout>
      <div className="p-6 max-w-lg mx-auto">
        <h2 className="text-xl font-bold mb-4">🌱 새로운 식물 등록</h2>
        <p className="mb-4 text-gray-700">
          이 기기에는 아직 식물이 등록되지 않았습니다. <br />
          아래에서 식물을 찾아 등록해 주세요.
        </p>

        {/* 선택 영역 + 등록 버튼 */}
        <div className="flex items-center mb-4">
          <div
            className="flex-1 border p-2 rounded cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            {/* 사용자가 식물을 선택하면 해당 식물 이름(품종)이 여기에 표시됩니다. */}
            {selectedPlant ? selectedPlant.name : "식물 찾기"}
          </div>
          <button
            onClick={handleRegister}
            disabled={!selectedPlant}
            className={`ml-2 px-4 py-2 text-white rounded 
              ${
                !selectedPlant
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
          >
            등록하기
          </button>
        </div>

        {/* 모달 */}
        {isModalOpen && (
          <PlantSearchModal
            onSelectPlant={(plant) => {
              setSelectedPlant(plant);
              setIsModalOpen(false);
            }}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </Layout>
  );
}

export default NogrowPage1;

