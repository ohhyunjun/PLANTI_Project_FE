import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Bell, Home, User, PenSquare } from "lucide-react";

// 백엔드 API URL
const API_BASE = import.meta.env.VITE_BACKEND_API_BASE_URL;

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

  // API: GET http://localhost:8080/api/auth/me
  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      console.log('토큰 확인:', token ? '존재' : '없음');
      
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        method: 'GET',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('사용자 정보 응답 상태:', res.status);
      
      if (!res.ok) {
        console.error("사용자 정보 조회 실패:", res.status);
        return;
      }
      
      const data = await res.json();
      console.log('사용자 정보:', data);
      
      setUserInfo({
        username: data.username || 'myusername',
        nickname: data.nickname || '사용자'
      });
    } catch (error) {
      console.error("사용자 정보를 불러오는 데 실패했습니다.", error);
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

  // API: GET http://localhost:8080/api/community/my-posts 또는 /api/posts/my
  const fetchMyPosts = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      console.log('내 게시물 조회 시작, 토큰:', token ? '존재' : '없음');
      
      // 다양한 엔드포인트 시도
      const endpoints = [
        `${API_BASE}/api/community/my-posts`,
        `${API_BASE}/api/posts/my`,
        `${API_BASE}/api/community/posts/my`,
        `${API_BASE}/api/posts/me`
      ];
      
      let data = null;
      let successEndpoint = null;
      
      for (const endpoint of endpoints) {
        try {
          console.log('시도 중인 엔드포인트:', endpoint);
          
          const res = await fetch(endpoint, {
            method: 'GET',
            credentials: "include",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          
          console.log(`${endpoint} 응답 상태:`, res.status);
          
          if (res.ok) {
            data = await res.json();
            successEndpoint = endpoint;
            console.log('성공한 엔드포인트:', endpoint);
            console.log('받은 데이터:', data);
            break;
          }
        } catch (err) {
          console.log(`${endpoint} 실패:`, err.message);
          continue;
        }
      }
      
      if (!data) {
        console.error('모든 엔드포인트 시도 실패');
        alert('게시물을 불러올 수 없습니다. 백엔드 API를 확인해주세요.');
        setMyPosts([]);
        return;
      }
      
      // 데이터 구조 확인
      console.log('데이터 타입:', typeof data);
      console.log('배열 여부:', Array.isArray(data));
      
      if (Array.isArray(data)) {
        setMyPosts(data);
      } else if (data.data && Array.isArray(data.data)) {
        setMyPosts(data.data);
      } else if (data.content && Array.isArray(data.content)) {
        setMyPosts(data.content);
      } else {
        console.error('예상치 못한 데이터 구조:', data);
        setMyPosts([]);
      }
      
    } catch (error) {
      console.error("내 게시물을 불러오는 데 실패했습니다.", error);
      setMyPosts([]);
    }
  };

  // API: GET http://localhost:8080/api/community/my-comments
  const fetchMyComments = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      console.log('내 댓글 조회 시작');
      
      const endpoints = [
        `${API_BASE}/api/community/my-comments`,
        `${API_BASE}/api/comments/my`,
        `${API_BASE}/api/community/comments/my`
      ];
      
      let data = null;
      
      for (const endpoint of endpoints) {
        try {
          const res = await fetch(endpoint, {
            method: 'GET',
            credentials: "include",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (res.ok) {
            data = await res.json();
            console.log('댓글 데이터:', data);
            break;
          }
        } catch (err) {
          continue;
        }
      }
      
      if (!data) {
        console.error('댓글 조회 실패');
        setMyComments([]);
        return;
      }
      
      if (Array.isArray(data)) {
        setMyComments(data);
      } else if (data.data && Array.isArray(data.data)) {
        setMyComments(data.data);
      } else {
        setMyComments([]);
      }
      
    } catch (error) {
      console.error("내 댓글을 불러오는 데 실패했습니다.", error);
      setMyComments([]);
    }
  };

  // API: GET http://localhost:8080/api/community/liked-posts
  const fetchLikedPosts = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      console.log('좋아요한 글 조회 시작');
      
      const endpoints = [
        `${API_BASE}/api/community/liked-posts`,
        `${API_BASE}/api/posts/liked`,
        `${API_BASE}/api/community/posts/liked`
      ];
      
      let data = null;
      
      for (const endpoint of endpoints) {
        try {
          const res = await fetch(endpoint, {
            method: 'GET',
            credentials: "include",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (res.ok) {
            data = await res.json();
            console.log('좋아요한 글 데이터:', data);
            break;
          }
        } catch (err) {
          continue;
        }
      }
      
      if (!data) {
        console.error('좋아요한 글 조회 실패');
        setLikedPosts([]);
        return;
      }
      
      if (Array.isArray(data)) {
        setLikedPosts(data);
      } else if (data.data && Array.isArray(data.data)) {
        setLikedPosts(data.data);
      } else {
        setLikedPosts([]);
      }
      
    } catch (error) {
      console.error("좋아요한 게시물을 불러오는 데 실패했습니다.", error);
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {myPosts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: '#9ca3af' }}>
                <p>작성한 글이 없습니다.</p>
                <p style={{ fontSize: '12px', marginTop: '8px' }}>
                  (개발자 도구 콘솔을 확인하여 API 응답을 확인하세요)
                </p>
              </div>
            ) : (
              myPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => navigate(`/main/community/post/${post.id}`)}
                  style={{
                    backgroundColor: 'white',
                    padding: '16px',
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
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
                    {post.title || "제목 없음"}
                  </h3>
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#6b7280', 
                    marginBottom: '12px', 
                    lineHeight: '1.5',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {post.content || "내용 없음"}
                  </p>
                  {post.files && post.files.length > 0 && (
                    <img 
                      src={post.files[0].fileUrl} 
                      alt="" 
                      style={{ 
                        width: '100%', 
                        maxHeight: '200px',
                        objectFit: 'cover',
                        borderRadius: '8px', 
                        marginBottom: '12px' 
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: '#9ca3af' }}>
                    <span>❤️ {post.likesCount || 0}</span>
                    <span>💬 {post.commentCount || 0}</span>
                    <span style={{ marginLeft: 'auto', fontSize: '12px' }}>
                      {post.createdAt ? new Date(post.createdAt).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }) : ''}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        );
      case "comments":
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {myComments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: '#9ca3af' }}>
                작성한 댓글이 없습니다.
              </div>
            ) : (
              myComments.map((comment) => (
                <div
                  key={comment.id}
                  onClick={() => comment.postId && navigate(`/main/community/post/${comment.postId}`)}
                  style={{
                    backgroundColor: 'white',
                    padding: '16px',
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                    border: '1px solid #f3f4f6',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
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
                  <p style={{ fontSize: '14px', color: '#374151', marginBottom: '8px' }}>
                    {comment.content}
                  </p>
                  <p style={{ fontSize: '12px', color: '#9ca3af' }}>
                    ↪ {comment.postTitle || "게시물"}
                  </p>
                  <p style={{ fontSize: '11px', color: '#d1d5db', marginTop: '4px' }}>
                    {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }) : ''}
                  </p>
                </div>
              ))
            )}
          </div>
        );
      case "liked":
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {likedPosts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: '#9ca3af' }}>
                좋아요한 글이 없습니다.
              </div>
            ) : (
              likedPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => navigate(`/main/community/post/${post.id}`)}
                  style={{
                    backgroundColor: 'white',
                    padding: '16px',
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
                  <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '8px' }}>
                    {post.author || post.username} 님의 글
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
                    {post.title || "제목 없음"}
                  </h3>
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#6b7280', 
                    marginBottom: '12px', 
                    lineHeight: '1.5',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {post.content || "내용 없음"}
                  </p>
                  {post.files && post.files.length > 0 && (
                    <img 
                      src={post.files[0].fileUrl} 
                      alt="" 
                      style={{ 
                        width: '100%', 
                        maxHeight: '200px',
                        objectFit: 'cover',
                        borderRadius: '8px', 
                        marginBottom: '12px' 
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: '#9ca3af' }}>
                    <span>❤️ {post.likesCount || 0}</span>
                    <span>💬 {post.commentCount || 0}</span>
                    <span style={{ marginLeft: 'auto', fontSize: '12px' }}>
                      {post.createdAt ? new Date(post.createdAt).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }) : ''}
                    </span>
                  </div>
                </div>
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
      borderBottom: '2px solid transparent'
    },
    contentSection: {
      padding: '16px',
      flex: 1
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
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>
            {userInfo.nickname || '내 활동 기록'}
          </h2>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>@{userInfo.username}</p>
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
              color: location.pathname === '/main' ? '#10b981' : '#6b7280' 
            }}
          >
            <Home size={24} strokeWidth={2} />
            <span style={{ fontSize: '12px', fontWeight: '500' }}>홈</span>
          </button>
          
          <button 
            onClick={() => navigate('/community/create')}
            style={{ 
              ...styles.navButton, 
              color: location.pathname === '/community/create' ? '#10b981' : '#6b7280' 
            }}
          >
            <PenSquare size={24} strokeWidth={2} />
            <span style={{ fontSize: '12px', fontWeight: '500' }}>작성</span>
          </button>
          
          <button 
            onClick={() => navigate('/community/mypage')}
            style={{ 
              ...styles.navButton, 
              color: location.pathname === '/community/mypage' ? '#10b981' : '#6b7280' 
            }}
          >
            <User size={24} strokeWidth={2} />
            <span style={{ fontSize: '12px', fontWeight: '500' }}>My Page</span>
          </button>
          
          <button
            onClick={() => navigate('/main/setting')}
            style={{ 
              ...styles.navButton, 
              color: location.pathname === '/main/setting' ? '#10b981' : '#6b7280' 
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