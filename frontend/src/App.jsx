import { BrowserRouter, Routes, Route } from "react-router-dom";

import JoinPage from "./pages/JoinPage";
import LoginPage from "./pages/LoginPage";
import IndexPage from "./pages/IndexPage";
import LoginChoicePage from "./pages/LoginChoicePage";

import './App.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/api/auth/signup" element={<JoinPage />} />
        <Route path="/api/auth/login" element={<LoginPage />} />
        <Route path="/api/auth/index" element={<IndexPage />} />
        <Route path="/api/auth/loginchoice" element={<LoginChoicePage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App