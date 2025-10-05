import { useState, useMemo, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
// usePosts 대신 임시 데이터 사용 또는 PostContext 사용 (여기서는 메인 페이지와 통일 위해 Context는 제외)
// import { usePosts } from "../context/PostContext"; 
import downloadedImage from "../assets/strawberry.jpg"; // 메인 페이지와 동일한 이미지 사용

// ⚠️ 참고: API_BASE는 환경 변수에서 가져옵니다. (메인 페이지에서 가져온 코드)
const API_BASE = import.meta.env.VITE_BACKEND_API_BASE_URL;

// 아이콘을 위한 더미 컴포넌트 (메인 페이지에서 가져온 코드)
const Icon = ({ name, className = "" }) => {
  const icons = {
    back: "←",
    bell: "🔔",
    menu: "☰",
    search: "🔍",
    comment: "💬",
    repost: "🔁",
    like: "❤",
    share: "↗",
    home: "🏠",
    create: "✍",
    activity: "❤️",
    mypage: "👤",
    recommend: "⭐",
    friend: "👥",
  };
  return <span className={`text-xl ${className}`}>{icons[name] || name}</span>;
};

// 게시글 카드 컴포넌트 (메인 페이지에서 가져온 스타일을 팔로잉에 맞게 적용)
const PostCard = ({ post, nav }) => (
    // ... (PostCard 컴포넌트 코드는 동일)
    <article 
        className="post-card bg-gray-900 text-gray-200 p-3 border-b border-gray-800"
        onClick={() => nav(`/main/community/post/${post.id}`)} 
    >
        <div className="flex justify-between items-center mb-2">
            {/* 포스트 헤드 */}
            <div className="flex items-center">
                <img
                    className="w-8 h-8 rounded-full object-cover mr-2 border border-green-500"
                    src={post.author?.avatarUrl || "default-avatar-dark.png"}
                    alt={`${post.author?.username}님의 아바타`}
                />
                <div className="flex items-center space-x-1">
                    <button
                        className="text-sm font-semibold text-white hover:text-green-400 transition-colors"
                        onClick={(e) => {
                            e.stopPropagation(); 
                            nav(`/community/user/${post.author?.username}`);
                        }}
                    >
                        @{post.author?.username || "알 수 없는 사용자"}
                    </button>
                    <span className="text-xs text-gray-500">·</span>
                    <span className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString('ko-KR', {
                        month: 'numeric',
                        day: 'numeric',
                    }) || "방금 전"}</span>
                </div>
            </div>
            <button className="text-base text-gray-400">...</button>
        </div>

        {/* 포스트 본문 */}
        <div className="text-gray-300 mb-2 whitespace-pre-wrap text-sm">{post.content}</div>

        {/* 포스트 미디어 (이미지) */}
        {post.image && (
            <div className="post-media mb-3 rounded-lg overflow-hidden border border-gray-700">
                <img
                    src={post.image}
                    alt="게시물 이미지"
                    style={{ width: "100%", height: "200px", objectFit: "cover" }}
                />
            </div>
        )}

        {/* 액션 버튼들 */}
        <div className="flex space-x-4 text-gray-400">
            <button className="flex items-center space-x-1 hover:text-blue-400 transition-colors">
                <Icon name="comment" className="text-lg"/>
                <span className="text-xs">{post.replyCount ?? 0}</span>
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


function CommunityFollowingPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [query, setQuery] = useState("");
    const [followingPosts, setFollowingPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // ... (loadFollowingPosts 및 useEffect 코드는 동일)
    const loadFollowingPosts = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/community/feed?type=following`, { credentials: "include" });
            const data = await res.json();
            setFollowingPosts(
                Array.isArray(data) ? data : [
                    { id: 1, author: { username: "홍길동" }, content: "첫 번째 테스트 글입니다 🌱", image: downloadedImage, createdAt: new Date().toISOString(), replyCount: 15, repostCount: 3, likeCount: 45, },
                ]
            );
        } catch (e) {
            console.error("팔로잉 피드 불러오기 실패:", e);
            setFollowingPosts([]); 
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFollowingPosts();
    }, []);

    const onSearch = (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        navigate(`/main/community/search?keyword=${query}`);
        setQuery("");
    };

    return (
        <div className="community min-h-screen bg-gray-900 max-w-sm mx-auto shadow-2xl pb-16">
            
            {/* 1. 상단 헤더: sticky top-0 유지 (스크롤 시 고정) */}
            <header className="sticky top-0 bg-gray-900 p-3 border-b border-gray-800 z-20">
                <div className="flex justify-between items-center mb-3">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="text-xl font-bold text-white hover:text-gray-400 transition-colors"
                        aria-label="뒤로가기"
                    >
                        <Icon name="back" className="text-2xl" />
                    </button>
                    <h2 className="text-2xl font-bold text-white tracking-wider">팔로잉</h2>
                    <div className="flex items-center space-x-3">
                        <button title="알림" className="text-xl text-yellow-300 hover:text-yellow-400 transition-colors">
                            <Icon name="bell" />
                        </button>
                        <button onClick={() => navigate("/main/setting")} title="메뉴" className="text-xl text-white hover:text-green-500 transition-colors">
                            <Icon name="menu" />
                        </button>
                    </div>
                </div>

                {/* 검색 폼: 헤더에 포함되어 sticky top-0에 의해 고정됨 */}
                <form className="flex items-center space-x-2" onSubmit={onSearch}>
                    <input
                        type="search"
                        placeholder="아이디 검색"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1 p-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                        aria-label="팔로잉 아이디 검색"
                    />
                    <button 
                        className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-green-400 hover:bg-gray-700 transition-colors disabled:opacity-50" 
                        type="submit" 
                        title="검색"
                        disabled={!query.trim()}
                    >
                        <Icon name="search" className="text-xl"/>
                    </button>
                </form>
            </header>
            
            {/* 2. 탭 내비게이션: sticky top-[170px] z-10 클래스 제거! (콘텐츠처럼 움직이게 함) */}
            <nav className="flex justify-around text-center py-2 border-b border-gray-800 bg-gray-900">
                <Link
                    className={`flex flex-col items-center px-3 py-1 text-sm font-medium transition-colors 
                        ${ 
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
                    className={`flex flex-col items-center px-3 py-1 text-sm font-medium transition-colors 
                        ${
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

            {/* 3. 팔로잉 피드 목록 및 배너 (탭 아래의 모든 콘텐츠는 함께 스크롤됨) */}
            <main className="comm-feed pt-3">
                {/* 배너 섹션 (이전 단계에서 제거했지만, 메인 페이지 코드에는 포함되어 있었으므로 다시 추가합니다.) */}
                <section className="comm-banner flex flex-col items-center py-5 bg-gray-900 border-b border-gray-800">
                    <div className="w-11/12 overflow-hidden rounded-xl shadow-xl border border-gray-700">
                        <img
                            src={downloadedImage}
                            alt="Strawberry Event"
                            style={{ width: "100%", height: "200px", objectFit: "cover" }} 
                        />
                    </div>
                    <div className="banner-caption text-center mt-3">
                        <div className="banner-title text-lg font-bold text-red-400">
                            Whose strawberry is the best?
                        </div>
                        <div className="banner-sub text-sm text-gray-300 mt-1">
                            딸기 재배 챌린지에 참여해보세요!
                        </div>
                    </div>
                </section>
                
                {/* 게시글 목록 */}
                <h2 className="text-lg font-semibold text-gray-300 px-3 mb-3 pt-3">
                    팔로잉 피드
                </h2>
                {/* 로딩/결과 없음 메시지 */}
                {loading && (
                    <p className="text-center py-6 text-green-500 animate-pulse text-sm">
                        🌱 피드를 불러오는 중입니다...
                    </p>
                )}
                {!loading && followingPosts.length === 0 && (
                    <p className="text-center py-6 text-gray-500 text-sm">
                        팔로우한 사용자의 게시물이 없습니다.
                    </p>
                )}
                
                {!loading && followingPosts.map((post) => 
                    <PostCard key={post.id} post={post} nav={navigate} />
                )}
            </main>

      {/* 4. 하단 네비게이션 바 (Footer): 메인 페이지와 동일한 구조와 스타일 */}
      <footer className="sticky bottom-0 left-0 right-0 max-w-sm mx-auto bg-gray-900 border-t border-gray-800 flex justify-around items-center h-12 z-20 text-xs"> {/* height 및 폰트 크기 감소 */}
        <Link 
          className={`flex flex-col items-center px-2 py-1 font-medium transition-colors ${
            location.pathname === "/main/community" ? "text-green-400" : "text-gray-400 hover:text-green-500"
          }`} 
          to="/main/community"
        >
          <Icon name="home" className="text-lg"/>
          Home
        </Link>
        <Link 
          className="flex flex-col items-center px-2 py-1 text-gray-400 font-medium hover:text-white transition-colors" 
          to="/community/create"
        >
          <Icon name="create" className="text-lg"/>
          작성
        </Link>
        <Link 
          className="flex flex-col items-center px-2 py-1 text-gray-400 font-medium hover:text-red-400 transition-colors" 
          to="/community/activity"
        >
          <Icon name="activity" className="text-lg"/>
          활동
        </Link>
        <Link 
          className="flex flex-col items-center px-2 py-1 text-red-400 font-medium hover:text-red-500 transition-colors" 
          to="/community/mypage"
        >
          <Icon name="mypage" className="text-lg"/>
          My Page
        </Link>
      </footer>
    </div>
  );
}

export default CommunityFollowingPage;