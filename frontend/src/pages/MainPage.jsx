// src/pages/MainPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Home, Users, Heart, Pencil, Trash2, X } from "lucide-react";
import { registerDevice } from "../api/device";
import { updatePlant } from "../api/plant";
import { getUnreadCount } from "../api/notification";
import apiClient from "../api/apiClient";
import seedPotImage from "../assets/seed_pot.png";
import deleteBtnImage from "../assets/deleteBtn.png";
import logoImage from "../assets/logo.png"; // 로고 이미지 import 추가

// 식물 성장 단계별 이미지 import (tomato 폴더 내)
import germinationTomato from "../assets/tomato/GERMINATION_tomato.png";
import matureTomato from "../assets/tomato/MATURE_tomato.png";
import fruitTomato from "../assets/tomato/FRUIT_tomato.png";

import germinationLettuce from "../assets/lettuce/GERMINATION_lettuce.png";
import matureLettuce from "../assets/lettuce/MATURE_lettuce.png";

// Pretendard 폰트 추가
const fontStyles = `
@font-face {
    font-family: 'Pretendard';
    src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Thin.woff') format('woff');
    font-weight: 100;
    font-display: swap;
}

@font-face {
    font-family: 'Pretendard';
    src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-ExtraLight.woff') format('woff');
    font-weight: 200;
    font-display: swap;
}

@font-face {
    font-family: 'Pretendard';
    src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Light.woff') format('woff');
    font-weight: 300;
    font-display: swap;
}

@font-face {
    font-family: 'Pretendard';
    src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
    font-weight: 400;
    font-display: swap;
}

@font-face {
    font-family: 'Pretendard';
    src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Medium.woff') format('woff');
    font-weight: 500;
    font-display: swap;
}

@font-face {
    font-family: 'Pretendard';
    src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-SemiBold.woff') format('woff');
    font-weight: 600;
    font-display: swap;
}

@font-face {
    font-family: 'Pretendard';
    src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Bold.woff') format('woff');
    font-weight: 700;
    font-display: swap;
}

@font-face {
    font-family: 'Pretendard';
    src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-ExtraBold.woff') format('woff');
    font-weight: 800;
    font-display: swap;
}

@font-face {
    font-family: 'Pretendard';
    src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Black.woff') format('woff');
    font-weight: 900;
    font-display: swap;
}

/* 스크롤바 스타일 */
.feature-scroll::-webkit-scrollbar {
  height: 3px;
}

.feature-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.feature-scroll::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 10px;
}

.feature-scroll::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* 기능 버튼 hover 효과 */
.feature-button {
  background-color: white;
  transition: background-color 0.2s;
}

.feature-button:hover {
  background-color: #D1FAE5;
}

* {
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
}
`;

