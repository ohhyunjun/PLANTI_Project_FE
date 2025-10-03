// ===== MainPage.jsx - 기기 등록 백엔드 연결 =====
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { getPlants, updatePlant, deletePlant } from "../api/plant"; 
import { registerDevice } from "../api/device";

function MainPage() {
  const navigate = useNavigate();
  const [plants, setPlants] = useState([]); 
  const [inputCode, setInputCode] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(false);

  useEffect(() => {
    fetchPlants();
  }, []);
  
  const fetchPlants = async () => {
    try {
      const response = await getPlants();
      setPlants(response.data);
    } catch (error) {
      console.error("식물 목록을 불러오는 데 실패했습니다.", error);
      setPlants([]);
    }
  };

  // Gemini: 기기 등록 함수를 백엔드 API와 연동합니다.
  const addDevice = async () => {
    if (!inputCode.trim()) {
      alert("기기 코드를 입력하세요.");
      return;
    }

    const deviceNickname = prompt("등록할 기기의 별명을 입력해주세요:");
    if (!deviceNickname || !deviceNickname.trim()) {
      alert("기기 별명을 입력해야 합니다.");
      return;
      
    }

    try {
      // 1. 기기 등록 API를 호출합니다.
      await registerDevice(inputCode, deviceNickname);  
      // 2. 기기 등록 성공 시, alert 대신 navigate를 사용하여 식물 등록 페이지로 즉시 이동시킵니다.
      navigate(`/main/device/${inputCode}/nogrow/new`);
      setShowCodeInput(false);
      setInputCode("");
    } catch (error) {
      console.error("기기 등록 실패:", error);
      alert(error.response?.data || "기기 등록에 실패했습니다. 코드를 확인해주세요.");
    }
  };


  // Gemini: 식물 이름 수정 및 삭제 함수 (이전과 동일)
  const editPlantName = async (plantId) => {
    const newName = prompt("새 식물 이름을 입력하세요:");
    if (!newName || newName.trim() === "") return;
    try {
      const response = await updatePlant(plantId, { name: newName });
      setPlants(plants.map(p => (p.id === plantId ? response.data : p)));
      alert("이름이 성공적으로 수정되었습니다.");
    } catch (error) {
      console.error("이름 수정 실패:", error);
      alert("이름 수정에 실패했습니다.");
    }
  };

  const deletePlantAndDevice = async (plantId) => {
    if (!window.confirm("정말 이 식물을 삭제하시겠습니까?")) return;
    try {
      await deletePlant(plantId);
      setPlants(plants.filter(p => p.id !== plantId));
      alert("식물이 삭제되었습니다.");
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제에 실패했습니다.");
    }
  };

  const handleDeviceClick = (plant) => {
    navigate(`/main/device/${plant.id}/manage`);
  };

  return (
    <Layout>
      {/* 상단 기능 버튼 (피그마 스타일 4개 버튼) */}
      <div className="grid grid-cols-2 gap-4 p-4">
        <button
          onClick={() => navigate("/main")}
          className="bg-green-200 rounded-2xl shadow p-6 flex flex-col items-center hover:bg-green-300 transition"
        >
          <img
            src="/assets/icons/farm.png"
            alt="My Farm"
            className="w-12 h-12 mb-2"
          />
          <span className="font-bold">My Farm</span>
        </button>

        <button
          onClick={() => navigate("/main/diary")}
          className="bg-yellow-200 rounded-2xl shadow p-6 flex flex-col items-center hover:bg-yellow-300 transition"
        >
          <img
            src="/assets/icons/diary.png"
            alt="Diary"
            className="w-12 h-12 mb-2"
          />
          <span className="font-bold">Diary</span>
        </button>

        <button
          onClick={() => navigate("/main/aiphoto")}
          className="bg-blue-200 rounded-2xl shadow p-6 flex flex-col items-center hover:bg-blue-300 transition"
        >
          <img
            src="/assets/icons/aiphoto.png"
            alt="AI Photo"
            className="w-12 h-12 mb-2"
          />
          <span className="font-bold">AI Photo</span>
        </button>

        <button
          onClick={() => navigate("/main/community")}
          className="bg-pink-200 rounded-2xl shadow p-6 flex flex-col items-center hover:bg-pink-300 transition"
        >
          <img
            src="/assets/icons/community.png"
            alt="Community"
            className="w-12 h-12 mb-2"
          />
          <span className="font-bold">Community</span>
        </button>
      </div>

      {/* My Farm 섹션 */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold">My Farm</h3>
          {showCodeInput ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="기기 코드를 입력하세요"
                className="border px-2 py-1"
              />
              <button
                onClick={addDevice}
                className="bg-green-400 text-white px-3 py-1 rounded-xl"
              >
                등록
              </button>
              <button
                onClick={() => {
                  setShowCodeInput(false);
                  setInputCode("");
                }}
                className="bg-gray-300 px-3 py-1 rounded-xl"
              >
                취소
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowCodeInput(true)}
              className="bg-green-400 text-white px-3 py-1 rounded-xl"
            >
              + 추가
            </button>
          )}
        </div>

        {/* Gemini: plants state를 기반으로 화면을 렌더링합니다. */}
        {plants.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            <p>등록된 식물이 없습니다.</p>
            <p className="text-sm mt-2">
              '+ 추가' 버튼을 눌러 기기를 먼저 등록한 후,
              <br />
              해당 기기에 식물을 등록해주세요.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {plants.map((plant) => (
              <div
                key={plant.id} // PlantResponseDto의 id (plantId)
                className="flex items-center bg-green-100 p-3 rounded-xl shadow hover:bg-green-200 transition"
              >
                <button
                  onClick={() => handleDeviceClick(plant)}
                  className="flex flex-1 items-center text-left"
                >
                  <img
                    src={"/assets/device.png"}
                    alt="Device"
                    className="w-20 h-20 rounded-lg mr-3 object-cover"
                  />
                  <div>
                    {/* PlantResponseDto의 필드명과 일치시킴 */}
                    <p className="font-bold">{plant.name}</p>
                    <p className="text-sm text-gray-600">
                      기기: {plant.deviceNickname}
                    </p>
                    <p className="text-sm mt-1">
                      🌱 {plant.species} 관리 중
                    </p>
                  </div>
                </button>
                <div className="flex flex-col gap-1 ml-2">
                  <button
                    onClick={() => editPlantName(plant.id)}
                    className="bg-yellow-300 px-2 py-1 rounded text-sm"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => deletePlantAndDevice(plant.id)}
                    className="bg-red-400 text-white px-2 py-1 rounded text-sm"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default MainPage;