import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Bell, Home, Users, Heart } from "lucide-react";
import apiClient from "../api/apiClient";

function GrowPage() {
  const navigate = useNavigate();
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
  const [showLightingTime, setShowLightingTime] = useState(false);
  const [loading, setLoading] = useState(true);
  const [aiAdvice, setAiAdvice] = useState(""); // AI 조언 상태
  const [loadingAdvice, setLoadingAdvice] = useState(false); // AI 조언 로딩 상태

  useEffect(() => {
    if (!serialNumber) return;
    loadInitialData();
  }, [serialNumber]);

  useEffect(() => {
    if (!serialNumber) return;
    const interval = setInterval(loadSensorData, 10000);
    return () => clearInterval(interval);
  }, [serialNumber]);

  // 초기 로드 시에만 AI 조언 가져오기
  useEffect(() => {
    if (serialNumber && !loading && ledSettings.intensity > 0) {
      fetchAiAdvice();
    }
  }, [serialNumber, loading]); // ledSettings 의존성 제거

  const loadInitialData = async () => {
    try {
      const deviceRes = await apiClient.get(`/api/devices/${serialNumber}`);
      setDevice(deviceRes.data);

      if (deviceRes.data.plant) {
        const plantRes = await apiClient.get(`/api/plants/${deviceRes.data.plant.id}`);
        setPlant(plantRes.data);
      }

      const sensorRes = await apiClient.get(`/api/devices/${serialNumber}/sensors`);
      setSensorData(sensorRes.data);

      const ledRes = await apiClient.get(`/api/leds/${serialNumber}`);
      console.log("LED 데이터 (초기):", ledRes.data);
      
      setLedSettings({
        intensity: ledRes.data.intensity || 1,
        startTime: ledRes.data.startTime || "00:00",
        endTime: ledRes.data.endTime || "00:00"
      });
      setIsLedOn(ledRes.data.intensity > 0);
      
      setLoading(false);
    } catch (error) {
      console.error("초기 데이터 로드 실패:", error);
      setLoading(false);
    }
  };

  const loadSensorData = async () => {
    try {
      const sensorRes = await apiClient.get(`/api/devices/${serialNumber}/sensors`);
      setSensorData(sensorRes.data);
    } catch (error) {
      console.error("센서 데이터 로드 실패:", error);
    }
  };

  // AI 조언 가져오기 함수
  const fetchAiAdvice = async () => {
    if (!serialNumber) return;
    
    setLoadingAdvice(true);
    try {
      const response = await apiClient.post('/api/ai/led-advice', {
        serialNumber: serialNumber
      });
      console.log("AI 조언 응답:", response.data);
      console.log("AI 조언 텍스트:", response.data.advice);
      setAiAdvice(response.data.advice);
    } catch (error) {
      console.error("AI 조언 로드 실패:", error);
      setAiAdvice("AI 조언을 불러올 수 없습니다.");
    } finally {
      setLoadingAdvice(false);
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
      
      // LED 설정 저장 후 AI 조언 새로 가져오기
      if (isLedOn && ledSettings.intensity > 0) {
        await fetchAiAdvice();
      }
    } catch (error) {
      console.error("LED 설정 실패:", error.response?.data || error);
      alert("LED 설정에 실패했습니다: " + (error.response?.data || error.message));
    }
  };

  const handleLedPowerToggle = () => {
    setIsLedOn(!isLedOn);
  };

  const handleBrightnessChange = (level) => {
    setLedSettings({...ledSettings, intensity: level});
  };

  const getDaysFromPlanting = () => {
    if (!plant?.plantedAt) return 0;
    const plantedDate = new Date(plant.plantedAt);
    const today = new Date();
    const diffTime = Math.abs(today - plantedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        maxWidth: '412px',
        margin: '0 auto',
        backgroundColor: '#f9fafb',
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: '80px'
      }}>
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          로딩 중...
        </div>
      </div>
    );
  }

  if (!device || !plant) {
    return (
      <div style={{
        minHeight: '100vh',
        maxWidth: '412px',
        margin: '0 auto',
        backgroundColor: '#f9fafb',
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: '80px'
      }}>
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          기기 정보를 불러올 수 없습니다.
        </div>
      </div>
    );
  }

  const styles = {
    container: {
      minHeight: '100vh',
      maxWidth: '412px',
      margin: '0 auto',
      backgroundColor: '#f9fafb',
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: '80px'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px',
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '18px',
      fontWeight: 'bold'
    },
    headerButtons: {
      display: 'flex',
      gap: '8px'
    },
    iconButton: {
      padding: '8px',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      color: '#6b7280',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    content: {
      flex: 1,
      overflowY: 'auto',
      padding: '16px'
    },
    deviceTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '16px',
      textAlign: 'center'
    },
    deviceImage: {
      width: '100%',
      height: '200px',
      backgroundColor: '#e0f2e9',
      borderRadius: '16px',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      position: 'relative'
    },
    deviceImageInner: {
      width: '80%',
      height: '80%',
      background: 'linear-gradient(to bottom, #8B7355 0%, #8B7355 50%, #3D2817 100%)',
      borderRadius: '12px',
      position: 'relative',
      border: '3px solid #D4C5B9'
    },
    plantInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px',
      backgroundColor: 'white',
      borderRadius: '12px',
      marginBottom: '16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    plantIcon: {
      fontSize: '32px'
    },
    sensorSection: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    sensorRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '12px'
    },
    sensorIcon: {
      fontSize: '24px'
    },
    lightingSection: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      transition: 'all 0.3s ease'
    },
    lightingHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      cursor: 'pointer',
      padding: '4px 0',
      marginBottom: '0'
    },
    lightingContent: {
      maxHeight: showLightingTime ? '600px' : '0',
      overflow: 'hidden',
      transition: 'max-height 0.3s ease',
      paddingTop: showLightingTime ? '12px' : '0'
    },
    toggleSwitch: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '16px'
    },
    switch: {
      width: '50px',
      height: '28px',
      backgroundColor: isLedOn ? '#10b981' : '#d1d5db',
      borderRadius: '14px',
      position: 'relative',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      boxShadow: isLedOn ? '0 0 8px rgba(16, 185, 129, 0.4)' : 'none'
    },
    switchButton: {
      width: '24px',
      height: '24px',
      backgroundColor: 'white',
      borderRadius: '12px',
      position: 'absolute',
      top: '2px',
      left: isLedOn ? '24px' : '2px',
      transition: 'left 0.3s ease',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    switchLabel: {
      fontSize: '10px',
      fontWeight: 'bold',
      color: isLedOn ? '#10b981' : '#9ca3af',
      transition: 'color 0.3s ease'
    },
    brightnessButtons: {
      display: 'flex',
      gap: '8px',
      marginBottom: '16px',
      justifyContent: 'space-around'
    },
    brightnessButton: {
      minWidth: '60px',
      padding: '12px 8px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.2s'
    },
    timeInputContainer: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px',
      marginBottom: '16px'
    },
    timeInputWrapper: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px'
    },
    timeLabel: {
      fontSize: '13px',
      fontWeight: '500',
      color: '#374151'
    },
    timeInput: {
      width: '100%',
      padding: '8px 8px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '13px',
      color: '#374151',
      backgroundColor: 'white',
      outline: 'none',
      cursor: 'pointer',
      boxSizing: 'border-box',
      fontFamily: 'inherit'
    },
    saveButton: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    navbar: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
      borderTop: '1px solid #e5e7eb',
      boxShadow: '0 -1px 3px rgba(0,0,0,0.1)'
    },
    navContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: '12px 16px',
      maxWidth: '412px',
      margin: '0 auto'
    },
    navButton: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      minWidth: '60px',
      border: 'none',
      background: 'none',
      cursor: 'pointer'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.logo}>
          <span style={{ fontSize: '24px' }}>🌱</span>
          <span>PLANTI</span>
        </div>
        <div style={styles.headerButtons}>
          <button 
            style={styles.iconButton}
            onClick={() => navigate('/main/setting')}
          >
            <Bell size={24} />
          </button>
          <button style={styles.iconButton}>
            <span style={{ fontSize: '20px' }}>☰</span>
          </button>
        </div>
      </div>

      <div style={styles.content}>
        <h2 style={styles.deviceTitle}>{device.deviceNickname}</h2>

        <div style={styles.deviceImage}>
          <div style={styles.deviceImageInner}>
            <div style={{
              position: 'absolute',
              top: '-10px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '40px'
            }}>🌱</div>
          </div>
        </div>

        <div style={styles.plantInfo}>
          <div style={styles.plantIcon}>🍅</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
              {plant.species || plant.name}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              {getDaysFromPlanting()}일차
            </div>
          </div>
        </div>

        <div style={styles.sensorSection}>
          <div style={styles.sensorRow}>
            <span style={styles.sensorIcon}>🌡️</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '16px', fontWeight: '600' }}>
                온도: {sensorData?.temperature?.toFixed(1) ?? "-"}°C
              </div>
            </div>
          </div>
          <div style={{ ...styles.sensorRow, marginBottom: 0 }}>
            <span style={styles.sensorIcon}>💧</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '16px', fontWeight: '600' }}>
                습도: {sensorData?.humidity?.toFixed(1) ?? "-"}%
              </div>
            </div>
          </div>
        </div>

        <div style={styles.lightingSection}>
          <div 
            style={styles.lightingHeader}
            onClick={() => setShowLightingTime(!showLightingTime)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>💡</span>
              <span style={{ fontWeight: 'bold' }}>조명 시간</span>
            </div>
            <span style={{ fontSize: '18px', color: '#6b7280' }}>
              {showLightingTime ? '▲' : '▶'}
            </span>
          </div>

          <div style={styles.lightingContent}>
            <div style={styles.toggleSwitch}>
              <span style={{ 
                fontSize: '14px', 
                fontWeight: '600',
                color: '#374151',
                minWidth: '45px'
              }}>
                on/off
              </span>
              <div 
                style={styles.switch}
                onClick={handleLedPowerToggle}
              >
                <div style={styles.switchButton}>
                  {isLedOn && (
                    <span style={{ 
                      fontSize: '8px', 
                      fontWeight: 'bold',
                      color: '#10b981' 
                    }}>
                      I
                    </span>
                  )}
                </div>
                <span style={{
                  position: 'absolute',
                  left: isLedOn ? '6px' : 'auto',
                  right: isLedOn ? 'auto' : '6px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  color: 'white',
                  userSelect: 'none'
                }}>
                  {isLedOn ? 'ON' : 'OFF'}
                </span>
              </div>
              <span style={styles.switchLabel}>
                {isLedOn ? 'ON' : 'OFF'}
              </span>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '8px' 
              }}>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>
                  조명 밝기
                </span>
                {isLedOn && (
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#10b981' }}>
                    {ledSettings.intensity}단계
                  </span>
                )}
              </div>
              <div style={styles.brightnessButtons}>
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => handleBrightnessChange(level)}
                    style={{
                      ...styles.brightnessButton,
                      backgroundColor: ledSettings.intensity === level ? '#10b981' : '#f3f4f6',
                      color: ledSettings.intensity === level ? 'white' : '#6b7280'
                    }}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* ✅ 개선된 시간 입력 부분 */}
            <div style={styles.timeInputContainer}>
              <div style={styles.timeInputWrapper}>
                <label style={styles.timeLabel}>시작 시간</label>
                <input
                  type="time"
                  value={ledSettings.startTime}
                  onChange={(e) => setLedSettings({...ledSettings, startTime: e.target.value})}
                  style={styles.timeInput}
                />
              </div>
              <div style={styles.timeInputWrapper}>
                <label style={styles.timeLabel}>종료 시간</label>
                <input
                  type="time"
                  value={ledSettings.endTime}
                  onChange={(e) => setLedSettings({...ledSettings, endTime: e.target.value})}
                  style={styles.timeInput}
                />
              </div>
            </div>

            {/* AI 조언 영역 */}
            {isLedOn && (
              <div style={{ 
                fontSize: '12px', 
                marginTop: '16px',
                marginBottom: '16px',
                minHeight: '20px'
              }}>
                {loadingAdvice ? (
                  <span style={{ color: '#9ca3af' }}>AI 조언을 불러오는 중...</span>
                ) : aiAdvice ? (
                  <div style={{
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '8px',
                    padding: '12px',
                    lineHeight: '1.6'
                  }}>
                    {(() => {
                      // **진단:** 과 **조언:** 형식 처리
                      const diagnosisMatch = aiAdvice.match(/\*\*진단:\*\*\s*(.+?)(?=\*\*조언:\*\*|$)/s);
                      const adviceMatch = aiAdvice.match(/\*\*조언:\*\*\s*(.+?)$/s);
                      
                      if (diagnosisMatch || adviceMatch) {
                        return (
                          <>
                            {diagnosisMatch && (
                              <div style={{ marginBottom: '8px' }}>
                                <div style={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: '6px',
                                  marginBottom: '4px'
                                }}>
                                  <span style={{ fontSize: '16px' }}>🔍</span>
                                  <span style={{ 
                                    fontWeight: 'bold', 
                                    color: '#15803d',
                                    fontSize: '13px'
                                  }}>진단</span>
                                </div>
                                <div style={{ 
                                  color: '#374151',
                                  paddingLeft: '22px',
                                  fontSize: '12px'
                                }}>
                                  {diagnosisMatch[1].trim()}
                                </div>
                              </div>
                            )}
                            {adviceMatch && (
                              <div>
                                <div style={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: '6px',
                                  marginBottom: '4px'
                                }}>
                                  <span style={{ fontSize: '16px' }}>💡</span>
                                  <span style={{ 
                                    fontWeight: 'bold', 
                                    color: '#15803d',
                                    fontSize: '13px'
                                  }}>조언</span>
                                </div>
                                <div style={{ 
                                  color: '#374151',
                                  paddingLeft: '22px',
                                  fontSize: '12px'
                                }}>
                                  {adviceMatch[1].trim()}
                                </div>
                              </div>
                            )}
                          </>
                        );
                      } else {
                        // 포맷이 없는 일반 텍스트는 그대로 표시
                        return (
                          <div style={{ 
                            color: '#374151',
                            fontSize: '12px'
                          }}>
                            {aiAdvice}
                          </div>
                        );
                      }
                    })()}
                  </div>
                ) : (
                  <span style={{ color: '#9ca3af' }}>조명 설정을 분석 중입니다.</span>
                )}
              </div>
            )}

            <button
              onClick={handleLedUpdate}
              style={styles.saveButton}
              onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
            >
              설정 저장
            </button>
          </div>
        </div>
      </div>

      <div style={styles.navbar}>
        <div style={styles.navContainer}>
          <button
            onClick={() => navigate('/main')}
            style={{ ...styles.navButton, color: '#6b7280' }}
          >
            <Home size={24} strokeWidth={2} />
            <span style={{ fontSize: '12px', fontWeight: '500' }}>홈</span>
          </button>
          
          <button
            onClick={() => navigate('/main/community')}
            style={{ ...styles.navButton, color: '#6b7280' }}
          >
            <Users size={24} strokeWidth={2} />
            <span style={{ fontSize: '12px', fontWeight: '500' }}>커뮤니티</span>
          </button>
          
          <button 
            onClick={() => navigate('/community/mypage')}
            style={{ ...styles.navButton, color: '#6b7280' }}>
            <Heart size={24} strokeWidth={2} />
            <span style={{ fontSize: '12px', fontWeight: '500' }}>My Page</span>
          </button>
          
          <button
            onClick={() => navigate('/main/setting')}
            style={{ ...styles.navButton, color: '#10b981' }}
          >
            <Bell size={24} strokeWidth={2} />
            <span style={{ fontSize: '12px', fontWeight: '500' }}>알림</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default GrowPage;