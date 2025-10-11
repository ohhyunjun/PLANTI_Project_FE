import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Home, Users, Heart } from "lucide-react";
import { registerDevice } from "../api/device";
import { updatePlant } from "../api/plant";
import apiClient from "../api/apiClient";

function MainPage() {
  const navigate = useNavigate();
  const [devices, setDevices] = useState([]);
  const [inputCode, setInputCode] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [adBannerImage, setAdBannerImage] = useState(null);

  useEffect(() => {
    fetchDevices();
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
    if (!window.confirm("정말 이 기기를 삭제(소유권 포기)하시겠습니까?\n연결된 식물 정보도 함께 삭제됩니다.")) return;
    try {
      await apiClient.delete(`/api/devices/${serialNumber}`);
      setDevices(devices.filter(d => d.serialNumber !== serialNumber));
      alert("기기가 삭제되었습니다.");
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제에 실패했습니다.");
    }
  };

  const handleAdImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdBannerImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
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
      flex: 1,
      backgroundColor: '#10b981',
      color: 'white',
      borderRadius: '16px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      padding: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    bellButton: {
      backgroundColor: '#10b981',
      color: 'white',
      borderRadius: '16px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      padding: '12px 24px',
      display: 'flex',
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
      backgroundColor: '#e0f2e9'
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
      backgroundColor: '#e0f2e9',
      color: '#059669',
      fontSize: '16px',
      fontWeight: '600'
    },
    featureButtonRow: {
      display: 'flex',
      gap: '8px',
      overflowX: 'auto',
      paddingBottom: '4px'
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
      cursor: 'pointer',
      transition: 'background-color 0.2s'
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
      padding: '8px 12px',
      borderRadius: '12px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px'
    },
    cancelButton: {
      backgroundColor: '#d1d5db',
      padding: '8px 12px',
      borderRadius: '12px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px'
    },
    deviceCard: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#d1fae5',
      padding: '12px',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginBottom: '12px',
      transition: 'background-color 0.2s'
    },
    deviceIcon: {
      width: '80px',
      height: '80px',
      backgroundColor: '#86efac',
      borderRadius: '8px',
      marginRight: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '36px',
      flexShrink: 0
    },
    editButton: {
      backgroundColor: '#fcd34d',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      border: 'none',
      cursor: 'pointer'
    },
    deleteButton: {
      backgroundColor: '#f87171',
      color: 'white',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      border: 'none',
      cursor: 'pointer',
      marginTop: '4px'
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
      {/* 상단 PLANTI 버튼과 알림 버튼 */}
      <div style={styles.topSection}>
        <div style={styles.buttonRow}>
          <button
            onClick={() => navigate("/main")}
            style={styles.plantiButton}
            onMouseEnter={e => e.target.style.backgroundColor = '#059669'}
            onMouseLeave={e => e.target.style.backgroundColor = '#10b981'}
          >
            <span style={{ fontSize: '24px', marginRight: '8px' }}>🌱</span>
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>PLANTI</span>
          </button>
          
          <button
            onClick={() => navigate("/main/setting")}
            style={styles.bellButton}
            onMouseEnter={e => e.target.style.backgroundColor = '#059669'}
            onMouseLeave={e => e.target.style.backgroundColor = '#10b981'}
          >
            <Bell size={24} />
          </button>
        </div>

        {/* 광고 배너 */}
        <div 
          style={styles.adBannerSection}
          onClick={() => document.getElementById('adImageInput').click()}
        >
          {adBannerImage ? (
            <img src={adBannerImage} alt="광고 배너" style={styles.adBannerImage} />
          ) : (
            <div style={styles.adBannerPlaceholder}>
              <span style={{ fontSize: '48px', marginBottom: '8px' }}>🎨</span>
              <span>클릭하여 광고 이미지 업로드</span>
            </div>
          )}
          <input
            id="adImageInput"
            type="file"
            accept="image/*"
            onChange={handleAdImageChange}
            style={{ display: 'none' }}
          />
        </div>

        {/* 기능 버튼들 - 가로 배열 */}
        <div style={styles.featureButtonRow}>
          <button
            onClick={() => alert('My Farm')}
            style={{ ...styles.featureButton, backgroundColor: '#86efac' }}
            onMouseEnter={e => e.target.style.backgroundColor = '#6ee7b7'}
            onMouseLeave={e => e.target.style.backgroundColor = '#86efac'}
          >
            <span style={{ fontSize: '24px', marginBottom: '4px' }}>🌿</span>
            <span style={{ fontWeight: 'bold', fontSize: '12px' }}>My Farm</span>
          </button>

          <button
            onClick={() => navigate("/main/diary")}
            style={{ ...styles.featureButton, backgroundColor: '#fef08a' }}
            onMouseEnter={e => e.target.style.backgroundColor = '#fde047'}
            onMouseLeave={e => e.target.style.backgroundColor = '#fef08a'}
          >
            <span style={{ fontSize: '24px', marginBottom: '4px' }}>📔</span>
            <span style={{ fontWeight: 'bold', fontSize: '12px' }}>Diary</span>
          </button>

          <button
            onClick={() => navigate("/main/aiphoto")}
            style={{ ...styles.featureButton, backgroundColor: '#bfdbfe' }}
            onMouseEnter={e => e.target.style.backgroundColor = '#93c5fd'}
            onMouseLeave={e => e.target.style.backgroundColor = '#bfdbfe'}
          >
            <span style={{ fontSize: '24px', marginBottom: '4px' }}>🎨</span>
            <span style={{ fontWeight: 'bold', fontSize: '12px' }}>AI Photo</span>
          </button>

          <button
            onClick={() => alert('Avatar')}
            style={{ ...styles.featureButton, backgroundColor: '#ddd6fe' }}
            onMouseEnter={e => e.target.style.backgroundColor = '#c4b5fd'}
            onMouseLeave={e => e.target.style.backgroundColor = '#ddd6fe'}
          >
            <span style={{ fontSize: '24px', marginBottom: '4px' }}>👤</span>
            <span style={{ fontWeight: 'bold', fontSize: '12px' }}>Avatar</span>
          </button>

          <button
            onClick={() => navigate("/main/community")}
            style={{ ...styles.featureButton, backgroundColor: '#fbcfe8' }}
            onMouseEnter={e => e.target.style.backgroundColor = '#f9a8d4'}
            onMouseLeave={e => e.target.style.backgroundColor = '#fbcfe8'}
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
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#a7f3d0'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#d1fae5'}
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
                    <p style={{ fontWeight: 'bold' }}>{device.deviceNickname}</p>
                    <p style={{ fontSize: '12px', color: '#4b5563' }}>
                      시리얼: {device.serialNumber}
                    </p>
                    {device.plant ? (
                      <p style={{ fontSize: '14px', marginTop: '4px' }}>
                        🌱 {device.plant.name} ({device.plant.species})
                      </p>
                    ) : (
                      <p style={{ fontSize: '14px', marginTop: '4px', color: '#ea580c', fontWeight: '600' }}>
                        ⚠️ 식물 미등록 - 클릭하여 등록
                      </p>
                    )}
                  </div>
                </button>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginLeft: '8px' }}>
                  {device.plant && (
                    <button onClick={() => editPlantName(device)} style={styles.editButton}>
                      수정
                    </button>
                  )}
                  <button onClick={() => deleteDevice(device.serialNumber)} style={styles.deleteButton}>
                    삭제
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
          
          <button style={{ ...styles.navButton, color: '#6b7280' }}>
            <Heart size={24} strokeWidth={2} />
            <span style={{ fontSize: '12px', fontWeight: '500' }}>좋아요</span>
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