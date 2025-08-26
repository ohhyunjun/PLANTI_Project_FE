import { BrowserRouter, Routes, Route } from "react-router-dom";

import JoinPage from "./pages/JoinPage";
import LoginPage from "./pages/LoginPage";
import IndexPage from "./pages/IndexPage";
import LoginChoicePage from "./pages/LoginChoicePage";
import MainPage from "./pages/MainPage";
import CommunityStartPage from "./pages/CommunityStartPage";
import CommunityFollowingPage from "./pages/CommunityFollowingPage";
import CommunityExplorePage from "./pages/CommunityExplorePage";
import SearchPage from "./pages/SearchPage";
import SettingPage from "./pages/SettingPage";
import AiPhotoStartPage from "./pages/AiPhotoStartPage";
import DiaryPage from "./pages/DiaryPage";


import './App.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* 시작 페이지 */}

        <Route path="/" element={<IndexPage/>} />

        {/* 로그인/등록 선택 페이지 및 하위 페이지들 */}

        <Route path="/auth/loginchoice" element={<LoginChoicePage/>} />

        <Route path="/auth/signup" element={<JoinPage />} />
        <Route path="/auth/login" element={<LoginPage />} />

        {/* 메인 페이지와 연결 기능들 */}

        <Route path="/main" element={<MainPage />} />
        <Route path="/main/community" element={<CommunityStartPage />} />
        <Route path="/main/setting" element={<SettingPage />} />
        <Route path="/main/aiphoto" element={<AiPhotoStartPage />} />
        <Route path="/main/diary" element={<DiaryPage />} />

        {/* 커뮤니티 기능들 */}
        <Route path="/main/community/following" element={<CommunityFollowingPage />} />
        <Route path="/main/community/explore" element={<CommunityExplorePage />} />
        <Route path="/main/community/search" element={<SearchPage />} />

        
        



        
      </Routes>
    </BrowserRouter>
  );
}

export default App