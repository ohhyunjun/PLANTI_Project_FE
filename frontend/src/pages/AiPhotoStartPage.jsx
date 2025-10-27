import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Camera, Bell, Home, Users, Heart } from "lucide-react";
import apiClient from "../api/apiClient";

// Pretendard 폰트 추가
const fontStyles = `
@font-face {
    font-family: 'Pretendard';
    src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
    font-weight: 400;
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
* {
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
}
`;

function AiPhotoStartPage() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState([]);
  const [aiImages, setAiImages] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [stylePrompt, setStylePrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newFiles = [...files, ...selectedFiles];
    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    
    setFiles(newFiles);
    setPreview([...preview, ...newPreviews]);
    
    if (currentStep === 0) {
      setCurrentStep(1);
    }
  };

  const handleRemoveImage = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreview = preview.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPreview(newPreview);
    
    if (newFiles.length === 0) {
      setCurrentStep(0);
    }
  };

  const handleUpdate = async () => {
    if (!stylePrompt.trim()) {
      alert("어떻게 만들지 설명을 입력해주세요!");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', files[0]);
      
      const uploadResponse = await apiClient.post('/api/aiArts/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const uploadedImageUrl = uploadResponse.data.imageUrl;
      
      const aiArtResponse = await apiClient.post('/api/aiArts', {
        originalImageUrl: uploadedImageUrl,
        style: stylePrompt
      });

      setAiImages([aiArtResponse.data.artImageUrl]);
      setCurrentStep(2);
    } catch (error) {
      console.error("AI 변환 실패:", error);
      alert("AI 이미지 생성에 실패했습니다: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "ai-image.png";
    link.click();
  };
  
  // 스타일 객체 (GrowPage/SettingPage 와 유사하게)
  const styles = {
    container: {
      minHeight: '100vh',
      maxWidth: '412px',
      margin: '0 auto',
      backgroundColor: '#f9fafb', // 배경색 통일
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: '80px',
      boxSizing: 'border-box'
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
      zIndex: 100
    },
    backButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '8px',
      marginRight: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    title: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#374151'
    },
    progressDots: {
      display: 'flex',
      gap: '8px',
      justifyContent: 'center',
      margin: '24px 0'
    },
    dot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: '#d1d5db'
    },
    activeDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: '#0D986A' // 메인 색상 적용
    },
    content: {
      backgroundColor: 'white',
      margin: '0 16px',
      borderRadius: '16px',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
      flex: 1
    },
    stepTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '32px',
      textAlign: 'center'
    },
    uploadCircle: {
      width: '180px',
      height: '180px',
      borderRadius: '50%',
      border: '2px dashed #d1d5db',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '32px',
      cursor: 'pointer',
      transition: 'border-color 0.2s'
    },
    cameraIcon: {
      color: '#9ca3af'
    },
    addButton: {
      backgroundColor: '#0D986A', // 메인 색상 적용
      color: 'white',
      border: 'none',
      borderRadius: '24px',
      padding: '14px 48px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    previewGrid: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '12px',
      width: '100%',
      marginBottom: '24px'
    },
    previewImageContainer: {
      position: 'relative',
      width: '160px',
      height: '160px',
    },
    previewImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: '12px',
      cursor: 'pointer',
      border: '2px solid #e5e7eb'
    },
    deleteButton: {
      position: 'absolute',
      top: '8px',
      left: '8px',
      width: '28px',
      height: '28px',
      borderRadius: '6px',
      backgroundColor: 'white',
      border: '1px solid #d1d5db',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      zIndex: 10,
      transition: 'all 0.2s',
      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
      fontSize: '18px',
      lineHeight: 1
    },
    startButton: {
      backgroundColor: '#0D986A', // 메인 색상 적용
      color: 'white',
      border: 'none',
      borderRadius: '24px',
      padding: '14px 30px',
      fontSize: '18px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      width: '100%'
    },
    resultImage: {
      width: '100%',
      maxWidth: '400px',
      borderRadius: '12px',
      marginBottom: '16px'
    },
    resultButtonGroup: {
      display: 'flex',
      gap: '12px',
      width: '100%',
      maxWidth: '400px'
    },
    saveButton: {
      flex: 1,
      backgroundColor: '#0D986A', // 메인 색상 적용
      color: 'white',
      border: 'none',
      borderRadius: '24px',
      padding: '14px 24px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer'
    },
    shareButton: {
      flex: 1,
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '24px',
      padding: '14px 24px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer'
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      cursor: 'pointer'
    },
    modalImage: {
      maxWidth: '90%',
      maxHeight: '90%',
      borderRadius: '12px'
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
      transition: 'color 0.2s'
    }
  };

  return (
    <div style={styles.container}>
      <style>{fontStyles}</style>
      
      {/* 헤더 (SettingPage와 동일한 구조) */}
      <div style={styles.header}>
        <button 
          style={styles.backButton}
          onClick={() => navigate('/main')}
        >
          <ChevronLeft size={24} />
        </button>
        <div style={styles.title}>AI 사진 변환</div>
      </div>

      <div style={styles.progressDots}>
        {[0, 1, 2].map((step) => (
          <div 
            key={step} 
            style={currentStep >= step ? styles.activeDot : styles.dot}
          />
        ))}
      </div>

      <div style={styles.content}>
        {currentStep === 0 && (
          <>
            <h2 style={styles.stepTitle}>AI로 만들 사진 업로드</h2>
            
            <label 
              htmlFor="fileInput"
              style={styles.uploadCircle}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0D986A'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; }}
            >
              <Camera size={64} style={styles.cameraIcon} />
            </label>

            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            <button 
              style={styles.addButton}
              onClick={() => document.getElementById('fileInput').click()}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#0a7d55'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0D986A'; }}
            >
              사진 선택하기
            </button>
          </>
        )}

        {currentStep === 1 && preview.length > 0 && (
          <>
            <h2 style={styles.stepTitle}>어떻게 바꿔볼까요?</h2>
            
            <div style={styles.previewGrid}>
              {preview.map((src, idx) => (
                <div key={idx} style={styles.previewImageContainer}>
                  <img 
                    src={src} 
                    alt={`preview-${idx}`} 
                    style={styles.previewImage}
                    onClick={() => setSelectedImage(src)}
                  />
                  <button
                    style={styles.deleteButton}
                    onClick={() => handleRemoveImage(idx)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div style={{ width: '100%', marginBottom: '24px' }}>
              <label style={{
                display: 'block', fontSize: '14px', fontWeight: '600',
                color: '#374151', marginBottom: '8px'
              }}>
                어떻게 만들어드릴까요? 🎨
              </label>
              <textarea
                value={stylePrompt}
                onChange={(e) => setStylePrompt(e.target.value)}
                placeholder="예: 수채화 스타일로, 봄날의 정원처럼..."
                style={{
                  width: '100%', minHeight: '100px', padding: '12px',
                  fontSize: '14px', border: '1px solid #d1d5db',
                  borderRadius: '8px', resize: 'vertical',
                  fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box'
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#0D986A'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; }}
              />
            </div>

            <button 
              style={{...styles.startButton, opacity: loading ? 0.6 : 1 }}
              onClick={handleUpdate}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#0a7d55'; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#0D986A'; }}
              disabled={loading}
            >
              {loading ? 'AI 생성 중...' : 'AI 그림화 시작'}
            </button>
          </>
        )}

        {currentStep === 2 && aiImages.length > 0 && (
          <>
            <h2 style={styles.stepTitle}>AI 그림 완성!</h2>
            
            {aiImages.map((url, idx) => (
              <div key={idx} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img 
                  src={url} alt={`ai-${idx}`} style={styles.resultImage}
                  onClick={() => setSelectedImage(url)}
                />
                
                <div style={styles.resultButtonGroup}>
                  <button onClick={() => handleSave(url)} style={styles.saveButton}>
                    저장
                  </button>
                  <button onClick={() => alert("커뮤니티 공유 기능 연결 필요!")} style={styles.shareButton}>
                    공유하기
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {selectedImage && (
        <div style={styles.modalOverlay} onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="확대 이미지" style={styles.modalImage}/>
        </div>
      )}

      {/* 네비게이션 바 (SettingPage와 동일한 구조) */}
      <div style={styles.navbar}>
        <div style={styles.navContainer}>
          <button onClick={() => navigate('/main')} style={{ ...styles.navButton, color: '#0D986A' }}> {/* 홈 활성화 */ }
            <Home size={24} strokeWidth={2} />
            <span style={{ fontSize: '12px', fontWeight: '500' }}>홈</span>
          </button>
          
          <button onClick={() => navigate('/main/community')} style={{ ...styles.navButton, color: '#6b7280' }}>
            <Users size={24} strokeWidth={2} />
            <span style={{ fontSize: '12px', fontWeight: '500' }}>커뮤니티</span>
          </button>
          
          <button onClick={() => navigate('/community/mypage')} style={{ ...styles.navButton, color: '#6b7280' }}>
            <Heart size={24} strokeWidth={2} />
            <span style={{ fontSize: '12px', fontWeight: '500' }}>마이페이지</span>
          </button>
          
          <button onClick={() => navigate('/main/setting')} style={{ ...styles.navButton, color: '#6b7280' }}>
            <Bell size={24} strokeWidth={2} />
            <span style={{ fontSize: '12px', fontWeight: '500' }}>알림</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AiPhotoStartPage;