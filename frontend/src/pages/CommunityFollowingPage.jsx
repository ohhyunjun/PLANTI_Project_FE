import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import downloadedImage from '../assets/strawberry.jpg';

function CommunityFollowingPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const onSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    // 검색 로직 (예: 검색 페이지로 이동)
    navigate(`/main/community/search?keyword=${query}`);
  };

  return (
    <div className="community">
      {/* 상단 헤더 */}
      <header className="header">
        <button onClick={() => navigate("/main/community")}>←</button>
        <h2>팔로잉</h2>

        <div className="right-icons">
          <button className="icon-btn" title="알림">🔔</button>
          <button
            className="icon-btn"
            title="메뉴"
            onClick={() => navigate("/main/setting")}
          >
            ☰
          </button>
        </div>
      </header>

      {/* 검색창 */}
      <form className="comm-search" onSubmit={onSearch}>
        <input
          type="text"
          placeholder="아이디 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="search-btn" type="submit" title="검색">🔍</button>
      </form>
      
      {/* 🍓 배너 이미지 추가 */}
      {/* img 태그에 클래스 이름을 부여하고, src 속성에 이미지를 불러온 변수를 사용합니다. */}
      <div className="banner">
        <img
          src={downloadedImage}
          alt="배너 이미지"
          className="strawberry-img"
        />
      </div>

      {/* 팔로잉 한 사람들의 게시글 */}
      <div className="posts">
        <p>팔로잉한 사람들의 게시글이 여기에 표시됩니다.</p>
      </div>

      {/* 하단 고정 홈 버튼 */}
      <footer className="footer">
        <Link className="home-btn" to="/main/community">Home</Link>
        <Link className="create-post-btn" to="/community/create">+</Link>
        <Link className="activity-log-btn" to="/community/activity">하트</Link>
      </footer>
    </div>
  );
}

export default CommunityFollowingPage;