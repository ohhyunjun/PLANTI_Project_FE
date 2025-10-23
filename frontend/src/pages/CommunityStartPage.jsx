import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Home, Users, User, Bell, PenSquare } from "lucide-react"; // ✅ User, PenSquare 추가
import { getPosts } from "../api/community";

const Icon = ({ name, className = "" }) => {
  const icons = {
    back: "←", bell: "🔔", menu: "☰", search: "🔍",
    comment: "💬", repost: "🔁", like: "❤", share: "↗",
    recommend: "⭐", friend: "👥", more: "..."
  };
  return <span className={`text-xl ${className}`}>{icons[name] || name}</span>;
};

const PostCard = ({ post, nav }) => (
    <article className="post-card bg-gray-900 text-gray-200 p-3 border-b border-gray-800">
        <div className="flex justify-between items-start mb-2">
            <div 
                className="flex items-center flex-grow cursor-pointer"
                onClick={() => nav(`/main/community/post/${post.id}`)}
            >
                <img
                    className="w-8 h-8 rounded-full object-cover mr-2 border border-green-500"
                    src="/default-avatar-dark.png"
                    alt={`${post.authorUsername}님의 아바타`}
                />
                <div className="flex items-center space-x-1">
                    <span className="text-sm font-semibold text-white hover:text-green-400">
                        @{post.authorUsername || "알 수 없는 사용자"}
                    </span>
                    <span className="text-xs text-gray-500">·</span>
                    <span className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                </div>
            </div>
        </div>

        <div 
            className="cursor-pointer"
            onClick={() => nav(`/main/community/post/${post.id}`)}
        >
            {post.title && (
                <h3 className="text-lg font-bold text-gray-200 mb-2">
                    {post.title}
                </h3>
            )}
            
            <div className="text-gray-300 mb-2 whitespace-pre-wrap text-sm">
                {post.content}
            </div>
            
            {post.files && post.files.length > 0 && (
                <div className="post-media mb-3 rounded-lg overflow-hidden border border-gray-700">
                    <img 
                        src={post.files[0].fileUrl}
                        alt="게시물 이미지" 
                        style={{ width: "100%", height: "200px", objectFit: "cover" }} 
                        onError={(e) => {
                            console.error("이미지 로드 실패:", post.files[0].fileUrl);
                            e.target.style.display = 'none';
                        }}
                    />
                </div>
            )}
        </div>

        <div className="flex space-x-4 text-gray-400">
            <button className="flex items-center space-x-1 hover:text-blue-400 transition-colors">
                <Icon name="comment" className="text-lg"/>
                <span className="text-xs">{post.comments?.length ?? 0}</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-green-400 transition-colors">
                <Icon name="repost" className="text-lg"/>
                <span className="text-xs">{post.repostCount ?? 0}</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-red-400 transition-colors">
                <Icon name="like" className="text-lg"/>
                <span className="text-xs">{post.likeCount ?? 0}</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-gray-200 transition-colors">
                <Icon name="share" className="text-lg"/>
                <span className="text-xs">공유</span>
            </button>
        </div>
    </article>
);

export default function CommunityStartPage() {
  const nav = useNavigate();
  const location = useLocation();

  const [explore, setExplore] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  const loadExplore = async () => {
    try {
      setLoading(true);
      const response = await getPosts();
      setExplore(Array.isArray(response.data) ? response.data : []);
      console.log("게시글 로드:", response.data);
    } catch (e) {
      console.error("피드 불러오기 실패:", e);
      setExplore([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExplore();
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    nav(`/main/community/search?keyword=${query}`);
  };

  const styles = {
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
    <div className="community min-h-screen bg-gray-900 max-w-sm mx-auto shadow-2xl pb-16">
      <header className="sticky top-0 bg-gray-900 p-3 border-b border-gray-800 z-20">
        <div className="flex justify-center mb-3">
          <h1 className="text-2xl font-bold text-white tracking-wider">Community</h1>
        </div>
        
        <div className="flex justify-center space-x-5 mb-3">
          <button className="text-xl text-yellow-300 hover:text-yellow-400 transition-colors">
            <Icon name="bell"/>
          </button>
          <button
            className="text-xl text-white hover:text-green-500 transition-colors"
            onClick={() => nav("/main/setting")}
          >
            <Icon name="menu"/>
          </button>
        </div>

        <form className="flex items-center space-x-2" onSubmit={onSearch}>
          <input
            type="text"
            placeholder="아이디 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 p-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
          />
          <button 
            className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-green-400 hover:bg-gray-700 transition-colors" 
            type="submit"
          >
            <Icon name="search" className="text-xl"/>
          </button>
        </form>
      </header>

      <nav className="flex justify-around text-center py-2 border-b border-gray-800 bg-gray-900">
        <Link
            className={`flex flex-col items-center px-3 py-1 text-sm font-medium transition-colors ${
                location.pathname === "/main/community"
                    ? "text-green-400 border-b-2 border-green-400"
                    : "text-gray-500 hover:text-gray-300"
            }`}
            to="/main/community"
        >
            <Icon name="recommend" className="text-base mb-0.5" />
            추천
        </Link>
        
        <Link
            className={`flex flex-col items-center px-3 py-1 text-sm font-medium transition-colors ${
                location.pathname.includes("/following")
                    ? "text-green-400 border-b-2 border-green-400"
                    : "text-gray-500 hover:text-gray-300"
            }`}
            to="/main/community/following"
        >
            <Icon name="friend" className="text-base mb-0.5"/>
            팔로잉
        </Link>
      </nav>

      <main className="comm-feed pt-3 pb-12">
        {loading && (
          <p className="text-center py-6 text-green-500 animate-pulse text-sm">
             🌱 피드를 불러오는 중...
          </p>
        )}
        {!loading && explore.length === 0 && (
          <p className="text-center py-6 text-gray-500 text-sm">
            게시물이 없습니다.
          </p>
        )}
        
        {!loading && explore.map((post) => (
            <PostCard key={post.id} post={post} nav={nav} />
        ))}
      </main>

      {/* ✅ 수정된 네비게이션 바 */}
      <div style={styles.navbar}>
        <div style={styles.navContainer}>
          <button
            onClick={() => nav('/main')}
            style={{ 
              ...styles.navButton, 
              color: location.pathname === '/main' ? '#10b981' : '#6b7280' 
            }}
          >
            <Home size={24} strokeWidth={2} />
            <span style={{ fontSize: '12px', fontWeight: '500' }}>홈</span>
          </button>
          
          {/* ✅ navigate를 nav로 수정 */}
          <button 
            onClick={() => nav('/community/create')}
            style={{ 
              ...styles.navButton, 
              color: location.pathname === '/community/create' ? '#10b981' : '#6b7280' 
            }}
          >
            <PenSquare size={24} strokeWidth={2} />
            <span style={{ fontSize: '12px', fontWeight: '500' }}>작성</span>
          </button>
          
          {/* ✅ Heart를 User로 변경, 활성화 색상 로직 추가 */}
          <button 
            onClick={() => nav('/community/mypage')}
            style={{ 
              ...styles.navButton, 
              color: location.pathname === '/community/mypage' ? '#10b981' : '#6b7280' 
            }}
          >
            <User size={24} strokeWidth={2} />
            <span style={{ fontSize: '12px', fontWeight: '500' }}>My Page</span>
          </button>
          
          <button
            onClick={() => nav('/main/setting')}
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