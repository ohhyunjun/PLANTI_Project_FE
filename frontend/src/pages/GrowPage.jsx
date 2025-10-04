import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../api/apiClient";

function GrowPage() {
  const { serialNumber } = useParams();
  const [device, setDevice] = useState(null);
  const [plant, setPlant] = useState(null);
  const [sensorData, setSensorData] = useState(null);
  const [ledSettings, setLedSettings] = useState({ 
    intensity: 1, 
    startTime: "00:00", 
    endTime: "00:00" 
  });
  const [isLedOn, setIsLedOn] = useState(false);

  // ✅ 추가: 초기 데이터 로드 (페이지 진입 시 1회만)
  useEffect(() => {
    if (!serialNumber) return;
    loadInitialData();
  }, [serialNumber]);

  // ✅ 추가: 센서 데이터만 주기적으로 갱신
  useEffect(() => {
    if (!serialNumber) return;
    const interval = setInterval(loadSensorData, 10000);
    return () => clearInterval(interval);
  }, [serialNumber]);

  // ✅ 추가: 초기 데이터 로드 (기기, 식물, 센서, LED 모두)
  const loadInitialData = async () => {
    try {
      const deviceRes = await apiClient.get(`/api/devices/${serialNumber}`);
      setDevice(deviceRes.data);

      if (deviceRes.data.plant) {
        const plantRes = await apiClient.get(`/api/plants/${deviceRes.data.plant.id}`);
        setPlant(plantRes.data);
      }

      // 센서 데이터
      const sensorRes = await apiClient.get(`/api/devices/${serialNumber}/sensors`);
      setSensorData(sensorRes.data);

      // LED 설정 (초기 1회만)
      const ledRes = await apiClient.get(`/api/leds/${serialNumber}`);
      console.log("LED 데이터 (초기):", ledRes.data);
      
      setLedSettings({
        intensity: ledRes.data.intensity || 1,
        startTime: ledRes.data.startTime || "00:00",
        endTime: ledRes.data.endTime || "00:00"
      });
      setIsLedOn(ledRes.data.intensity > 0);
      
    } catch (error) {
      console.error("초기 데이터 로드 실패:", error);
    }
  };

  // ✅ 추가: 센서 데이터만 갱신
  const loadSensorData = async () => {
    try {
      const sensorRes = await apiClient.get(`/api/devices/${serialNumber}/sensors`);
      setSensorData(sensorRes.data);
    } catch (error) {
      console.error("센서 데이터 로드 실패:", error);
    }
  };

  const handleLedUpdate = async () => {
    try {
      const payload = {
        intensity: isLedOn ? ledSettings.intensity : 0,
        startTime: ledSettings.startTime,
        endTime: ledSettings.endTime
      };

      console.log("LED 설정 전송:", payload);
      
      const response = await apiClient.put(`/api/leds/${serialNumber}`, payload);
      console.log("응답:", response.data);
      
      alert("LED 설정이 저장되었습니다.");
      // ✅ 수정: LED 설정은 DB에서 다시 불러오지 않음 (사용자가 설정한 값 유지)
    } catch (error) {
      console.error("LED 설정 실패:", error.response?.data || error);
      alert("LED 설정에 실패했습니다: " + (error.response?.data || error.message));
    }
  };

  if (!serialNumber) {
    return <div className="p-4">오류: serialNumber가 없습니다.</div>;
  }

  if (!device || !plant) {
    return <p className="p-4">로딩 중...</p>;
  }

  const dayCount = plant.plantedAt 
    ? Math.floor((new Date() - new Date(plant.plantedAt)) / (1000 * 60 * 60 * 24)) + 1 
    : null;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-2">
        {plant.name} {dayCount ?? "-"}일차
      </h2>

      <div className="space-y-2 mb-6 p-4 bg-gray-100 rounded-lg">
        <p>🌡️ 온도: {sensorData?.temperature?.toFixed(1) ?? "-"}°C</p>
        <p>💧 습도: {sensorData?.humidity?.toFixed(1) ?? "-"}%</p>
      </div>

      <div className="p-4 bg-white rounded-2xl shadow-md border">
        <h3 className="text-lg font-bold mb-4">💡 조명 제어</h3>

        <div className="flex justify-between items-center mb-4">
          <span className="font-medium">상태</span>
          <button
            onClick={() => setIsLedOn(!isLedOn)}
            className={`w-16 py-2 rounded-full text-sm font-semibold transition ${
              isLedOn ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700"
            }`}
          >
            {isLedOn ? "ON" : "OFF"}
          </button>
        </div>

        {isLedOn && (
          <div className="mb-4">
            <label className="block font-medium mb-2">밝기 (1~5단계)</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="5"
                value={ledSettings.intensity}
                onChange={(e) => setLedSettings({...ledSettings, intensity: Number(e.target.value)})}
                className="w-full accent-green-500"
              />
              <span className="w-8 text-center font-semibold">{ledSettings.intensity}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block font-medium mb-2">시작 시간</label>
            <input
              type="time"
              value={ledSettings.startTime}
              onChange={(e) => setLedSettings({...ledSettings, startTime: e.target.value})}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block font-medium mb-2">종료 시간</label>
            <input
              type="time"
              value={ledSettings.endTime}
              onChange={(e) => setLedSettings({...ledSettings, endTime: e.target.value})}
              className="w-full border rounded px-2 py-1"
            />
          </div>
        </div>

        <button
          onClick={handleLedUpdate}
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
        >
          설정 저장
        </button>
      </div>
    </div>
  );
}

export default GrowPage;