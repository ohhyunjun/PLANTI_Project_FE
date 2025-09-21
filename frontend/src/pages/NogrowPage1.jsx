// src/pages/NogrowPage1.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { devices } from "../data/MockDevices"; // ⚠️ 현재는 mock, 나중에 백엔드 연동
import PlantSearchModal from "../components/PlantSearchModal";
import Layout from "../components/Layout";

function NogrowPage1() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localDevices, setLocalDevices] = useState([]);

  // ✅ localStorage에서 기기 불러오기
  useEffect(() => {
    const savedDevices = JSON.parse(localStorage.getItem("devices")) || devices;
    setLocalDevices(savedDevices);
  }, []);

  // ✅ 식물 등록 처리
  const handleRegister = () => {
    const deviceId = Number(id);
    const deviceIndex = localDevices.findIndex((d) => d.id === deviceId);

    if (deviceIndex !== -1 && selectedPlant) {
      // 기기 정보 업데이트
      const updatedDevice = {
        ...localDevices[deviceIndex],
        plantId: selectedPlant.id,
        plant: selectedPlant.name,
        category: selectedPlant.category,
        imageUrl: selectedPlant.imageUrl,
        plantedAt: new Date().toISOString(), // ISO format → GrowPage에서 일수 계산
        sensors: {
          temperature: 25 + Math.floor(Math.random() * 5),
          humidity: 50 + Math.floor(Math.random() * 20),
          soilMoisture: 40 + Math.floor(Math.random() * 20),
          light: { on: true, brightness: 3, duration: 12 },
        },
      };

      // local state 업데이트
      const updatedDevices = [...localDevices];
      updatedDevices[deviceIndex] = updatedDevice;
      setLocalDevices(updatedDevices);

      // localStorage 반영
      localStorage.setItem("devices", JSON.stringify(updatedDevices));

      // GrowPage로 이동
      navigate(`/main/device/${deviceId}/manage`);
    } else {
      alert("기기를 찾을 수 없거나 식물이 선택되지 않았습니다.");
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

