// src/services/DeviceService.js
import { devices as mockDevices } from "../data/MockDevices";

// -----------------------------
// ✅ 현재는 Mock 데이터만 사용
// -----------------------------
const USE_MOCK = true;
const API_BASE = "http://localhost:8080/api/devices"; // 나중에 Spring Boot 연결 주소

// -----------------------------
// 기기 조회
// -----------------------------
export async function fetchDevice(id) {
  if (USE_MOCK) {
    console.log("[Mock] fetchDevice:", id);
    const found = mockDevices.find((d) => d.id === Number(id)) || null;
    return found;
  }

  try {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) throw new Error(`Fetch device failed: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("fetchDevice error:", err.message);
    return null;
  }
}

// -----------------------------
// 기기 제어 (조명, 펌프 등)
// control: { light: { on, brightness, duration }, ... }
// -----------------------------
export async function postDeviceControl(id, control) {
  if (USE_MOCK) {
    console.log("[Mock] postDeviceControl:", id, control);
    // MockDevices 내부 업데이트 반영
    const index = mockDevices.findIndex((d) => d.id === Number(id));
    if (index !== -1) {
      mockDevices[index] = {
        ...mockDevices[index],
        sensors: {
          ...mockDevices[index].sensors,
          ...control,
        },
      };
    }
    return { success: true, id, updated: control };
  }

  try {
    const res = await fetch(`${API_BASE}/${id}/control`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(control),
    });
    if (!res.ok) throw new Error(`Control post failed: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("postDeviceControl error:", err.message);
    return null;
  }
}
