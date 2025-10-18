// useCallback 훅을 react에서 추가로 import 합니다.
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getPostById, createComment, deletePost, updatePost } from "../api/community";

const Icon = ({ name, className = "" }) => {
    const icons = { back: "←", send: "➤" };
    return <span className={`text-xl ${className}`}>{icons[name] || name}</span>;
};

function CommunityPostDetailPage() {
   const { postId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newComment, setNewComment] = useState("");

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
    
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            await createComment(postId, { content: newComment });
            setNewComment("");
            fetchPost();
        } catch (err) { // 'err' 변수를 console.error에서 사용합니다.
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

    // 편집 모드 시작 시 기존 이미지 미리보기 설정
    const handleStartEdit = () => {
        setIsEditing(true);
        setDeleteExistingImage(false);
        setEditImageFile(null);
        setEditImagePreviewUrl(null);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedTitle(post.title || "");
        setEditedContent(post.content);
        // 이미지 편집 상태 초기화
        setEditImageFile(null);
        if (editImagePreviewUrl) {
            URL.revokeObjectURL(editImagePreviewUrl);
        }
        setEditImagePreviewUrl(null);
        setDeleteExistingImage(false);
    };

    //  이미지 선택 핸들러
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (editImagePreviewUrl) {
                URL.revokeObjectURL(editImagePreviewUrl);
            }
            setEditImageFile(file);
            setEditImagePreviewUrl(URL.createObjectURL(file));
            setDeleteExistingImage(false); // 새 이미지 선택 시 삭제 플래그 해제
        }
    };

    // 이미지 삭제 핸들러
    const handleImageRemove = () => {
        if (editImagePreviewUrl) {
            URL.revokeObjectURL(editImagePreviewUrl);
        }
        setEditImageFile(null);
        setEditImagePreviewUrl(null);
        
        // input file 초기화
        const fileInput = document.getElementById('editFileInput');
        if (fileInput) {
            fileInput.value = '';
        }
        
        // 기존 이미지가 있었다면 삭제 플래그 설정
        if (post.files && post.files.length > 0) {
            setDeleteExistingImage(true);
        }
    };



    const handleUpdatePost = async () => {
        try {
            const updateData = {
                title: editedTitle,
                content: editedContent,
                file: editImageFile,
                deleteFile: deleteExistingImage
            };
            
            await updatePost(postId, updateData);
            setIsEditing(false);
            
            // ✅ [추가] 이미지 상태 초기화
            if (editImagePreviewUrl) {
                URL.revokeObjectURL(editImagePreviewUrl);
            }
            setEditImageFile(null);
            setEditImagePreviewUrl(null);
            setDeleteExistingImage(false);
            
            await fetchPost();
            alert("게시글이 성공적으로 수정되었습니다.");
        } catch (err) {
            console.error("게시글 수정 실패:", err);
            alert("게시글 수정에 실패했습니다.");
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-green-500">🌱 게시글을 불러오는 중...</div>;
    if (error || !post) return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-500">{error}</div>;

    return (
        <div className="min-h-screen flex flex-col bg-gray-900 max-w-sm mx-auto shadow-2xl">
            {/* ... 나머지 JSX 코드는 이전과 동일합니다 ... */}
            <header className="sticky top-0 flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-900 z-10">
                <div className="flex items-center">
                    <button 
                        onClick={() => isEditing ? handleCancelEdit() : navigate(-1)} 
                        className="text-2xl font-bold text-white hover:text-gray-400 transition-colors"
                    >
                        <Icon name="back" />
                    </button>
                    <h2 className="text-xl font-bold text-white ml-4">{isEditing ? "게시물 수정" : "게시물"}</h2>
                </div>
                
                <div className="flex items-center space-x-3">
                    {isEditing ? (
                        <button onClick={handleUpdatePost} className="text-sm font-semibold text-green-500 hover:text-green-400">저장</button>
                    ) : (
                        <>
                            <button onClick={handleStartEdit} className="text-sm font-semibold text-gray-200 hover:text-white">수정</button>
                            <button onClick={handleDeletePost} className="text-sm font-semibold text-red-500 hover:text-red-400">삭제</button>
                        </>
                    )}
                </div>
            </header>

            <main className="flex-1 overflow-y-auto pb-20">
                <div className="p-4 flex items-center">
                    <img className="w-10 h-10 rounded-full object-cover mr-3 border border-green-500" src={"/default-avatar-dark.png"} alt={`${post.authorUsername}님의 아바타`} />
                    <div>
                        <p className="font-semibold text-white">@{post.authorUsername}</p>
                        <p className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleString('ko-KR')}</p>
                    </div>
                </div>

                {isEditing ? (
                    <div className="px-4 pb-4 space-y-3">
                        <input
                            type="text"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            placeholder="제목 (선택 사항)"
                            className="w-full bg-gray-800 text-gray-200 p-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            placeholder="내용을 입력하세요"
                            className="w-full h-32 bg-gray-800 text-gray-200 p-2 border border-gray-600 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                        />

                        {/* ✅ [추가] 이미지 편집 영역 */}
                        <div className="space-y-2">
                            {/* 새로 선택한 이미지 미리보기 */}
                            {editImagePreviewUrl && (
                                <div className="relative">
                                    <img 
                                        src={editImagePreviewUrl} 
                                        alt="새 이미지 미리보기" 
                                        className="w-full rounded-lg"
                                        style={{ maxHeight: "300px", objectFit: "cover" }}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleImageRemove}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                            
                            {/* 기존 이미지 (삭제되지 않은 경우에만 표시) */}
                            {!editImagePreviewUrl && !deleteExistingImage && post.files && post.files.length > 0 && (
                                <div className="relative">
                                    <img 
                                        src={post.files[0].fileUrl} 
                                        alt="현재 이미지" 
                                        className="w-full rounded-lg"
                                        style={{ maxHeight: "300px", objectFit: "cover" }}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleImageRemove}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                            
                            {/* 이미지가 삭제된 상태 표시 */}
                            {!editImagePreviewUrl && deleteExistingImage && (
                                <div className="text-center py-4 text-gray-500 text-sm bg-gray-800 rounded-lg">
                                    이미지가 삭제됩니다
                                </div>
                            )}
                            
                            {/* 이미지 추가 버튼 */}
                            <label className="cursor-pointer text-center py-2 px-4 bg-gray-800 text-green-400 font-semibold rounded-lg hover:bg-gray-700 transition-colors inline-block">
                                <span className="flex items-center justify-center space-x-2">
                                    <span className="text-xl">📷</span>
                                    <span>{editImagePreviewUrl || (post.files && post.files.length > 0 && !deleteExistingImage) ? "이미지 변경" : "이미지 추가"}</span>
                                </span>
                                <input 
                                    id="editFileInput"
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={handleImageChange}
                                />
                            </label>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="px-4 pb-4">
                            {post.title && <h3 className="text-lg font-bold text-gray-200 mb-2">{post.title}</h3>}
                            <p className="text-gray-300 whitespace-pre-wrap">{post.content}</p>
                        </div>
                        {post.files && post.files.length > 0 && (
                            <div className="post-media mb-3 rounded-lg overflow-hidden border border-gray-700">
                                <img 
                                    src={post.files[0].fileUrl}  // ✅ fileUrl 사용 (현재 코드 맞음)
                                    alt="게시물 이미지" 
                                    style={{ width: "100%", height: "200px", objectFit: "cover" }} 
                                />
                            </div>
                        )}
                    </>
                )}
                
                <div className="border-t border-gray-800 px-4 pt-4">
                    <h3 className="font-semibold text-base text-white mb-3">댓글 {post.comments?.length || 0}개</h3>
                    <div className="space-y-4">
                        {post.comments?.length > 0 ? post.comments.map(comment => (
                            <div key={comment.id} className="flex items-start">
                                <img src={"/default-avatar-dark.png"} alt="commenter avatar" className="w-8 h-8 rounded-full mr-3 border border-gray-600" />
                                <div className="bg-gray-800 rounded-lg p-2 flex-1">
                                    <div className="flex items-baseline space-x-2">
                                        <p className="text-sm font-semibold text-green-400">@{comment.username}</p>
                                        <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString('ko-KR')}</p>
                                    </div>
                                    <p className="text-sm text-gray-300 mt-1">{comment.content}</p>
                                </div>
                            </div>
                        )) : (
                            <p className="text-center text-gray-500 text-sm py-4">첫 댓글을 작성해보세요!</p>
                        )}
                    </div>
                </div>
            </main>
            
            <footer className="sticky bottom-0 bg-gray-900 border-t border-gray-800 p-2">
                <form onSubmit={handleCommentSubmit} className="flex items-center space-x-2">
                    <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="댓글 달기..." className="flex-1 p-2 text-sm bg-gray-800 border border-gray-700 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-green-500" />
                    <button type="submit" className="p-2 bg-green-500 rounded-full text-white hover:bg-green-600 transition-colors disabled:bg-gray-600" disabled={!newComment.trim()}>
                        <Icon name="send" />
                    </button>
                </form>
            </footer>
        </div>
    );
}

export default CommunityPostDetailPage;

