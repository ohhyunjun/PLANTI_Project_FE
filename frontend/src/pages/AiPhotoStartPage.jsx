import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Camera, Bell, Home, Users, Heart } from "lucide-react";
import apiClient from "../api/apiClient";

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
      // 1단계: 이미지 먼저 서버에 업로드
      const formData = new FormData();
      formData.append('image', files[0]);
      
      console.log("1단계: 이미지 업로드 중...");
      const uploadResponse = await apiClient.post('/api/aiArts/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      const uploadedImageUrl = uploadResponse.data.imageUrl;
      console.log("이미지 업로드 완료:", uploadedImageUrl);
      
      // 2단계: 업로드된 이미지 URL과 스타일로 AI 아트 생성
      console.log("2단계: AI 아트 생성 중...");
      const aiArtResponse = await apiClient.post('/api/aiArts', {
        originalImageUrl: uploadedImageUrl,
        style: stylePrompt
      });

      console.log("AI 아트 생성 성공:", aiArtResponse.data);
      
      // 3단계: 생성된 이미지 URL 저장 및 표시
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

  const styles = {
    container: {
      width: '412px',
      minHeight: '100vh',
      margin: '0 auto',
      backgroundColor: '#f3f4f6',
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: '80px',
      overflow: 'visible',
      maxWidth: '100vw',
      boxSizing: 'border-box'
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
      backgroundColor: 'white',
      margin: '8px',
      borderRadius: '16px',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      boxSizing: 'border-box'
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
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '12px',
      width: '100%',
      marginBottom: '24px',
      padding: '0',
      boxSizing: 'border-box',
      maxWidth: '100%'
    },
    previewImageContainer: {
      position: 'relative',
      width: '160px',
      height: '160px',
      flexShrink: 0,
      overflow: 'visible',
      borderRadius: '12px'
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
      color: '#6b7280',
      border: '1px solid #d1d5db',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      zIndex: 10,
      transition: 'all 0.2s',
      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
      fontSize: '18px',
      fontWeight: 'bold',
      lineHeight: 1
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      width: '100%',
      padding: '0 8px'
    },
    addMoreButton: {
      flex: 1,
      backgroundColor: '#6b7280',
      color: 'white',
      border: 'none',
      borderRadius: '24px',
      padding: '14px 24px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    startButton: {
      flex: 1,
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '24px',
      padding: '12px 30px',
      fontSize: '18px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
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
      maxWidth: '400px',
      marginBottom: '16px'
    },
    saveButton: {
      flex: 1,
      backgroundColor: '#10b981',
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
      left: 0,
      right: 0,
      backgroundColor: 'white',
      borderTop: '1px solid #e5e7eb',
      padding: '12px 0',
      boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
      zIndex: 50
    },
    navContainer: {
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
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
        <button 
          style={styles.backButton}
          onClick={() => navigate('/main')}
        >
          <ChevronLeft size={24} />
        </button>
        <div style={styles.title}>사진 AI 그림화 등록</div>
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
            <h2 style={styles.stepTitle}>사진 업로드</h2>
            
            <label 
              htmlFor="fileInput"
              style={styles.uploadCircle}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#10b981'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; }}
            >
              <Camera size={64} style={styles.cameraIcon} />
            </label>

            <input
              id="fileInput"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            <button 
              style={styles.addButton}
              onClick={() => document.getElementById('fileInput').click()}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#059669'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#10b981'; }}
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
                <div key={idx} style={styles.previewImageContainer}>
                  <img 
                    src={src} 
                    alt={`preview-${idx}`} 
                    style={styles.previewImage}
                    onClick={() => setSelectedImage(src)}
                  />
                  <button
                    style={styles.deleteButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(idx);
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                      e.currentTarget.style.borderColor = '#9ca3af';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                      e.currentTarget.style.borderColor = '#d1d5db';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div style={{ width: '100%', padding: '0 8px', marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                어떻게 만들어드릴까요? 🎨
              </label>
              <textarea
                value={stylePrompt}
                onChange={(e) => setStylePrompt(e.target.value)}
                placeholder="예: 수채화 스타일로, 봄날의 정원처럼, 빈센트 반 고흐 스타일로..."
                style={{
                  width: '100%',
                  minHeight: '100px',
                  padding: '12px',
                  fontSize: '14px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#10b981'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; }}
              />
              <div style={{
                fontSize: '12px',
                color: '#6b7280',
                marginTop: '4px'
              }}>
                원하는 스타일이나 분위기를 자유롭게 설명해주세요
              </div>
            </div>

            <button 
              style={{
                ...styles.startButton,
                opacity: loading ? 0.6 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
                width: '100%',
                boxSizing: 'border-box'
              }}
              onClick={handleUpdate}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#059669'; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#10b981'; }}
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
                  src={url} 
                  alt={`ai-${idx}`} 
                  style={styles.resultImage}
                  onClick={() => setSelectedImage(url)}
                />
                
                <div style={styles.resultButtonGroup}>
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

      {selectedImage && (
        <div 
          style={styles.modalOverlay}
          onClick={() => setSelectedImage(null)}
        >
          <img 
            src={selectedImage} 
            alt="확대 이미지" 
            style={styles.modalImage}
          />
        </div>
      )}

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
            style={{ ...styles.navButton, color: '#6b7280' }}
          >
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

export default AiPhotoStartPage;