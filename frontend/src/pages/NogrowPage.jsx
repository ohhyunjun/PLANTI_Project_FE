import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { devices } from "../data/MockDevices";
import { Plus } from "lucide-react";
import Layout from "../components/Layout";

function NogrowPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const deviceId = Number(id);
  const device = devices.find((d) => d.id === deviceId);

  const handleAddPlant = () => {
    navigate(`/main/device/${deviceId}/nogrow/new`);
  };

  return (
    <div className="p-6 max-w-lg mx-auto text-center">
      <h2 className="text-xl font-bold mb-4">재배 중인 식물이 없습니다</h2>
      <p className="text-gray-600 mb-6">
        이 기기에는 현재 등록된 식물이 없어요. <br />
        새로운 식물을 등록해보세요!
      </p>

      <div className="flex justify-center">
        <button
          onClick={handleAddPlant}
          className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-2xl shadow-md transition"
        >
          
          + 식물 등록하기
        </button>
      </div>
    </div>
  );
}

export default NogrowPage;
