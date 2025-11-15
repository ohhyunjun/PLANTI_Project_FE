import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Users, Heart, Bell, ChevronDown, Search, ChevronLeft } from "lucide-react";
import { getPosts, togglePostLike } from "../api/community";

// Pretendard 폰트 추가
const fontStyles = `
@font-face {
    font-family: 'Pretendard';
    src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Thin.woff') format('woff');
    font-weight: 100;
    font-display: swap;
}

@font-face {
    font-family: 'Pretendard';
    src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-ExtraLight.woff') format('woff');
    font-weight: 200;
    font-display: swap;
}

@font-face {
    font-family: 'Pretendard';
    src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Light.woff') format('woff');
    font-weight: 300;
    font-display: swap;
}

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

@font-face {
    font-family: 'Pretendard';
    src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-ExtraBold.woff') format('woff');
    font-weight: 800;
    font-display: swap;
}

@font-face {
    font-family: 'Pretendard';
    src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Black.woff') format('woff');
    font-weight: 900;
    font-display: swap;
}

* {
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
}
`;

const SortDropdown = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          backgroundColor: 'white',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#374151',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#9ca3af';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#d1d5db';
        }}
      >
        <span>{value}</span>
        <ChevronDown 
          size={16} 
          style={{ 
            transition: 'transform 0.2s',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
          }}
        />
      </button>
      
      {isOpen && (
        <>
          <div 
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 10
            }}
          />
          <div style={{
            position: 'absolute',
            right: 0,
            marginTop: '8px',
            width: '120px',
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            zIndex: 20,
            overflow: 'hidden'
          }}>
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '10px 12px',
                  fontSize: '14px',
                  border: 'none',
                  backgroundColor: value === option.value ? '#f0fdf4' : 'white',
                  color: value === option.value ? '#0D986A' : '#374151',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (value !== option.value) {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (value !== option.value) {
                    e.currentTarget.style.backgroundColor = 'white';
                  }
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const PostCard = ({ post, nav, onLikeToggle }) => {
  const [isLiked, setIsLiked] = useState(post.liked || false);
  const [likeCount, setLikeCount] = useState(post.likesCount || 0);
  const [isLiking, setIsLiking] = useState(false);

  const handleLikeClick = async (e) => {
    e.stopPropagation();
    if (isLiking) return;
    
    const previousLiked = isLiked;
    const previousCount = likeCount;
    
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    setIsLiking(true);
    
    try {
      const response = await togglePostLike(post.id);
      setIsLiked(response.data.liked);
      setLikeCount(response.data.likesCount);
      
      if (onLikeToggle) {
        onLikeToggle(post.id, response.data.liked, response.data.likesCount);
      }
    } catch (error) {
      console.error('좋아요 토글 실패:', error);
      setIsLiked(previousLiked);
      setLikeCount(previousCount);
      
      if (error.response?.status === 401) {
        alert('로그인이 필요합니다.');
      } else if (error.response?.status === 404) {
        alert('게시물을 찾을 수 없습니다.');
      } else {
        alert('좋아요 처리 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div
      onClick={() => nav(`/main/community/post/${post.id}`)}
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
          {/* 좋아요 버튼 */}
          <button
            onClick={handleLikeClick}
            disabled={isLiking}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'none',
              border: 'none',
              cursor: isLiking ? 'not-allowed' : 'pointer',
              padding: '4px 8px',
              marginLeft: '-8px',
              borderRadius: '4px',
              transition: 'all 0.2s',
              color: isLiked ? '#0D986A' : '#9ca3af',
              opacity: isLiking ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (!isLiking) {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Heart 
              size={16} 
              fill={isLiked ? '#0D986A' : 'none'}
              color={isLiked ? '#0D986A' : '#9ca3af'}
              style={{
                transition: 'all 0.2s',
                transform: isLiking ? 'scale(0.9)' : 'scale(1)'
              }}
            />
            <span style={{ 
              fontWeight: isLiked ? '600' : '400',
              transition: 'all 0.2s'
            }}>
              {likeCount}
            </span>
          </button>
          
          {/* 댓글 수 */}
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            💬 {post.commentCount || 0}
          </span>
        </div>
      </div>
      
      {/* 우측: 작은 썸네일 (이미지가 있을 때만) */}
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
            alt="썸네일" 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  );
};

export default function CommunityStartPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('최신순');
  
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  
  // 무한 스크롤을 위한 observer ref
  const observerRef = useRef();
  const lastPostRef = useCallback(node => {
    if (loading) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setCurrentPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observerRef.current.observe(node);
  }, [loading, hasMore]);

  const sortOptions = [
    { value: '최신순', label: '최신순' },
    { value: '인기순', label: '인기순' }
  ];

  // 정렬 방식 변경 시 초기화 후 다시 로드
  useEffect(() => {
    setPosts([]);
    setCurrentPage(0);
    setHasMore(true);
  }, [sortBy]);

  // 게시물 로드
  useEffect(() => {
    const fetchPosts = async () => {
      if (loading || !hasMore) return;
      
      setLoading(true);
      try {
        // 정렬 파라미터 설정
        const sortParam = sortBy === '인기순' 
          ? 'likesCount,desc' 
          : 'createdAt,desc';
        
        const response = await getPosts({
          page: currentPage,
          size: 10,
          sort: sortParam
        });
        
        // Spring Page 응답 구조: { content: [], totalElements, totalPages, last, ... }
        const { content, totalElements, last } = response.data;
        
        setPosts(prevPosts => {
          // 첫 페이지면 새로 설정, 아니면 추가
          if (currentPage === 0) {
            return content;
          }
          return [...prevPosts, ...content];
        });
        
        setTotalElements(totalElements);
        setHasMore(!last); // last가 true면 더 이상 데이터 없음
        
      } catch (error) {
        console.error('게시물 로딩 실패:', error);
        if (currentPage === 0) {
          alert('게시물을 불러오는데 실패했습니다.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage, sortBy]);

  // 좋아요 토글 시 posts 배열 업데이트
  const handleLikeToggle = (postId, liked, likesCount) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, liked, likesCount }
          : post
      )
    );
  };

  const styles = {
    container: {
      maxWidth: '412px',
      margin: '0 auto',
      backgroundColor: '#f9fafb',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
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
    filterHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px',
      paddingBottom: '0px',
      backgroundColor: '#f9fafb'
    },
    contentSection: {
      flex: 1,
      overflowY: 'auto',
      padding: '16px',
      paddingTop: '16px'
    },
    floatingButtonContainer: {
      position: 'fixed',
      bottom: '100px',
      left: '50%',
      transform: 'translateX(-50%)',
      maxWidth: '412px',
      width: '100%',
      zIndex: 50,
      pointerEvents: 'none',
    },
    floatingButton: {
      position: 'absolute',
      bottom: 0,
      right: '16px',
      pointerEvents: 'auto',
      width: '56px',
      height: '56px',
      borderRadius: '50%',
      backgroundColor: '#0D986A',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 12px rgba(13, 152, 106, 0.3)',
      transition: 'all 0.2s'
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
      
      {/* 상단바 */}
      <div style={styles.header}>
        <div style={styles.logo}>
          <button 
            onClick={() => navigate('/main')}
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
          <span>커뮤니티</span>
        </div>
        <button
          onClick={() => navigate('/main/community/search')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Search size={20} color="#0D986A" />
        </button>
      </div>

      {/* 필터 헤더 */}
      <div style={styles.filterHeader}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <h2 style={{ 
            fontSize: '18px', 
            fontWeight: '700', 
            color: '#111827',
            margin: 0
          }}>
            전체
          </h2>
          <span style={{ fontSize: '14px', color: '#9ca3af' }}>
            {totalElements}
          </span>
        </div>
        
        <SortDropdown
          value={sortBy}
          onChange={setSortBy}
          options={sortOptions}
        />
      </div>

      {/* 메인 컨텐츠 */}
      <div style={styles.contentSection}>
        {posts.length === 0 && !loading && (
          <div style={{
            textAlign: 'center',
            padding: '48px 0',
            color: '#9ca3af'
          }}>
            게시물이 없습니다.
          </div>
        )}
        
        {posts.map((post, index) => {
          // 마지막 게시물에 ref 추가
          if (posts.length === index + 1) {
            return (
              <div ref={lastPostRef} key={post.id}>
                <PostCard 
                  post={post} 
                  nav={navigate}
                  onLikeToggle={handleLikeToggle}
                />
              </div>
            );
          } else {
            return (
              <PostCard 
                key={post.id} 
                post={post} 
                nav={navigate}
                onLikeToggle={handleLikeToggle}
              />
            );
          }
        })}
        
        {/* 로딩 인디케이터 */}
        {loading && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '24px 0',
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
        )}
        
        {/* 더 이상 데이터가 없을 때 */}
        {!hasMore && posts.length > 0 && (
          <div style={{
            textAlign: 'center',
            padding: '24px 0',
            color: '#9ca3af',
            fontSize: '14px'
          }}>
            모든 게시물을 불러왔습니다.
          </div>
        )}
      </div>

      {/* 글작성 FAB */}
      <div style={styles.floatingButtonContainer}>
        <button
          onClick={() => navigate('/community/create')}
          style={styles.floatingButton}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.backgroundColor = '#0a7a56';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.backgroundColor = '#0D986A';
          }}
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="white" 
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
          </svg>
        </button>
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

      {/* 스피너 애니메이션 */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}