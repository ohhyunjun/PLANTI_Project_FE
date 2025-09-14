import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { devices } from "../MockDevices.js";   // ✅ 상대 경로로 수정

function GrowPage() {
  const { id } = useParams();
  const deviceId = Number(id);
  const [device, setDevice] = useState(null);

  useEffect(() => {
    const foundDevice = devices.find((d) => d.id === deviceId);
    if (foundDevice) {
      setDevice(foundDevice);
    }
  }, [deviceId]);

  useEffect(() => {
    if (!device) return;
    const interval = setInterval(() => {
      setDevice((prev) => ({
        ...prev,
        sensors: {
          temperature: 20 + Math.floor(Math.random() * 10),
          humidity: 40 + Math.floor(Math.random() * 30),
          soilMoisture: 30 + Math.floor(Math.random() * 40),
        },
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, [device]);

  if (!device) {
    return <div className="p-6">해당 기기를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">{device.plant} 관리 페이지</h2>
      <p className="mb-2">기기 이름: {device.name}</p>
      <div className="bg-gray-100 p-4 rounded-lg">
        <p>🌡 온도: {device.sensors?.temperature}°C</p>
        <p>💧 습도: {device.sensors?.humidity}%</p>
        <p>🌱 토양 수분: {device.sensors?.soilMoisture}%</p>
      </div>
    </div>
  );
}

export default GrowPage;
