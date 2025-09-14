import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function MainPage() {
  const navigate = useNavigate();
  const [devices, setDevices] = useState([]);
  const [inputCode, setInputCode] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(false);

  // ✅ 실제 발급된 기기 코드 목록 (예시)
  const validCodes = ["CODE-1234", "CODE-5678", "CODE-9999"];

  // ✅ 앱 시작할 때 localStorage에서 불러오기
  useEffect(() => {
    const savedDevices = localStorage.getItem("devices");
    if (savedDevices) {
      setDevices(JSON.parse(savedDevices));
    }
  }, []);

  // ✅ devices가 바뀔 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem("devices", JSON.stringify(devices));
  }, [devices]);

  // 기기 등록
  const addDevice = () => {
    if (!validCodes.includes(inputCode)) {
      alert("코드가 올바르지 않습니다. 다시 입력하세요.");
      return;
    }

    const newDevice = {
      id: Date.now(),
      name: "내 스마트 화분",
      code: inputCode,
      image: "/assets/device.png", // ✅ public/assets에 이미지 넣어야 함
      plant: null,
    };

    setDevices([...devices, newDevice]);
    setInputCode("");
    setShowCodeInput(false);
  };

  // 기기 이름 수정
  const editDeviceName = (id) => {
    const newName = prompt("새 기기 이름을 입력하세요:");
    if (!newName) return;
    setDevices(
      devices.map((device) =>
        device.id === id ? { ...device, name: newName } : device
      )
    );
  };

  // 기기 삭제
  const deleteDevice = (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    setDevices(devices.filter((device) => device.id !== id));
  };

  // 기기 클릭 시 페이지 이동
  const handleDeviceClick = (device) => {
    if (!device.plant) {
      navigate(`/main/device/:id/nogrow`);
    } else {
      navigate(`/main/device/:id/manage`);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* 상단 바 */}
      <div className="flex items-center justify-between p-4 bg-green-100 shadow">
        <button onClick={() => navigate("/main")}>🏠 Home</button>
        <div className="flex items-center gap-4">
          <button>🔔</button>
          <button onClick={() => navigate("/main/setting")}>☰</button>
        </div>
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

        {devices.length === 0 ? (
          <p className="text-gray-500">등록된 기기가 없습니다.</p>
        ) : (
          <div className="grid gap-3">
            {devices.map((device) => (
              <div
                key={device.id}
                className="flex items-center bg-green-100 p-3 rounded-xl shadow hover:bg-green-200 transition"
              >
                <button
                  onClick={() => handleDeviceClick(device)}
                  className="flex flex-1 items-center text-left"
                >
                  <img
                    src={device.image}
                    alt="Device"
                    className="w-20 h-20 rounded-lg mr-3 object-cover"
                  />
                  <div>
                    <p className="font-bold">{device.name}</p>
                    <p className="text-sm text-gray-600">코드: {device.code}</p>
                    <p className="text-sm mt-1">
                      {device.plant
                        ? `🌱 ${device.plant} 관리 중`
                        : "❌ 식물 미등록"}
                    </p>
                  </div>
                </button>
                <div className="flex flex-col gap-1 ml-2">
                  <button
                    onClick={() => editDeviceName(device.id)}
                    className="bg-yellow-300 px-2 py-1 rounded text-sm"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => deleteDevice(device.id)}
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

      {/* 하단 네비 */}
      <div className="flex justify-around items-center p-4 bg-green-100 shadow">
        <button onClick={() => navigate("/main")}>🏠 홈</button>
        <button onClick={() => navigate("/main/setting")}>👤 내정보</button>
      </div>
    </div>
  );
}

export default MainPage;
