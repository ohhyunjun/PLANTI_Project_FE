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
  const [selectedImage, setSelectedImage] = useState(null);

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
      width: '412px',
      height: '1080px',
      margin: '0 auto',
      backgroundColor: '#f3f4f6',
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: '80px',
      overflow: 'hidden'
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
      justifyContent: 'center',
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
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '12px',
      width: '100%',
      marginBottom: '24px',
      padding: '0 8px'
    },
    previewImageContainer: {
      position: 'relative',
      width: '100%',
      paddingBottom: '100%',
      overflow: 'visible',
      borderRadius: '12px'
    },
    previewImage: {
      position: 'absolute',
      top: 0,
      left: 0,
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
      padding: '14px 24px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    resultImage: {
      width: '100%',
      maxWidth: '400px',
      borderRadius: '12px',
      marginBottom: '16px',
      cursor: 'pointer'
    },
    resultButtonGroup: {
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
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    },
    modalImage: {
      maxWidth: '90%',
      maxHeight: '90vh',
      objectFit: 'contain',
      borderRadius: '8px',
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
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = '#fef2f2';
                      e.currentTarget.style.borderColor = '#ef4444';
                      e.currentTarget.style.color = '#ef4444';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = 'white';
                      e.currentTarget.style.borderColor = '#d1d5db';
                      e.currentTarget.style.color = '#6b7280';
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

            <input
              id="fileInputMore"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            <div style={styles.buttonGroup}>
              <button 
                style={styles.addMoreButton}
                onClick={() => document.getElementById('fileInputMore').click()}
                onMouseEnter={e => e.target.style.backgroundColor = '#4b5563'}
                onMouseLeave={e => e.target.style.backgroundColor = '#6b7280'}
              >
                사진 더 추가
              </button>
              
              <button 
                style={styles.startButton}
                onClick={handleUpdate}
                onMouseEnter={e => e.target.style.backgroundColor = '#059669'}
                onMouseLeave={e => e.target.style.backgroundColor = '#10b981'}
              >
                AI 그림화 시작
              </button>
            </div>
          </>
        )}

        {currentStep === 2 && aiImages.length > 0 && (
          <>
            <h2 style={styles.stepTitle}>사진 변화 알림</h2>
            
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

      {/* 이미지 확대 보기 모달 */}
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

export default AiPhotoStartPage;