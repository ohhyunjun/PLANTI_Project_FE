import { useNavigate } from "react-router-dom";

function CommunityExplorePage() {
  const navigate = useNavigate();

  return (
    <div className="community">
      <header className="header">
        <button onClick={() => navigate("/main/community")}>←</button>
        <h2>추천</h2>
        <button onClick={() => navigate("/main/community/search")}>🔍</button>
      </header>

      <div className="posts">
        <p>추천 게시글이 여기에 표시됩니다.</p>
      </div>

      <footer className="footer">
        <button onClick={() => navigate("/main/community")}>🏠 Home</button>
      </footer>
    </div>
  );
}

export default CommunityExplorePage;
