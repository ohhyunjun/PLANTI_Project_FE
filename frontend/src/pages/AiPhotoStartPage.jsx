import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AiPhotoStartPage() {
  const navigate = useNavigate(); // ✅ props 말고 훅으로 가져오기
  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState([]);
  const [aiImages, setAiImages] = useState([]);

  // 사진 여러 장 선택
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setPreview(selectedFiles.map((file) => URL.createObjectURL(file)));
  };

  // AI 그림화 (OpenAI API)
  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("model", "gpt-image-variations"); // AI 그림화 모델
      formData.append("n", "1");
      formData.append("size", "512x512");

      // 여러 장 중 첫 장만 처리 (백엔드에서 반복 추천)
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
    } catch (error) {
      console.error("AI 변환 실패:", error);
    }
  };

  // 저장하기 (이미지 다운로드)
  const handleSave = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "ai-image.png";
    link.click();
  };

  return (
    <div className="photo-app">
      {/* 1. 사진 업로드 */}
      <h2>Add Photo</h2>
      <input type="file" multiple accept="image/*" onChange={handleFileChange} />
      <div className="preview-grid">
        {preview.map((src, idx) => (
          <img key={idx} src={src} alt={`preview-${idx}`} className="preview" />
        ))}
      </div>

      {/* 2. AI 그림화 버튼 */}
      <button onClick={handleUpdate}>Update (AI 그림화)</button>

      {/* 3. 결과 페이지 */}
      {aiImages.length > 0 && (
        <div className="result-section">
          <h3>사진 변화 알림</h3>
          {aiImages.map((url, idx) => (
            <div key={idx} className="ai-result">
              <img src={url} alt={`ai-${idx}`} />
              <button onClick={() => handleSave(url)}>저장</button>
              <button onClick={() => alert("커뮤니티 공유 기능 연결 필요!")}>
                공유하기
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 4. 홈으로 이동 */}
      <div className="flex justify-around items-center p-4 bg-green-100 shadow">
        <button onClick={() => navigate("/main")}>🏠 홈</button>
      </div>
    </div>
  );
}

export default AiPhotoStartPage;
