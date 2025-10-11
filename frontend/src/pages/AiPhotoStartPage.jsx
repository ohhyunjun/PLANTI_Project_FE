import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Camera, Bell, Home, Users, Heart } from "lucide-react";

function AiPhotoStartPage() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState([]);
  const [aiImages, setAiImages] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setPreview(selectedFiles.map((file) => URL.createObjectURL(file)));
    setCurrentStep(1);
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("model", "gpt-image-variations");
      formData.append("n", "1");
      formData.append("size", "512x512");
      formData.append("image", files[0]);

      const response = await axios.post(
        "https://api.openai.com/v1/images/variations",
        formData,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setAiImages(response.data.data.map((img) => img.url));
      setCurrentStep(2);
    } catch (error) {
      console.error("AI 변환 실패:", error);
    }
  };

  const handleSave = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "ai-image.png";
    link.click();
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: '80px'
    },
    header: {
      backgroundColor: 'white',
      padding: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    backButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '8px'
    },
    title: {
      flex: 1,
      textAlign: 'center',
      fontSize: '16px',
      color: '#9ca3af',
      marginLeft: '-40px'
    },
    progressDots: {
      display: 'flex',
      gap: '8px',
      justifyContent: 'center',
      margin: '16px 0'
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
      backgroundColor: '#1f2937'
    },
    content: {
      flex: 1,
      backgroundColor: 'white',
      margin: '16px',
      borderRadius: '16px',
      padding: '32px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
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
      backgroundColor: '#10b981',
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
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '12px',
      width: '100%',
      marginBottom: '24px'
    },
    previewImage: {
      width: '100%',
      height: '120px',
      objectFit: 'cover',
      borderRadius: '12px'
    },
    resultImage: {
      width: '100%',
      maxWidth: '400px',
      borderRadius: '12px',
      marginBottom: '16px'
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      width: '100%',
      maxWidth: '400px'
    },
    saveButton: {
      flex: 1,
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '12px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer'
    },
    shareButton: {
      flex: 1,
      backgroundColor: '#ec4899',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '12px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer'
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
      maxWidth: '28rem',
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
      {/* 헤더 */}
      <div style={styles.header}>
        <button 
          style={styles.backButton}
          onClick={() => navigate('/main')}
        >
          <ChevronLeft size={24} />
        </button>
        <div style={styles.title}>사진 AI 그림화 등록</div>
      </div>

      {/* 진행 표시 점 */}
      <div style={styles.progressDots}>
        {[0, 1, 2, 3, 4].map((step) => (
          <div 
            key={step} 
            style={currentStep >= step ? styles.activeDot : styles.dot}
          />
        ))}
      </div>

      {/* 메인 콘텐츠 */}
      <div style={styles.content}>
        {currentStep === 0 && (
          <>
            <h2 style={styles.stepTitle}>사진 업로드</h2>
            
            <label 
              htmlFor="fileInput"
              style={styles.uploadCircle}
              onMouseEnter={e => e.target.style.borderColor = '#10b981'}
              onMouseLeave={e => e.target.style.borderColor = '#d1d5db'}
            >
              <Camera size={64} style={styles.cameraIcon} />
              <input
                id="fileInput"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </label>

            <button 
              style={styles.addButton}
              onClick={() => document.getElementById('fileInput').click()}
              onMouseEnter={e => e.target.style.backgroundColor = '#059669'}
              onMouseLeave={e => e.target.style.backgroundColor = '#10b981'}
            >
              사진 추가
            </button>
          </>
        )}

        {currentStep === 1 && preview.length > 0 && (
          <>
            <h2 style={styles.stepTitle}>선택한 사진</h2>
            
            <div style={styles.previewGrid}>
              {preview.map((src, idx) => (
                <img 
                  key={idx} 
                  src={src} 
                  alt={`preview-${idx}`} 
                  style={styles.previewImage}
                />
              ))}
            </div>

            <button 
              style={styles.addButton}
              onClick={handleUpdate}
              onMouseEnter={e => e.target.style.backgroundColor = '#059669'}
              onMouseLeave={e => e.target.style.backgroundColor = '#10b981'}
            >
              AI 그림화 시작
            </button>
          </>
        )}

        {currentStep === 2 && aiImages.length > 0 && (
          <>
            <h2 style={styles.stepTitle}>사진 변화 알림</h2>
            
            {aiImages.map((url, idx) => (
              <div key={idx} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img src={url} alt={`ai-${idx}`} style={styles.resultImage} />
                
                <div style={styles.buttonGroup}>
                  <button 
                    onClick={() => handleSave(url)}
                    style={styles.saveButton}
                  >
                    저장
                  </button>
                  <button 
                    onClick={() => alert("커뮤니티 공유 기능 연결 필요!")}
                    style={styles.shareButton}
                  >
                    공유하기
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* 하단 네비게이션 바 */}
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

export default AiPhotoStartPage;