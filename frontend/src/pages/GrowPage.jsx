// src/pages/GrowPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import plants from "../data/plants.js"; // .js 확장자 명시
import { devices as mockDevices } from "../data/MockDevices.js"; // .js 확장자 명시
import { fetchDevice, postDeviceControl } from "../services/DeviceService.js"; // .js 확장자 명시

function GrowPage() {
  const { id } = useParams();
  const deviceId = Number(id);

  const [device, setDevice] = useState(null);
  const pollingRef = useRef(null);

  // ✅ 일차 계산
  const getDayCount = (date) => {
    if (!date) return null;
    const start = new Date(date);
    if (isNaN(start)) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    return Math.floor((today - start) / (1000 * 60 * 60 * 24)) + 1;
  };

  // ✅ 온도 상태 판정
  const getTempStatus = (plant, temp) => {
    if (!plant || temp == null) return "-";
    if (temp < plant.recommended.tempMin) return "❄️ 추움";
    if (temp > plant.recommended.tempMax) return "🔥 더움";
    return "✅ 적정";
  };

  // ✅ 초기 로드 및 폴링
  useEffect(() => {
    let mounted = true;

    const loadDevice = async () => {
      let dev = await fetchDevice(deviceId); // 백엔드 호출
      if (!dev) {
        dev = mockDevices.find((d) => d.id === deviceId); // fallback
      }
      if (mounted) setDevice(dev || null);
    };

    loadDevice();

    // 10초마다 센서/조명 갱신
    pollingRef.current = setInterval(loadDevice, 10000);

    return () => {
      mounted = false;
      clearInterval(pollingRef.current);
    };
  }, [deviceId]);

  if (!device) return <p className="p-4">기기를 찾을 수 없습니다.</p>;

  const plantInfo = device.plant ? plants[device.plant] : null;
  const dayCount = getDayCount(device.plantedAt);

  // ✅ 조명 제어 이벤트
  const handleLightChange = async (key, value) => {
    if (!device.sensors.light) return;
    const updated = {
      ...device,
      sensors: {
        ...device.sensors,
        light: { ...device.sensors.light, [key]: value },
      },
    };
    setDevice(updated);

    // 백엔드 반영
    await postDeviceControl(deviceId, { light: updated.sensors.light });
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-2">
        {plantInfo ? `${plantInfo.name} ${dayCount ?? "-"}일차` : "식물 미등록"}
      </h2>

      {plantInfo && (
        <img
          src={plantInfo.defaultImage || plantInfo.image}
          alt={plantInfo.name}
          className="w-32 h-32 mb-4 object-cover rounded"
        />
      )}

      <div className="space-y-2 mb-4">
        <p>
          🌡️ 온도: {device.sensors.temperature ?? "-"}°C (
          {getTempStatus(plantInfo, device.sensors.temperature)})
        </p>
        <p>💧 습도: {device.sensors.humidity ?? "-"}%</p>
        <p>🌱 토양 수분: {device.sensors.soilMoisture ?? "-"}%</p>
      </div>

      {device.sensors.light && (
        <div className="p-3 border rounded bg-gray-50">
          <h3 className="font-bold mb-2">💡 조명 제어</h3>

          <div className="flex items-center gap-2 mb-2">
            <label>상태:</label>
            <button
              onClick={() =>
                handleLightChange("on", !device.sensors.light.on)
              }
              className={`px-3 py-1 rounded ${
                device.sensors.light.on
                  ? "bg-green-400 text-white"
                  : "bg-gray-300"
              }`}
            >
              {device.sensors.light.on ? "ON" : "OFF"}
            </button>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <label>밝기(1~5):</label>
            <input
              type="range"
              min="1"
              max="5"
              value={device.sensors.light.brightness}
              onChange={(e) =>
                handleLightChange("brightness", Number(e.target.value))
              }
            />
            <span>{device.sensors.light.brightness}</span>
          </div>

          <div className="flex items-center gap-2">
            <label>지속시간(10~18h):</label>
            <input
              type="number"
              min="10"
              max="18"
              value={device.sensors.light.duration}
              onChange={(e) =>
                handleLightChange("duration", Number(e.target.value))
              }
              className="w-16 border px-1"
            />
            <span>시간</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default GrowPage;
