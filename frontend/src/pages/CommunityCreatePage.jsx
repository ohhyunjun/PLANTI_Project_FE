import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createPost } from "../api/community";
import { Home, Users, Heart, Bell, ChevronLeft, Image as ImageIcon } from "lucide-react";
import deleteIcon from "../assets/deleteBtn.png"; // 1. 이미지 import

// Pretendard 폰트
const fontStyles = `
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
* {
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
}
::placeholder {
    color: #d1d5db; /* 희미한 회색 */
    opacity: 1; /* Firefox에서 필요할 수 있음 */
}
:-ms-input-placeholder { /* IE 10-11 */
    color: #d1d5db;
}
::-ms-input-placeholder { /* Edge */
    color: #d1d5db;
}
`;

function CommunityCreatePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [error, setError] = useState("");

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (imagePreviewUrl) {
                URL.revokeObjectURL(imagePreviewUrl);
            }
            setImageFile(file);
            setImagePreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleImageRemove = (e) => {
        // label의 onClick이 실행되는 것을 방지
        e.preventDefault(); 
        e.stopPropagation();

        if (imagePreviewUrl) {
            URL.revokeObjectURL(imagePreviewUrl);
        }
        setImageFile(null);
        setImagePreviewUrl(null);
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            fileInput.value = '';
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        if (!title.trim() && !content.trim() && !imageFile) {
            alert("제목, 내용 또는 이미지를 하나 이상 입력해주세요.");
            return;
        }

        try {
            const postData = {
                title: title.trim(),
                content: content.trim(),
                file: imageFile
            };
            
            await createPost(postData);
            
            setTitle("");
            setContent("");
            if (imagePreviewUrl) {
                URL.revokeObjectURL(imagePreviewUrl);
            }
            setImageFile(null);
            setImagePreviewUrl(null);
            
            navigate("/main/community"); 
            
        } catch (error) {
            console.error("게시글 생성 실패:", error);
            setError("게시글 작성에 실패했습니다.");
        }
    };

    const handleCancel = () => {
        if (title.trim() || content.trim() || imageFile) {
            if (!window.confirm("작성 중인 내용이 사라집니다. 나가시겠습니까?")) {
                return;
            }
        }
        navigate(-1);
    };

    // 글자 수 계산
    const totalLength = content.length;

    const styles = {
        container: {
            maxWidth: '412px',
            margin: '0 auto',
            backgroundColor: '#f9fafb',
            minHeight: '100vh',
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
            justifyContent: 'space-between',
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
        contentArea: {
            flex: 1,
            padding: '20px 16px',
            overflowY: 'auto'
        },
        charCount: {
            textAlign: 'right',
            marginTop: '8px',
            fontSize: '14px',
            color: '#9ca3af'
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
            
            {/* ✅ 상단바 - CommunityStartPage와 동일 스타일 */}
            <div style={styles.header}>
                <div style={styles.logo}>
                    <button 
                        onClick={() => navigate(-1)}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <span>글 쓰기</span>
                </div>
                
                {/* ✅ 검색 버튼 대신 취소/완료 버튼 */}
                <div style={{ display: 'flex', alignItems: 'center'}}> {/* 간격 수정 */}
                    <button
                        onClick={handleCancel}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '15px',
                            fontWeight: '400',
                            color: '#6b7280'
                        }}
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!title.trim() && !content.trim() && !imageFile}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: !title.trim() && !content.trim() && !imageFile ? 'not-allowed' : 'pointer',
                            fontSize: '15px',
                            fontWeight: '600',
                            color: '#10B981'
                        }}
                    >
                        완료
                    </button>
                </div>
            </div>

            {/* 메인 컨텐츠 */}
            <div style={styles.contentArea}>
                {/* 사진첨부 및 미리보기 영역 */}
                <label
                    style={{
                        // 공통 스타일 (크기 고정 및 정렬)
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '165px', // 영역 크기 고정

                        // 나머지 공통 스타일
                        position: 'relative',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        overflow: 'hidden',

                        // 조건부 스타일 (테두리, 패딩)
                        ...(imagePreviewUrl ? {
                            // 1. 이미지가 있을 때 (패딩/테두리 없음)
                            border: 'none',
                            padding: 0,
                        } : {
                            // 2. 이미지가 없을 때 (기존 점선 테두리)
                            border: '2px dashed #e5e7eb',
                        })
                    }}
                    // 호버 효과는 이미지가 없을 때만 적용
                    onMouseEnter={(e) => {
                        if (!imagePreviewUrl) {
                            e.currentTarget.style.borderColor = '#0D986A';
                            e.currentTarget.style.backgroundColor = '#f0fdf4';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!imagePreviewUrl) {
                            e.currentTarget.style.borderColor = '#e5e7eb';
                            e.currentTarget.style.backgroundColor = 'white';
                        }
                    }}
                >
                    {imagePreviewUrl ? (
                        // --- 이미지가 있을 때: 미리보기 ---
                        <>
                            <img 
                                src={imagePreviewUrl} 
                                alt="미리보기" 
                                style={{
                                    width: '100%',
                                    height: '100%',       // 부모 높이(300px) 채우기
                                    objectFit: 'contain', // 이미지 잘림 없이 다 보이게
                                    display: 'block',
                                    backgroundColor: '#f9fafb' // 레터박스 배경색
                                }}
                            />
                            <button
                                onClick={handleImageRemove}
                                style={{
                                    position: 'absolute',
                                    top: '5px',
                                    right: '10px',
                                    width: '25px',
                                    height: '25px',
                                    borderRadius: '50%',
                                    backgroundColor: 'transparent', // 배경 투명
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: 0, // 버튼 내부 여백 제거
                                    zIndex: 5
                                }}
                            >
                                {/* 아이콘 대신 이미지 사용 */}
                                <img 
                                    src={deleteIcon} 
                                    alt="Remove" 
                                    style={{ width: '100%', height: '100%' }} // 버튼 크기에 맞춤
                                />
                            </button>
                        </>
                    ) : (
                        // --- 이미지가 없을 때: 사진첨부 아이콘 ---
                        <>
                            <ImageIcon size={40} color="#9ca3af" style={{ marginBottom: '12px' }} />
                            <span style={{
                                fontSize: '14px',
                                color: '#6b7280',
                                fontWeight: '500'
                            }}>
                                사진첨부
                            </span>
                        </>
                    )}
                    
                    {/* 파일 입력란은 항상 숨겨진 상태로 유지 */}
                    <input 
                        id="fileInput"
                        type="file" 
                        accept="image/*" 
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                    />
                </label>

                {/* 제목 입력 */}
                <div style={{ 
                    marginTop: '16px', 
                    marginBottom: '16px',
                    backgroundColor: 'white',
                    padding: '16px',
                    borderRadius: '12px'
                }}>
                    <label style={{
                        display: 'block',
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#6b7280',
                        marginBottom: '8px',
                        textAlign: 'left'
                    }}>
                        제목
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="제목을 입력해주세요."
                        style={{
                            width: '100%',
                            padding: '12px 0',
                            fontSize: '16px',
                            fontWeight: '400',
                            color: '#374151',
                            border: 'none',
                            borderBottom: '1px solid #cacbce39',
                            outline: 'none',
                            backgroundColor: 'transparent',
                            textAlign: 'left' // 좌측 정렬
                        }}
                    />
                </div>

                {/* 내용 입력 */}
                <div style={{ 
                    marginTop: '16px',
                    backgroundColor: 'white',
                    padding: '16px',
                    borderRadius: '12px'
                }}>
                    <label style={{
                        display: 'block',
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#6b7280',
                        marginBottom: '8px',
                        textAlign: 'left'
                    }}>
                        내용
                    </label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="내용을 입력해주세요."
                        style={{
                            width: '100%',
                            padding: '12px 0',
                            fontSize: '16px',
                            fontWeight: '400',
                            color: '#374151',
                            lineHeight: '1.6',
                            border: 'none',
                            outline: 'none',
                            resize: 'none',
                            backgroundColor: 'transparent',
                            minHeight: '200px',
                            textAlign: 'left' // 좌측 정렬
                        }}
                    />
                    {/* 글자 수 */}
                    <div style={styles.charCount}>
                        <span style={{ color: totalLength > 2000 ? '#dc2626' : '#0D986A', fontWeight: '600' }}>
                            {totalLength}
                        </span>
                        /2000
                    </div>
                </div>

                {/* 에러 메시지 */}
                {error && (
                    <div style={{
                        marginTop: '16px',
                        padding: '12px',
                        backgroundColor: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: '8px',
                        color: '#dc2626',
                        fontSize: '14px'
                    }}>
                        {error}
                    </div>
                )}
            </div>

            {/* ✅ 하단 네비게이션 바 - CommunityStartPage와 완전히 동일 */}
            <div style={styles.navbar}>
                <div style={styles.navContainer}>
                    <button
                        onClick={() => navigate('/main')}
                        style={{ 
                            ...styles.navButton, 
                            color: location.pathname === '/main' ? '#0D986A' : '#6b7280' 
                        }}
                    >
                        <Home size={24} strokeWidth={2} />
                        <span style={{ fontSize: '12px', fontWeight: '500' }}>홈</span>
                    </button>
                    
                    <button
                        onClick={() => navigate('/main/community')}
                        style={{ 
                            ...styles.navButton, 
                            color: location.pathname.includes('/community') ? '#0D986A' : '#6b7280' 
                        }}
                    >
                        <Users size={24} strokeWidth={2} />
                        <span style={{ fontSize: '12px', fontWeight: '500' }}>커뮤니티</span>
                    </button>
                    
                    <button 
                        onClick={() => navigate('/community/mypage')}
                        style={{ 
                            ...styles.navButton, 
                            color: location.pathname === '/community/mypage' ? '#0D986A' : '#6b7280' 
                        }}
                    >
                        <Heart size={24} strokeWidth={2} />
                        <span style={{ fontSize: '12px', fontWeight: '500' }}>마이페이지</span>
                    </button>
                    
                    <button
                        onClick={() => navigate('/main/setting')}
                        style={{ 
                            ...styles.navButton, 
                            color: location.pathname === '/main/setting' ? '#0D986A' : '#6b7280' 
                        }}
                    >
                        <Bell size={24} strokeWidth={2} />
                        <span style={{ fontSize: '12px', fontWeight: '500' }}>알림</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CommunityCreatePage;