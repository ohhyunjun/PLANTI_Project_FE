import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function MainPage() {
  const navigate = useNavigate();
  const [devices, setDevices] = useState([]);
  const [inputCode, setInputCode] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState("");

  // ✅ 실제 발급된 기기 코드 목록 (예시)
  const validCodes = ["CODE-1234", "CODE-5678", "CODE-9999"];

  // 기기 등록
  const addDevice = () => {
    if (!validCodes.includes(inputCode)) {
      alert("코드가 올바르지 않습니다. 다시 입력하세요.");
      return;
    }

    const newDevice = {
      id: Date.now(),
      name: "새 기기",
      code: inputCode,
      image: "https://via.placeholder.com/100?text=Device",
    };

    setDevices([...devices, newDevice]);
    setInputCode(""); // 입력창 초기화
    setShowCodeInput(false); // 등록 후 입력창 닫기
  };

  // 기기 이름 저장
  const saveDeviceName = (id) => {
    if (newName.trim() === "") return;

    setDevices(
      devices.map((d) => (d.id === id ? { ...d, name: newName } : d))
    );
    setEditingId(null);
    setNewName("");
  };

  // 기기 삭제
  const removeDevice = (id) => {
    setDevices(devices.filter((d) => d.id !== id));
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

      {/* 광고/이벤트 배너 */}
      <div className="p-4">
        <div className="bg-green-200 rounded-xl h-32 flex items-center justify-center">
          <span className="text-lg font-semibold">[이벤트 / 광고 배너]</span>
        </div>
      </div>

      {/* 메뉴 버튼 */}
      <div className="grid grid-cols-5 gap-2 p-4">
        <button onClick={() => navigate("/main")} className="p-2 bg-green-300 rounded-xl">My Farm</button>
        <button onClick={() => navigate("/main/diary")} className="p-2 bg-green-300 rounded-xl">Diary</button>
        <button onClick={() => navigate("/main/aiphoto")} className="p-2 bg-green-300 rounded-xl">AI Photo</button>
        <button onClick={() => navigate("/main/community")} className="p-2 bg-green-300 rounded-xl">Community</button>
        <button onClick={() => navigate("/main/kits")} className="p-2 bg-green-300 rounded-xl">Kits</button>
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
          <div className="flex flex-col gap-3">
            {devices.map((device) => (
              <div key={device.id} className="flex items-center bg-green-100 p-3 rounded-xl shadow">
                <img src={device.image} alt="Device" className="w-16 h-16 rounded-lg mr-3" />
                <div className="flex-1">
                  {editingId === device.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="새 이름 입력"
                        className="border px-2 py-1"
                      />
                      <button
                        onClick={() => saveDeviceName(device.id)}
                        className="bg-green-500 text-white px-2 py-1 rounded"
                      >
                        확인
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="font-bold">{device.name}</p>
                      <p className="text-sm text-gray-600">코드: {device.code}</p>
                      <button
                        onClick={() => {
                          setEditingId(device.id);
                          setNewName(device.name);
                        }}
                        className="mt-1 bg-yellow-400 text-white px-2 py-1 rounded"
                      >
                        이름 변경
                      </button>
                    </>
                  )}
                </div>
                <button
                  onClick={() => removeDevice(device.id)}
                  className="ml-3 text-red-500 font-bold"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 하단 고정 네비게이션 바 */}
      <div className="flex justify-around items-center p-4 bg-green-100 shadow">
        <button onClick={() => navigate("/main")}>🏠 홈</button>
        <button onClick={() => navigate("/main/setting")}>👤 내정보</button>
      </div>
    </div>
  );
}

export default MainPage;
