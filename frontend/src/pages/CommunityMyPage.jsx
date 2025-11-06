import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Bell, Home, Users, Heart } from "lucide-react";
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
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
}
`;

// 🎨 스타트페이지 스타일 PostCard (썸네일 작게)
const PostCard = ({ post, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: 'white',
        padding: '16px',
        marginBottom: '12px',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        cursor: 'pointer',
        transition: 'all 0.2s',
        border: '1px solid #f3f4f6',
        display: 'flex',
        gap: '12px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.12)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* 좌측: 텍스트 영역 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* 제목 */}
        <h3 style={{
          fontSize: '16px',
          fontWeight: '700',
          color: '#111827',
          marginBottom: '8px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          textAlign: 'left'
        }}>
          {post.title || "제목 없음"}
        </h3>
        
        {/* 내용 미리보기 */}
        <p style={{
          fontSize: '14px',
          color: '#6b7280',
          marginBottom: '12px',
          lineHeight: '1.5',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textAlign: 'left'
        }}>
          {post.content || "내용 없음"}
        </p>
        
        {/* 하단 정보 바 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '13px',
          color: '#9ca3af'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Heart 
              size={16} 
              fill={post.liked ? '#0D986A' : 'none'} 
              color={post.liked ? '#0D986A' : '#9ca3af'} 
            />
            {post.likesCount || 0}
          </span>
          <span>💬 {post.commentCount || 0}</span>
          <span style={{ marginLeft: 'auto' }}>
            {new Date(post.createdAt).toLocaleDateString('ko-KR', { 
              month: 'short', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </div>
      
      {/* 우측: 썸네일 이미지 (있는 경우에만) */}
      {post.files && post.files.length > 0 && (
        <div style={{
          width: '80px',
          height: '80px',
          flexShrink: 0,
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: '#f3f4f6'
        }}>
          <img 
            src={post.files[0].fileUrl}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            onError={(e) => {
              e.target.parentElement.style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  );
};

// 🎨 댓글 카드 (게시글 제목 포함)
const CommentCard = ({ comment, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: 'white',
        padding: '16px',
        marginBottom: '12px',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        cursor: 'pointer',
        transition: 'all 0.2s',
        border: '1px solid #f3f4f6'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.12)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* 게시글 제목 */}
      <div style={{ 
        fontSize: '13px', 
        color: '#0D986A', 
        fontWeight: '600', 
        marginBottom: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        📌 {comment.postTitle}
      </div>
      
      {/* 댓글 내용 */}
      <p style={{ 
        fontSize: '14px', 
        color: '#374151', 
        marginBottom: '12px', 
        lineHeight: '1.6',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
        {comment.content}
      </p>
      
      {/* 날짜 */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        fontSize: '12px', 
        color: '#9ca3af' 
      }}>
        <span>
          {new Date(comment.createdAt).toLocaleDateString('ko-KR', { 
            month: 'short', 
            day: 'numeric' 
          })}
        </span>
      </div>
    </div>
  );
};

function CommunityMyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("posts");
  const [myPosts, setMyPosts] = useState([]);
  const [myComments, setMyComments] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    username: '',
    nickname: ''
  });

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // 사용자 정보 가져오기
  const fetchUserInfo = async () => {
    try {
      const response = await apiClient.get('/api/auth/me');
      setUserInfo({
        username: response.data.username || 'myusername',
      });
    } catch (error) {
      console.error("사용자 정보를 불러오는 데 실패했습니다.", error);
      if (error.response?.status === 401) {
        alert('로그인이 필요합니다.');
        navigate('/auth/login');
      }
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case "posts":
          await fetchMyPosts();
          break;
        case "comments":
          await fetchMyComments();
          break;
        case "liked":
          await fetchLikedPosts();
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("데이터를 불러오는 데 실패했습니다.", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyPosts = async () => {
    try {
      const response = await apiClient.get('/api/posts/my');
      setMyPosts(response.data);
    } catch (error) {
      console.error("내 게시물을 불러오는 데 실패했습니다.", error);
      if (error.response?.status === 401) {
        alert('로그인이 필요합니다.');
        navigate('/auth/login');
      }
      setMyPosts([]);
    }
  };

  const fetchMyComments = async () => {
    try {
      const response = await apiClient.get('/api/comments/my');
      setMyComments(response.data);
    } catch (error) {
      console.error("내 댓글을 불러오는 데 실패했습니다.", error);
      if (error.response?.status === 401) {
        alert('로그인이 필요합니다.');
        navigate('/auth/login');
      }
      setMyComments([]);
    }
  };

  const fetchLikedPosts = async () => {
    try {
      const response = await apiClient.get('/api/posts/liked');
      setLikedPosts(response.data);
    } catch (error) {
      console.error("좋아요한 게시물을 불러오는 데 실패했습니다.", error);
      if (error.response?.status === 401) {
        alert('로그인이 필요합니다.');
        navigate('/auth/login');
      }
      setLikedPosts([]);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '48px 0',
          color: '#0D986A'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '3px solid #d1fae5',
            borderTop: '3px solid #0D986A',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        </div>
      );
    }

    switch (activeTab) {
      case "posts":
        return (
          <div>
            {myPosts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: '#9ca3af' }}>
                작성한 글이 없습니다.
              </div>
            ) : (
              myPosts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post}
                  onClick={() => navigate(`/main/community/post/${post.id}`)}
                />
              ))
            )}
          </div>
        );
      case "comments":
        return (
          <div>
            {myComments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: '#9ca3af' }}>
                작성한 댓글이 없습니다.
              </div>
            ) : (
              myComments.map((comment) => (
                <CommentCard 
                  key={comment.id} 
                  comment={comment}
                  onClick={() => navigate(`/main/community/post/${comment.postId}`)}
                />
              ))
            )}
          </div>
        );
      case "liked":
        return (
          <div>
            {likedPosts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: '#9ca3af' }}>
                좋아요한 글이 없습니다.
              </div>
            ) : (
              likedPosts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post}
                  onClick={() => navigate(`/main/community/post/${post.id}`)}
                />
              ))
            )}
          </div>
        );
      default:
        return null;
    }
  };

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
    profileSection: {
      backgroundColor: 'white',
      padding: '24px 16px',
      margin: '16px 16px 0 16px',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    profileImage: {
      width: '64px',
      height: '64px',
      borderRadius: '50%',
      backgroundColor: '#e5e7eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px'
    },
    tabContainer: {
      display: 'flex',
      justifyContent: 'space-around',
      backgroundColor: 'white',
      padding: '0 16px',
      margin: '16px 16px 0 16px',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
    },
    tab: {
      flex: 1,
      padding: '16px 8px',
      textAlign: 'center',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
      backgroundColor: 'white',   // 1. 배경을 흰색으로
      border: 'none',             // 2. 버튼의 기본 테두리(위, 아래, 양옆)를 모두 제거
      outline: 'none',            // 3. 클릭 시 생기는 검은색 테두리(outline) 제거
      borderBottom: '2px solid transparent' 
    },
    contentSection: {
      padding: '16px',
      flex: 1
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
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
      {/* 상단바 */}
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
          <span>마이페이지</span>
        </div>
      </div>

      {/* 프로필 섹션 */}
      <div style={styles.profileSection}>
        <div style={styles.profileImage}>
          👤
        </div>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: '0px', paddingBottom:'14px'}}>
            {userInfo.username || 'myusername'}
          </h2>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div style={styles.tabContainer}>
        <button
          onClick={() => setActiveTab("posts")}
          style={{
            ...styles.tab,
            color: activeTab === "posts" ? '#0D986A' : '#6b7280',
            borderBottomColor: activeTab === "posts" ? '#0D986A' : 'transparent'
          }}
        >
          나의 글
        </button>
        <button
          onClick={() => setActiveTab("comments")}
          style={{
            ...styles.tab,
            color: activeTab === "comments" ? '#0D986A' : '#6b7280',
            borderBottomColor: activeTab === "comments" ? '#0D986A' : 'transparent'
          }}
        >
          작성한 댓글
        </button>
        <button
          onClick={() => setActiveTab("liked")}
          style={{
            ...styles.tab,
            color: activeTab === "liked" ? '#0D986A' : '#6b7280',
            borderBottomColor: activeTab === "liked" ? '#0D986A' : 'transparent'
          }}
        >
          좋아요한 글
        </button>
      </div>

      {/* 콘텐츠 렌더링 */}
      <div style={styles.contentSection}>
        {renderContent()}
      </div>

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
              color: location.pathname.includes('/community') && !location.pathname.includes('/mypage') ? '#0D986A' : '#6b7280' 
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

export default CommunityMyPage;