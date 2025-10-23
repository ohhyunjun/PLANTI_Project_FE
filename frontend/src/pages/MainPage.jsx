// src/pages/MainPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Home, Users, Heart, Pencil, Trash2 } from "lucide-react";
import { registerDevice } from "../api/device";
import { updatePlant } from "../api/plant";
import apiClient from "../api/apiClient";

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

  // 광고 배너 설정 (이미지 경로와 링크 URL을 여기서 수정하세요)
  const adBanner = {
    imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&h=400&fit=crop',
    linkUrl: 'https://www.naver.com',
    altText: '네이버 식물 광고'
  };

  useEffect(() => {
    fetchDevices();
    
    // 스타일 태그 추가
    const styleElement = document.createElement('style');
    styleElement.innerHTML = fontStyles;
    document.head.appendChild(styleElement);
    
    return () => {
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
      setDevices(devices.filter(d => d.serialNumber !== serialNumber));
      alert("기기 연결이 해제되었습니다.\n시리얼 번호를 알고 있는 다른 사용자가 이 기기를 등록할 수 있습니다.");
    } catch (error) {
      console.error("연결 해제 실패:", error);
      alert("연결 해제에 실패했습니다.");
    }
  };

  // 광고 배너 클릭 핸들러
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
    topSection: {
      padding: '16px'
    },
    buttonRow: {
      display: 'flex',
      gap: '8px',
      marginBottom: '16px'
    },
    plantiButton: {
      width: '60px',
      height: '60px',
      backgroundColor: '#4ade80',
      color: 'white',
      borderRadius: '16px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      padding: '12px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
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
      gap: '8px',
      overflowX: 'auto',
      paddingBottom: '8px'
    },
    featureButton: {
      minWidth: '70px',
      borderRadius: '12px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      padding: '12px 8px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      border: 'none',
      cursor: 'pointer'
    },
    farmSection: {
      flex: 1,
      overflowY: 'auto',
      padding: '16px'
    },
    farmHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px'
    },
    input: {
      border: '1px solid #d1d5db',
      padding: '8px',
      borderRadius: '8px',
      fontSize: '14px'
    },
    addButton: {
      backgroundColor: '#4ade80',
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
      backgroundColor: '#d1fae5',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '12px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      transition: 'background-color 0.2s'
    },
    deviceIcon: {
      fontSize: '48px',
      marginRight: '16px'
    },
    editButton: {
      backgroundColor: '#fbbf24',
      color: 'white',
      padding: '12px',
      borderRadius: '10px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      minWidth: '48px',
      minHeight: '48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    deleteButton: {
      backgroundColor: '#ef4444',
      color: 'white',
      padding: '12px',
      borderRadius: '10px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      minWidth: '48px',
      minHeight: '48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    navbar: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
      borderTop: '1px solid #e5e7eb',
      boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
    },
    navContainer: {
      maxWidth: '412px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '12px 0'
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
      transition: 'color 0.2s'
    }
  };

  return (
    <div style={styles.container}>
      <style>{fontStyles}</style>
      
      <div style={styles.topSection}>
        <div style={styles.buttonRow}>
          <button
            onClick={() => navigate("/main")}
            style={styles.plantiButton}
            onMouseEnter={e => e.target.style.backgroundColor = '#4ade80'}
            onMouseLeave={e => e.target.style.backgroundColor = '#42cc75ff'}
          >
            <span style={{ fontSize: '24px' }}>🌱</span>
            <span style={{ fontSize: '10px', fontWeight: 'bold', marginTop: '2px' }}>PLANTI</span>
          </button>
        </div>

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
            onClick={() => alert('My Farm')}
            style={styles.featureButton}
            className="feature-button"
          >
            <span style={{ fontSize: '24px', marginBottom: '4px' }}>🌿</span>
            <span style={{ fontWeight: 'bold', fontSize: '12px' }}>My Farm</span>
          </button>

          <button
            onClick={() => navigate("/main/diary")}
            style={styles.featureButton}
            className="feature-button"
          >
            <span style={{ fontSize: '24px', marginBottom: '4px' }}>📓</span>
            <span style={{ fontWeight: 'bold', fontSize: '12px' }}>Diary</span>
          </button>

          <button
            onClick={() => navigate("/main/aiphoto")}
            style={styles.featureButton}
            className="feature-button"
          >
            <span style={{ fontSize: '24px', marginBottom: '4px' }}>🎨</span>
            <span style={{ fontWeight: 'bold', fontSize: '12px' }}>AI Photo</span>
          </button>

          <button
            onClick={() => alert('Avatar')}
            style={styles.featureButton}
            className="feature-button"
          >
            <span style={{ fontSize: '24px', marginBottom: '4px' }}>👤</span>
            <span style={{ fontWeight: 'bold', fontSize: '12px' }}>Avatar</span>
          </button>

          <button
            onClick={() => navigate("/main/community")}
            style={styles.featureButton}
            className="feature-button"
          >
            <span style={{ fontSize: '24px', marginBottom: '4px' }}>👥</span>
            <span style={{ fontWeight: 'bold', fontSize: '12px' }}>Community</span>
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
                placeholder="기기 코드를 입력하세요"
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
                    cursor: 'pointer'
                  }}
                >
                  <div style={styles.deviceIcon}>🌿</div>
                  <div>
                    <p style={{ fontWeight: 'bold', fontSize: '18px' }}>{device.deviceNickname}</p>
                    <p style={{ fontSize: '14px', color: '#4b5563', marginTop: '4px' }}>
                      시리얼: {device.serialNumber}
                    </p>
                    {device.plant ? (
                      <p style={{ fontSize: '16px', marginTop: '6px', fontWeight: '500' }}>
                        🌱 {device.plant.name} ({device.plant.species})
                      </p>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginLeft: '8px' }}>
                  {device.plant && (
                    <button onClick={() => editPlantName(device)} style={styles.editButton}>
                      <Pencil size={20} strokeWidth={2.5} color="white" />
                    </button>
                  )}
                  <button onClick={() => deleteDevice(device.serialNumber)} style={styles.deleteButton}>
                    <Trash2 size={20} strokeWidth={2.5} color="white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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
            <span style={{ fontSize: '12px', fontWeight: '500' }}>My Page</span>
          </button>
          
          <button
            onClick={() => navigate('/main/setting')}
            style={{ ...styles.navButton, color: '#6b7280' }}
          >
            <Bell size={24} strokeWidth={2} />
            <span style={{ fontSize: '12px', fontWeight: '500' }}>알림</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainPage;