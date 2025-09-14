import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { devices } from "../MockDevices";
import PlantSearchModal from "../components/PlantSearchModal";

function NogrowPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRegister = () => {
    const deviceId = Number(id);
    const device = devices.find((d) => d.id === deviceId);

    if (device && selectedPlant) {
      device.plant = selectedPlant.name;
      device.category = selectedPlant.category;
      device.imageUrl = selectedPlant.imageUrl;
      device.sensors = {
        temperature: 25 + Math.floor(Math.random() * 5),
        humidity: 50 + Math.floor(Math.random() * 20),
        soilMoisture: 40 + Math.floor(Math.random() * 20),
      };

      navigate(`/main/device/${deviceId}/manage`);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">새로운 식물 등록</h2>
      <p className="mb-4 text-gray-700">
        이 기기에는 아직 식물이 등록되지 않았습니다. <br />
        아래에서 식물을 찾아 등록해 주세요.
      </p>

      <div className="flex items-center">
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
            ${!selectedPlant ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
        >
          등록하기
        </button>
      </div>

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
  );
}

export default NogrowPage;