function MainPage() {
  const navigate = useNavigate();
  const [devices, setDevices] = useState([]);
  const [inputCode, setInputCode] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // 광고 배너 설정 (이미지 경로와 링크 URL을 여기서 수정하세요)
  const adBanner = {
    imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&h=400&fit=crop',
    linkUrl: 'https://www.naver.com',
    altText: '네이버 식물 광고'
  };

  // 식물 성장 단계에 따른 이미지 반환 함수
  const getPlantImage = (plant) => {
    if (!plant) return seedPotImage;
    
    const stage = plant.plantStage;
    const species = plant.species?.toLowerCase() || '';
    
    switch (stage) {
      case 'SEED':
        return seedPotImage;
      case 'GERMINATION':
        if (species.includes('tomato') || species.includes('토마토')) {
          return germinationTomato;
        }
        if (species.includes('lettuce') || species.includes('상추')) {
          return germinationLettuce;
        }
        return seedPotImage;
      case 'MATURE':
        if (species.includes('tomato') || species.includes('토마토')) {
          return matureTomato;
        }
        if (species.includes('lettuce') || species.includes('상추')) {
          return matureLettuce;
        }
        return seedPotImage;
      case 'FRUIT':
        if (species.includes('tomato') || species.includes('토마토')) {
          return fruitTomato;
        }
        return seedPotImage;
      default:
        return seedPotImage;
    }
  };

  // 읽지 않은 알림 개수 조회
  const fetchUnreadCount = async () => {
    try {
      const response = await getUnreadCount();
      setUnreadCount(response.data.unreadCount || 0);
    } catch (error) {
      console.error("알림 개수 조회 실패:", error);
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    fetchDevices();
    fetchUnreadCount();
    
    // 30초마다 알림 개수 업데이트
    const intervalId = setInterval(() => {
      fetchUnreadCount();
    }, 30000);
    
    // 스타일 태그 추가
    const styleElement = document.createElement('style');
    styleElement.innerHTML = fontStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      clearInterval(intervalId);
      document.head.removeChild(styleElement);
    };
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await apiClient.get('/api/devices');
      console.log("기기 목록:", response.data);
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
      fetchDevices();
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

  const handleDeviceClick = (device) => {
    if (device.plant) {
      navigate(`/main/device/${device.serialNumber}/manage`);
    } else {
      navigate(`/main/device/${device.serialNumber}/nogrow/new`);
    }
  };

  const deleteDevice = async (serialNumber) => {
    if (!window.confirm(
      "정말 이 기기의 연결을 해제하시겠습니까?\n" +
      "• 기기와의 연결만 해제되며, 기기 자체는 삭제되지 않습니다.\n" +
      "• 연결된 식물 정보는 삭제됩니다.\n" +
      "• 다른 사용자가 이 기기를 다시 등록할 수 있습니다."
    )) return;
    
    try {
      await apiClient.delete(`/api/devices/${serialNumber}`);
      alert("기기 연결이 해제되었습니다.");
      fetchDevices();
    } catch (error) {
      console.error("기기 삭제 실패:", error);
      alert("기기 삭제에 실패했습니다.");
    }
  };

  const handleAdBannerClick = () => {
    window.open(adBanner.linkUrl, '_blank');
  };

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
      backgroundColor: 'white',
      padding: '16px',
      borderBottomLeftRadius: '20px',
      borderBottomRightRadius: '20px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      height: '42px'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#374151'
    },
    topSection: {
      padding: '16px',
      paddingBottom: '0px'
    },
    adBannerSection: {
      position: 'relative',
      width: '100%',
      height: '180px',
      borderRadius: '16px',
      overflow: 'hidden',
      marginBottom: '16px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      cursor: 'pointer',
      backgroundColor: '#e0f2e9',
      transition: 'transform 0.2s, box-shadow 0.2s'
    },
    adBannerImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    adBannerPlaceholder: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#1b824eff',
      color: '#4ade80',
      fontSize: '16px',
      fontWeight: '600'
    },
    featureButtonRow: {
      display: 'flex',
      gap: '12px',
      paddingBottom: '8px'
    },
    featureButton: {
      flex: 1,
      borderRadius: '12px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      padding: '12px 16px',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      border: 'none',
      cursor: 'pointer'
    },
    farmSection: {
      flex: 1,
      overflowY: 'auto',
      padding: '16px',
      paddingTop: '0px',
      margin: '16px',
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    farmHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px',
      borderBottom: '1px solid #d1d5db'
    },
    input: {
      border: '1px solid #d1d5db',
      padding: '8px',
      borderRadius: '8px',
      fontSize: '14px',
      width: '100px',
      flex: 'none'
    },
    addButton: {
      backgroundColor: '#0D986A',
      color: 'white',
      padding: '10px 16px',
      borderRadius: '12px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: '600'
    },
    cancelButton: {
      backgroundColor: '#d1d5db',
      padding: '10px 16px',
      borderRadius: '12px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: '600'
    },
    deviceCard: {
      backgroundColor: '#F9F9F9',
      borderRadius: '12px',
      marginBottom: '12px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      transition: 'background-color 0.2s',
      position: 'relative'
    },
    deviceIcon: {
      width: '60px',
      height: '60px',
      borderRadius: '8px',
      marginRight: '12px',
      marginLeft: '12px',
      marginTop: '12px',
      marginBottom: '12px'
    },
    editButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '4px'
    },
    deleteButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '8px',
      marginRight: '8px',
      width: '40px',
      height: '40px'
    },
    navbar: {
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      maxWidth: '412px',
      width: '100%',
      height: '80px',
      backgroundColor: 'white',
      boxShadow: '0 -4px 6px rgba(0,0,0,0.1)',
      zIndex: 100
    },
    navContainer: {
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      height: '100%',
      padding: '0'
    },
    navButton: {
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      padding: '8px 16px',
      transition: 'color 0.2s',
      position: 'relative'
    },
    notificationBadge: {
      position: 'absolute',
      top: '4px',
      right: '10px',
      width: '12px',
      height: '12px',
      backgroundColor: '#0D986A',
      borderRadius: '50%',
      border: '2px solid white'
    }
  };

  return (
    <div style={styles.container}>
      <style>{fontStyles}</style>
      <div style={styles.header}>
        <div style={styles.logo}>
          <img 
            src={logoImage} 
            alt="PLANTI Logo" 
            style={{ width: '28px', height: '28px', objectFit: 'contain' }} 
          />
          <span>PLANTI</span>
        </div>
      </div>
      
      {/* 하단 네비게이션 바 */}
      <div style={styles.navbar}>
        <div style={styles.navContainer}>
          <button
            onClick={() => navigate('/main')}
            style={{ ...styles.navButton, color: '#10b981' }}
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
            <span style={{ fontSize: '12px', fontWeight: '500' }}>마이페이지</span>
          </button>
          
          <button
            onClick={() => navigate('/main/setting')}
            style={{ ...styles.navButton, color: '#6b7280' }}
          >
            <Bell size={24} strokeWidth={2} />
            {unreadCount > 0 && (
              <div style={styles.notificationBadge}></div>
            )}
            <span style={{ fontSize: '12px', fontWeight: '500' }}>알림</span>
          </button>
        </div>
      </div>
      
      <div style={styles.topSection}>
        {/* 광고 배너 */}
        <div 
          style={styles.adBannerSection}
          onClick={handleAdBannerClick}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
          }}
        >
          <img 
            src={adBanner.imageUrl} 
            alt={adBanner.altText} 
            style={styles.adBannerImage}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div style={{ ...styles.adBannerPlaceholder, display: 'none' }}>
            <span style={{ fontSize: '48px', marginBottom: '8px' }}>🎨</span>
            <span>광고 배너</span>
            <span style={{ fontSize: '12px', marginTop: '4px', opacity: 0.7 }}>
              클릭하여 광고 사이트로 이동
            </span>
          </div>
        </div>

        {/* 기능 버튼들 */}
        <div style={styles.featureButtonRow} className="feature-scroll">
          <button
            onClick={() => navigate("/main/diary")}
            style={styles.featureButton}
            className="feature-button"
          >
            <span style={{ fontSize: '24px'}}>📓</span>
            <span style={{ fontWeight: 'bold', fontSize: '12px' }}>다이어리</span>
          </button>

          <button
            onClick={() => navigate("/main/aiphoto")}
            style={styles.featureButton}
            className="feature-button"
          >
            <span style={{ fontSize: '24px', marginBottom: '4px' }}>🎨</span>
            <span style={{ fontWeight: 'bold', fontSize: '12px' }}>AI 사진</span>
          </button>
        </div>
      </div>

      {/* My Farm 섹션 */}
      <div style={styles.farmSection}>
        <div style={styles.farmHeader}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>My Farm</h3>
          {showCodeInput ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="기기 코드 입력"
                style={styles.input}
              />
              <button onClick={addDevice} style={styles.addButton}>
                등록
              </button>
              <button
                onClick={() => {
                  setShowCodeInput(false);
                  setInputCode("");
                }}
                style={styles.cancelButton}
              >
                취소
              </button>
            </div>
          ) : (
            <button onClick={() => setShowCodeInput(true)} style={styles.addButton}>
              + 추가
            </button>
          )}
        </div>

        {devices.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#6b7280', padding: '40px 0' }}>
            <p>등록된 기기가 없습니다.</p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>
              '+ 추가' 버튼을 눌러 기기를 등록해주세요.
            </p>
          </div>
        ) : (
          <div>
            {devices.map((device) => (
              <div
                key={device.serialNumber}
                style={styles.deviceCard}
              >
                <button
                  onClick={() => handleDeviceClick(device)}
                  style={{ 
                    display: 'flex', 
                    flex: 1, 
                    alignItems: 'center', 
                    textAlign: 'left',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    paddingLeft: '0px'
                  }}
                >
                  <img 
                    src={getPlantImage(device.plant)} 
                    alt="Plant Icon"
                    style={styles.deviceIcon} 
                  />
                  <div>
                    <p style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '20px', marginTop: '20px' }}>{device.deviceNickname}</p>
                    <p style={{ fontSize: '14px', color: '#a5a7abff', margin:'0px' }}>
                      시리얼: {device.serialNumber}
                    </p>
                    {device.plant ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', marginTop:'5px' }}>
                        <p style={{ fontSize: '16px', fontWeight: '500', margin: '0px'}}>
                          🌱 {device.plant.name} ({device.plant.species})
                        </p>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            editPlantName(device);
                          }} 
                          style={styles.editButton}
                        >
                          <Pencil size={19} color="#9D9D9D" />
                        </button>
                      </div>
                    ) : (
                      <div style={{ marginTop: '6px' }}>
                        <p style={{ fontSize: '16px', color: '#ea580c', fontWeight: '700' }}>
                          ⚠️ 식물 미등록
                        </p>
                        <p style={{ fontSize: '14px', color: '#ea580c', fontWeight: '500', marginTop: '2px' }}>
                          클릭하여 등록
                        </p>
                      </div>
                    )}
                  </div>
                </button>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteDevice(device.serialNumber);
                  }} 
                  style={styles.deleteButton}
                >
                  <img src={deleteBtnImage} alt="삭제" style={{ width: '100%', height: '100%' }} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MainPage;