import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerDevice } from "../api/device";
import { updatePlant } from "../api/plant";
import apiClient from "../api/apiClient";

function MainPage() {
  const navigate = useNavigate();
  const [devices, setDevices] = useState([]);
  const [inputCode, setInputCode] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(false);

  useEffect(() => {
    fetchDevices();
  }, []);

  // ✅ '식물' 목록이 아닌 '기기' 목록을 가져오는 API를 호출합니다.
  const fetchDevices = async () => {
    try {
      const response = await apiClient.get('/api/devices');
      console.log("기기 목록:", response.data); // 디버깅용 로그
      setDevices(response.data);
    } catch (error) {
      console.error("기기 목록을 불러오는 데 실패했습니다.", error);
      setDevices([]);
    }
  };

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
      await registerDevice(inputCode, deviceNickname);
      alert("기기가 성공적으로 등록되었습니다!");
      setShowCodeInput(false);
      setInputCode("");
      fetchDevices(); // ✅ 기기 등록 성공 후 목록을 즉시 새로고침합니다.
    } catch (error) {
      console.error("기기 등록 실패:", error);
      alert(error.response?.data || "기기 등록에 실패했습니다. 코드를 확인해주세요.");
    }
  };

  const editPlantName = async (device) => {
    if (!device.plant) {
      alert("식물이 등록되지 않았습니다.");
      return;
    }

    const newName = prompt("새 식물 이름을 입력하세요:", device.plant.name);
    if (!newName || newName.trim() === "") return;

    try {
      await updatePlant(device.plant.id, { name: newName });
      alert("이름이 성공적으로 수정되었습니다.");
      fetchDevices();
    } catch (error) {
      console.error("이름 수정 실패:", error);
      alert("이름 수정에 실패했습니다.");
    }
  };

  // ✅ 식물 등록 여부에 따라 적절한 페이지로 이동시킵니다.
  const handleDeviceClick = (device) => {
    if (device.plant) {
      // 식물이 있으면 -> 식물 관리 페이지로 이동
      navigate(`/main/device/${device.serialNumber}/manage`);
    } else {
      // 식물이 없으면 -> 식물 등록 페이지로 이동
      navigate(`/main/device/${device.serialNumber}/nogrow/new`);
    }
  };

  // 참고: 기기 삭제 기능 (소유권 포기)
  const deleteDevice = async (serialNumber) => {
    if (!window.confirm("정말 이 기기를 삭제(소유권 포기)하시겠습니까?\n연결된 식물 정보도 함께 삭제됩니다.")) return;
    try {
      // 소유권 포기 API 호출 (이전 단계에서 '/ownership' 경로를 추가했었다면 수정 필요)
      await apiClient.delete(`/api/devices/${serialNumber}`); 
      setDevices(devices.filter(d => d.serialNumber !== serialNumber));
      alert("기기가 삭제되었습니다.");
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ✅ 수정: Planti 버튼을 상단에 별도 배치 */}
      <div className="p-4">
        <button
          onClick={() => navigate("/main")}
          className="w-full bg-green-500 text-white rounded-2xl shadow-lg p-4 flex items-center justify-center hover:bg-green-600 transition mb-4"
        >
          <span className="text-3xl mr-2">🌱</span>
          <span className="text-xl font-bold">PLANTI</span>
        </button>

        {/* ✅ 수정: 나머지 3개 버튼은 1줄로 배치 */}
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => navigate("/main/diary")}
            className="bg-yellow-200 rounded-2xl shadow p-4 flex flex-col items-center hover:bg-yellow-300 transition"
          >
            <span className="text-3xl mb-1">📔</span>
            <span className="font-bold text-sm">Diary</span>
          </button>

          <button
            onClick={() => navigate("/main/aiphoto")}
            className="bg-blue-200 rounded-2xl shadow p-4 flex flex-col items-center hover:bg-blue-300 transition"
          >
            <span className="text-3xl mb-1">🎨</span>
            <span className="font-bold text-sm">AI Photo</span>
          </button>

          <button
            onClick={() => navigate("/main/community")}
            className="bg-pink-200 rounded-2xl shadow p-4 flex flex-col items-center hover:bg-pink-300 transition"
          >
            <span className="text-3xl mb-1">👥</span>
            <span className="font-bold text-sm">Community</span>
          </button>
        </div>
      </div>

      {/* My Farm 섹션 */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">My Farm</h3>
          {showCodeInput ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="기기 코드를 입력하세요"
                className="border px-2 py-1 rounded"
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

        {devices.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            <p>등록된 기기가 없습니다.</p>
            <p className="text-sm mt-2">
              '+ 추가' 버튼을 눌러 기기를 등록해주세요.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {devices.map((device) => (
              <div
                key={device.serialNumber}
                className="flex items-center bg-green-100 p-3 rounded-xl shadow hover:bg-green-200 transition"
              >
                <button
                  onClick={() => handleDeviceClick(device)}
                  className="flex flex-1 items-center text-left"
                >
                  <div className="w-20 h-20 bg-green-300 rounded-lg mr-3 flex items-center justify-center text-3xl">
                    🌿
                  </div>
                  <div>
                    <p className="font-bold">{device.deviceNickname}</p>
                    <p className="text-xs text-gray-600">
                      시리얼: {device.serialNumber}
                    </p>
                    {device.plant ? (
                      <p className="text-sm mt-1">
                        🌱 {device.plant.name} ({device.plant.species})
                      </p>
                    ) : (
                      <p className="text-sm mt-1 text-orange-600 font-semibold">
                        ⚠️ 식물 미등록 - 클릭하여 등록
                      </p>
                    )}
                  </div>
                </button>
                <div className="flex flex-col gap-1 ml-2">
                  {device.plant && (
                    <button
                      onClick={() => editPlantName(device)}
                      className="bg-yellow-300 px-2 py-1 rounded text-sm"
                    >
                      수정
                    </button>
                  )}
                  <button
                    onClick={() => deleteDevice(device.serialNumber)}
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
    </div>
  );
}

export default MainPage;