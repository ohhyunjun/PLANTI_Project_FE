import { BrowserRouter, Routes, Route } from "react-router-dom";

import JoinPage from "./pages/JoinPage";
import LoginPage from "./pages/LoginPage";
import IndexPage from "./pages/IndexPage";
import LoginChoicePage from "./pages/LoginChoicePage";
import MainPage from "./pages/MainPage";


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


        
      </Routes>
    </BrowserRouter>
  );
}

export default App