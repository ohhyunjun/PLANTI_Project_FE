import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getPostById, createComment, deletePost, updatePost, getCurrentUser } from "../api/community";
import { Home, Users, Heart, Bell, ChevronLeft, Image as ImageIcon } from "lucide-react";
import deleteIcon from "../assets/deleteBtn.png"; // 첨부파일 삭제 아이콘

// Pretendard 폰트 (일관성을 위해 추가)
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

// lucide-react의 send 아이콘 대신 사용할 SVG (CommunityCreatePage와 동일)
const SendIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
);


function CommunityPostDetailPage() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newComment, setNewComment] = useState("");
    const [currentUserId, setCurrentUserId] = useState(null);
    const [currentUsername, setCurrentUsername] = useState(null); // username 추가

    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState("");
    const [editedContent, setEditedContent] = useState("");
    
    // 이미지 편집 관련 상태
    const [editImageFile, setEditImageFile] = useState(null);
    const [editImagePreviewUrl, setEditImagePreviewUrl] = useState(null);
    const [deleteExistingImage, setDeleteExistingImage] = useState(false);

    // fetchPost 함수를 useCallback으로 감싸서 불필요한 재성성을 방지합니다.
    const fetchPost = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getPostById(postId);
            const postData = response.data;
            setPost(postData);
            
            setEditedTitle(postData.title || "");
            setEditedContent(postData.content);
            // 수정 모드 진입 시 기존 이미지 정보 설정
            if (postData.files && postData.files.length > 0) {
                setEditImagePreviewUrl(postData.files[0].fileUrl); // 기존 이미지 URL을 미리보기로 설정
            } else {
                setEditImagePreviewUrl(null); // 이미지가 없으면 null로 설정
            }
            setEditImageFile(null); // 새 파일 선택은 초기화
            setDeleteExistingImage(false); // 이미지 삭제 플래그 초기화

            if (location.state?.startEditing) {
                setIsEditing(true);
            }
            setError(null);
        } catch (err) { // 'err' 변수를 console.error에서 사용합니다.
            console.error("게시글 상세 정보 불러오기 실패:", err);
            setError("게시글을 불러올 수 없습니다.");
        } finally {
            setLoading(false);
        }
    }, [postId, location.state]); // 함수가 의존하는 값들을 배열에 명시합니다.

    // useEffect의 의존성 배열에 useCallback으로 감싼 fetchPost 함수를 추가합니다.
    useEffect(() => {
        fetchPost();
    }, [fetchPost]);
    
    // 현재 로그인한 사용자 정보 가져오기
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                // API를 통해 현재 사용자 정보 가져오기
                const response = await getCurrentUser();
                if (response && response.data) {
                    console.log('=== Current User from API ===');
                    console.log('User data:', response.data);
                    setCurrentUserId(response.data.id?.toString());
                    setCurrentUsername(response.data.username);
                }
            } catch (error) {
                console.error('Failed to fetch current user:', error);
                
                // API 호출 실패 시 localStorage 폴백
                const storedUserId = localStorage.getItem('userId') || 
                                    localStorage.getItem('user_id') || 
                                    localStorage.getItem('id');
                
                const storedUsername = localStorage.getItem('username') ||
                                      localStorage.getItem('userName') ||
                                      localStorage.getItem('user_name');
                
                console.log('=== LocalStorage Fallback ===');
                console.log('All localStorage keys:', Object.keys(localStorage));
                console.log('userId from localStorage:', storedUserId);
                console.log('username from localStorage:', storedUsername);
                
                if (storedUserId) {
                    setCurrentUserId(storedUserId);
                }
                if (storedUsername) {
                    setCurrentUsername(storedUsername);
                }
            }
        };
        
        fetchCurrentUser();
    }, []);
    
    // post 데이터에서 현재 사용자 정보 추출 (대안)
    useEffect(() => {
        if (post && !currentUserId) {
            // API 응답에 현재 사용자 정보가 포함되어 있는지 확인
            console.log('=== Post Data Check ===');
            console.log('Full post object:', post);
            console.log('Post author ID:', post.authorId);
            console.log('Post author Username:', post.authorUsername);
            console.log('Post author Email:', post.authorEmail);
        }
    }, [post, currentUserId]);
    
    // post와 currentUserId가 설정되면 디버깅 정보 출력
    useEffect(() => {
        if (post && currentUserId) {
            console.log('Post Author ID:', post.authorId);
            console.log('Post Author Username:', post.authorUsername);
            console.log('Current User ID:', currentUserId);
            console.log('Type of post.authorId:', typeof post.authorId);
            console.log('Type of currentUserId:', typeof currentUserId);
            
            const isAuthor = post.authorId && currentUserId && 
                           (post.authorId === Number(currentUserId) || 
                            post.authorId.toString() === currentUserId.toString());
            console.log('Is Author:', isAuthor);
        }
    }, [post, currentUserId]);
    
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            await createComment(postId, { content: newComment });
            setNewComment("");
            fetchPost(); // 댓글 목록 새로고침
        } catch (err) {
            console.error("댓글 작성 실패:", err);
            alert("댓글 작성에 실패했습니다.");
        }
    };

    const handleDeletePost = async () => {
        if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
            try {
                await deletePost(postId);
                alert("게시글이 성공적으로 삭제되었습니다.");
                navigate('/main/community');
            } catch (err) {
                console.error("게시글 삭제 실패:", err);
                alert("게시글 삭제에 실패했습니다. 작성자만 삭제할 수 있습니다.");
            }
        }
    };

    // 편집 모드 시작
    const handleStartEdit = () => {
        setIsEditing(true);
        // 기존 게시물 데이터로 편집 상태 초기화
        setEditedTitle(post.title || "");
        setEditedContent(post.content);
        setDeleteExistingImage(false);
        setEditImageFile(null);
        // 기존 이미지가 있으면 미리보기로 설정
        if (post.files && post.files.length > 0) {
            setEditImagePreviewUrl(post.files[0].fileUrl);
        } else {
            setEditImagePreviewUrl(null);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        // 수정 취소 시 상태 초기화 (fetchPost가 다시 호출되므로 별도 리셋 불필요)
        fetchPost(); 
    };

    // 이미지 선택 핸들러
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (editImagePreviewUrl) {
                // 이전 미리보기 URL이 blob URL일 경우에만 해제
                if (editImagePreviewUrl.startsWith('blob:')) {
                    URL.revokeObjectURL(editImagePreviewUrl);
                }
            }
            setEditImageFile(file); // 새 파일 설정
            setEditImagePreviewUrl(URL.createObjectURL(file)); // 새 미리보기 URL 설정
            setDeleteExistingImage(false); // 새 이미지 업로드 시, 기존 이미지 삭제 의사 철회
        }
    };

    // 이미지 삭제 핸들러
    const handleImageRemove = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (editImagePreviewUrl) {
            // 로컬에서 생성된 미리보기 URL인 경우에만 해제
            if (editImagePreviewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(editImagePreviewUrl);
            }
        }
        setEditImageFile(null);
        setEditImagePreviewUrl(null);
        
        // input file 초기화
        const fileInput = document.getElementById('editFileInput');
        if (fileInput) {
            fileInput.value = '';
        }
        
        // 기존 이미지가 있었음을 표시
        if (post.files && post.files.length > 0) {
            setDeleteExistingImage(true);
        }
    };

    const handleUpdatePost = async () => {
        try {
            const updateData = {
                title: editedTitle,
                content: editedContent,
                file: editImageFile, // 새 파일 (없으면 null)
                deleteFile: deleteExistingImage // 기존 파일 삭제 여부
            };
            
            await updatePost(postId, updateData);
            setIsEditing(false);
            
            // 상태 초기화
            setEditImageFile(null);
            setEditImagePreviewUrl(null);
            setDeleteExistingImage(false);
            
            await fetchPost(); // 수정된 내용으로 다시 불러오기
            alert("게시글이 성공적으로 수정되었습니다.");
        } catch (err) {
            console.error("게시글 수정 실패:", err);
            alert("게시글 수정에 실패했습니다.");
        }
    };
    
    // 내용 글자 수 계산
    const contentLength = editedContent.length;

    // --- 스타일 객체 ---
    // (CommunityCreatePage.jsx, CommunityStartPage.jsx와 유사한 스타일 적용)
    const styles = {
        container: {
            maxWidth: '412px',
            margin: '0 auto',
            backgroundColor: '#f9fafb', // 라이트 모드 배경
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            paddingBottom: '80px' // 하단 네비게이션바 공간 확보
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
            color: '#111827' // 어두운 텍스트
        },
        contentArea: {
            flex: 1,
            padding: '20px 16px',
            overflowY: 'auto'
        },
        // 게시글 상세 내용 스타일
        postContainer: {
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            border: '1px solid #f3f4f6',
            marginBottom: '16px'
        },
        authorInfo: {
            display: 'flex',
            alignItems: 'flex-start',
            padding: '16px',
            borderBottom: '1px solid #e5e7eb'
        },
        authorName: {
            fontSize: '14px',
            fontWeight: '600',
            color: '#6b7280',
            textAlign: 'left',
            margin: '0px'
        },
        postDate: {
            fontSize: '12px',
            color: '#9ca3af',
            textAlign: 'left',
            margin: '0px'
        },
        postContentWrapper: {
            padding: '16px',
            textAlign: 'left' // 좌측 정렬
        },
        postTitle: {
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#111827',
            margin: '0px',
            marginBottom: '8px',
            textAlign: 'left' // 좌측 정렬
        },
        postContent: {
            fontSize: '16px',
            color: '#374151',
            whiteSpace: 'pre-wrap',
            lineHeight: '1.6',
            textAlign: 'left' // 좌측 정렬
        },
        postImageWrapper: {
            height: '300px', // 고정 높이
            backgroundColor: '#f9fafb', // 배경색
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            marginTop: '16px',
            borderRadius: '12px'
        },
        postImage: {
            width: '100%',
            height: '100%',
            objectFit: 'contain' // 이미지 전체 보이게
        },

        // 편집 모드 스타일 (CommunityCreatePage와 유사하게)
        editContainer: {
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
        },
        imageUploadLabel: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '165px', // CommunityCreatePage와 동일
            position: 'relative',
            backgroundColor: 'white',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            overflow: 'hidden',
            border: '2px dashed #e5e7eb',
        },
        imagePreview: {
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block'
        },
        imageRemoveButton: {
            position: 'absolute',
            top: '5px', // CreatePage와 동일
            right: '10px', // CreatePage와 동일
            width: '25px', // CreatePage와 동일
            height: '25px', // CreatePage와 동일
            borderRadius: '50%',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            zIndex: 5
        },
        imageChangeButton: {
             cursor: 'pointer',
             textAlign: 'center',
             padding: '8px 12px',
             backgroundColor: '#0D986A',
             color: 'white',
             fontWeight: '500',
             borderRadius: '8px',
             display: 'inline-block',
             marginTop: '12px'
        },
        imageRemovedText: {
            textAlign: 'center',
            padding: '12px',
            color: '#6b7280',
            fontSize: '14px',
            backgroundColor: '#f9fafb',
            borderRadius: '8px'
        },
        inputBox: {
            backgroundColor: 'white',
            padding: '16px',
            borderRadius: '12px'
        },
        label: {
            display: 'block',
            fontSize: '16px',
            fontWeight: '600',
            color: '#6b7280',
            marginBottom: '8px',
            textAlign: 'left'
        },
        titleInput: {
            width: '100%',
            padding: '12px 0',
            fontSize: '16px',
            fontWeight: '400',
            color: '#374151',
            border: 'none',
            borderBottom: '1px solid #cacbce39',
            outline: 'none',
            backgroundColor: 'transparent',
            textAlign: 'left'
        },
        contentInput: {
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
            textAlign: 'left'
        },
        charCount: {
            textAlign: 'right',
            marginTop: '8px',
            fontSize: '14px',
            color: '#9ca3af'
        },

        // 댓글 영역 스타일
        commentsContainer: {
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '16px',
            marginTop: '16px',
            border: '1px solid #f3f4f6',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        },
        commentsTitle: {
            fontSize: '18px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '16px',
            textAlign: 'left'
        },
        commentTitleDivider: {
            height: '1px',
            backgroundColor: '#e5e7eb',
            marginBottom: '0'
        },
        commentItem: {
            padding: '16px 0',
            textAlign: 'left'
        },
        commentAuthor: {
            fontSize: '14px',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '8px',
            textAlign: 'left'
        },
        commentText: {
            fontSize: '15px',
            color: '#374151',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            marginBottom: '8px',
            textAlign: 'left'
        },
        commentDate: {
            fontSize: '12px',
            color: '#9ca3af',
            textAlign: 'left'
        },
        commentDivider: {
            height: '1px',
            backgroundColor: '#e5e7eb',
            margin: '0'
        },
        noComments: {
            textAlign: 'center',
            color: '#9ca3af',
            fontSize: '14px',
            padding: '16px 0'
        },
        // 댓글 입력창 스타일
        commentInputContainer: {
            position: 'sticky',
            bottom: '80px', // 하단 네비게이션바 위에 위치
            backgroundColor: 'white',
            borderTop: '1px solid #e5e7eb',
            padding: '12px 16px',
            zIndex: 90 // 헤더(100)보다는 낮게
        },
        commentForm: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        },
        commentInput: {
            flex: 1,
            padding: '10px 16px',
            fontSize: '14px',
            backgroundColor: '#f3f4f6',
            border: '1px solid #d1d5db',
            borderRadius: '9999px',
            color: '#111827',
            outline: 'none'
        },
        commentSubmitButton: {
            padding: '8px',
            backgroundColor: '#0D986A',
            borderRadius: '50%',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s'
        },
        // 하단 네비게이션 바
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

    if (loading) return <div style={{ ...styles.container, justifyContent: 'center', alignItems: 'center' }}>
        <style>{fontStyles}</style>
        <div style={{ color: '#0D986A' }}>🌱 게시글을 불러오는 중...</div>
    </div>;
    
    if (error || !post) return <div style={{ ...styles.container, justifyContent: 'center', alignItems: 'center' }}>
        <style>{fontStyles}</style>
        <div style={{ color: '#dc2626' }}>{error}</div>
    </div>;

    // 현재 이미지가 있는지 확인 (기존 이미지 또는 새롭게 첨부된 이미지)
    const currentImageUrl = editImagePreviewUrl || (post.files && post.files.length > 0 && !deleteExistingImage ? post.files[0].fileUrl : null);

    return (
        <div style={styles.container}>
            <style>{fontStyles}</style>
            
            {/* 상단바 */}
            <header style={styles.header}>
                <div style={styles.logo}>
                    <button 
                        onClick={() => isEditing ? handleCancelEdit() : navigate(-1)} 
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                            display: 'flex',
                            alignItems: 'center',
                            color: '#374151'
                        }}
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <span style={{color: '#111827'}}>{isEditing ? "게시물 수정" : "게시물"}</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center'}}>
                    {(() => {
                        // userId 또는 username으로 비교
                        const isAuthorById = post && currentUserId && post.authorId && (
                            Number(post.authorId) === Number(currentUserId)
                        );
                        
                        const isAuthorByUsername = post && currentUsername && post.authorUsername && (
                            post.authorUsername === currentUsername
                        );
                        
                        const isAuthor = isAuthorById || isAuthorByUsername;
                        
                        console.log('=== Render Authorization Check ===');
                        console.log('post.authorId:', post?.authorId, 'currentUserId:', currentUserId);
                        console.log('post.authorUsername:', post?.authorUsername, 'currentUsername:', currentUsername);
                        console.log('isAuthorById:', isAuthorById);
                        console.log('isAuthorByUsername:', isAuthorByUsername);
                        console.log('Final isAuthor:', isAuthor);
                        
                        return isAuthor ? (
                            <>
                                {isEditing ? (
                                    <button 
                                        onClick={handleUpdatePost} 
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: '15px',
                                            fontWeight: '600',
                                            color: '#0D986A'
                                        }}
                                    >
                                        저장
                                    </button>
                                ) : (
                                    <>
                                        <button 
                                            onClick={handleStartEdit} 
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontSize: '15px',
                                                fontWeight: '400',
                                                color: '#6b7280'
                                            }}
                                        >
                                            수정
                                        </button>
                                        <button 
                                            onClick={handleDeletePost} 
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontSize: '15px',
                                                fontWeight: '400',
                                                color: '#ef4444' // red-500
                                            }}
                                        >
                                            삭제
                                        </button>
                                    </>
                                )}
                            </>
                        ) : null;
                    })()}
                </div>
            </header>

            {/* 메인 컨텐츠 */}
            <main style={styles.contentArea}>
                {isEditing ? (
                    // --- 수정 모드 ---
                    <div style={styles.editContainer}>
                        {/* 사진첨부 및 미리보기 영역 */}
                        <label
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '165px',
                                
                                position: 'relative',
                                backgroundColor: 'white',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                overflow: 'hidden',
                                
                                ...(currentImageUrl ? {
                                    border: 'none',
                                    padding: 0,
                                } : {
                                    border: '2px dashed #e5e7eb',
                                })
                            }}
                            onMouseEnter={(e) => {
                                if (!currentImageUrl) {
                                    e.currentTarget.style.borderColor = '#0D986A';
                                    e.currentTarget.style.backgroundColor = '#f0fdf4';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!currentImageUrl) {
                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                    e.currentTarget.style.backgroundColor = 'white';
                                }
                            }}
                        >
                            {currentImageUrl ? (
                                // 이미지가 있을 때: 미리보기 (CreatePage와 동일 구조)
                                <>
                                    <img 
                                        src={currentImageUrl} 
                                        alt="미리보기" 
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain',
                                            display: 'block',
                                            backgroundColor: '#f9fafb'
                                        }}
                                    />
                                    <button
                                        onClick={handleImageRemove}
                                        style={styles.imageRemoveButton}
                                    >
                                        <img 
                                            src={deleteIcon} 
                                            alt="Remove" 
                                            style={{ width: '100%', height: '100%' }}
                                        />
                                    </button>
                                </>
                            ) : (
                                // 이미지가 없을 때: 사진첨부 아이콘
                                <>
                                    <ImageIcon size={40} color="#9ca3af" style={{ marginBottom: '12px' }} />
                                    <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
                                        {deleteExistingImage ? "이미지 삭제됨" : "사진첨부"}
                                    </span>
                                </>
                            )}
                            
                            {/* 파일 입력란은 항상 숨겨진 상태로 유지 */}
                            <input 
                                id="editFileInput"
                                type="file" 
                                accept="image/*" 
                                style={{ display: 'none' }}
                                onChange={handleImageChange}
                            />
                        </label>

                        {/* 제목 입력 */}
                        <div style={styles.inputBox}>
                            <label style={styles.label}>제목</label>
                            <input
                                type="text"
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                                placeholder="제목을 입력해주세요."
                                style={styles.titleInput}
                            />
                        </div>

                        {/* 내용 입력 */}
                        <div style={styles.inputBox}>
                            <label style={styles.label}>내용</label>
                            <textarea
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                                placeholder="내용을 입력해주세요."
                                style={styles.contentInput}
                            />
                            {/* 글자 수 */}
                            <div style={styles.charCount}>
                                <span style={{ color: contentLength > 2000 ? '#dc2626' : '#0D986A', fontWeight: '600' }}>
                                    {contentLength}
                                </span>
                                /2000
                            </div>
                        </div>
                    </div>

                ) : (
                    // --- 조회 모드 ---
                    <div style={styles.postContainer}>
                        {/* 작성자 정보 */}
                        <div style={styles.authorInfo}>
                            <div>
                                {post.title && <h3 style={styles.postTitle}>{post.title}</h3>}
                                <p style={styles.authorName}>{post.authorUsername}</p>
                                <p style={styles.postDate}>{new Date(post.createdAt).toLocaleString('ko-KR')}</p>
                            </div>
                        </div>
                        
                        {/* 게시글 본문 */}
                        <div style={styles.postContentWrapper}>
                            <p style={styles.postContent}>{post.content}</p>
                        </div>

                        {/* 첨부 이미지 */}
                        {post.files && post.files.length > 0 && (
                            <div style={{padding: '0 16px 16px 16px'}}>
                                <div style={styles.postImageWrapper}>
                                    <img 
                                        src={post.files[0].fileUrl}
                                        alt="게시물 이미지" 
                                        style={styles.postImage} 
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}
                
                {/* 댓글 목록 (수정 모드 아닐 때만 표시) */}
                {!isEditing && (
                    <div style={styles.commentsContainer}>
                        <h3 style={styles.commentsTitle}>댓글 {post.comments?.length || 0}개</h3>
                        <div style={styles.commentTitleDivider}></div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {post.comments?.length > 0 ? post.comments.map(comment => (
                                <div key={comment.id}>
                                    <div style={styles.commentItem}>
                                        <p style={styles.commentAuthor}>{comment.username}</p>
                                        <p style={styles.commentText}>{comment.content}</p>
                                        <p style={styles.commentDate}>{new Date(comment.createdAt).toLocaleDateString('ko-KR')}</p>
                                    </div>
                                    <div style={styles.commentDivider}></div>
                                </div>
                            )) : (
                                <p style={styles.noComments}>첫 댓글을 작성해보세요!</p>
                            )}
                        </div>
                    </div>
                )}
            </main>
            
            {/* 댓글 입력창 (수정 모드 아닐 때만 표시) */}
            {!isEditing && (
                <footer style={styles.commentInputContainer}>
                    <form onSubmit={handleCommentSubmit} style={styles.commentForm}>
                        <input 
                            type="text" 
                            value={newComment} 
                            onChange={(e) => setNewComment(e.target.value)} 
                            placeholder="댓글 달기..." 
                            style={styles.commentInput} 
                        />
                        <button 
                            type="submit" 
                            style={{...styles.commentSubmitButton, opacity: !newComment.trim() ? 0.5 : 1}} 
                            disabled={!newComment.trim()}
                        >
                            <SendIcon />
                        </button>
                    </form>
                </footer>
            )}

            {/* 하단 네비게이션 바 */}
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

export default CommunityPostDetailPage;