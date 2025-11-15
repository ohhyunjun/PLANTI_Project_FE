// src/pages/NogrowPage1.jsx
import React, { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Home, Search, Users, Heart, Bell, ChevronLeft } from "lucide-react";
import { createPlant } from "../api/plant";

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

// 식물 카테고리 데이터
const plantCategories = [
  { id: "flower", name: "꽃식물", icon: "🌺", color: "#ffffff" },
  { id: "fruit", name: "열매식물", icon: "🍋", color: "#ffffff" },
  { id: "succulent", name: "다육 선인장 식물", icon: "🌵", color: "#ffffff" },
  { id: "foliage", name: "잎식물", icon: "🌿", color: "#ffffff" }
];

// 카테고리별 식물 데이터
const plantsByCategory = {
  flower: [
    { id: "rose", name: "Rose", koreanName: "장미", icon: "🌹" },
    { id: "geranium", name: "Geranium", koreanName: "제라늄", icon: "🌺" },
    { id: "tulip", name: "Tulip", koreanName: "튤립", icon: "🌷" },
    { id: "sunflower", name: "Sunflower", koreanName: "해바라기", icon: "🌻" },
    { id: "orchid", name: "Orchid", koreanName: "난초", icon: "🌸" },
    { id: "lily", name: "Lily", koreanName: "백합", icon: "💮" }
  ],
  fruit: [
    { id: "strawberry", name: "Strawberry", koreanName: "딸기", icon: "🍓" },
    { id: "orange", name: "Orange", koreanName: "오렌지", icon: "🍊" },
    { id: "lemon", name: "Lemon", koreanName: "레몬", icon: "🍋" },
    { id: 1, name: "Tomato", koreanName: "토마토", icon: "🍅" },
    { id: "blueberry", name: "Blueberry", koreanName: "블루베리", icon: "🫐" },
    { id: "apple", name: "Apple", koreanName: "사과", icon: "🍎" }
  ],
  succulent: [
    { id: "cactus", name: "Cactus", koreanName: "선인장", icon: "🌵" },
    { id: "aloe", name: "Aloe", koreanName: "알로에", icon: "🪴" },
    { id: "echeveria", name: "Echeveria", koreanName: "에케베리아", icon: "🌿" },
    { id: "jade", name: "Jade Plant", koreanName: "염좌", icon: "🌱" },
    { id: "succulent", name: "Succulent", koreanName: "다육이", icon: "🍀" }
  ],
  foliage: [
    { id: 2, name: "Lettuce", koreanName: "상추", icon: "🥬" },
    { id: "monstera", name: "Monstera", koreanName: "몬스테라", icon: "🌿" },
    { id: "pothos", name: "Pothos", koreanName: "스킨답서스", icon: "🍃" },
    { id: "fern", name: "Fern", koreanName: "고사리", icon: "🌾" },
    { id: "snake", name: "Snake Plant", koreanName: "산세베리아", icon: "🌱" },
    { id: "philodendron", name: "Philodendron", koreanName: "필로덴드론", icon: "🪴" }
  ]
};

// 모든 식물을 하나의 배열로
const allPlants = Object.values(plantsByCategory).flat();

function NogrowPage1() {
  const { id: serialNumber } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState("category"); // "category" 또는 "plants"
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // 검색 필터링 - 카테고리 화면에서도 작동
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return plantCategories;
    
    const query = searchQuery.toLowerCase();
    return plantCategories.filter(cat => 
      cat.name.toLowerCase().includes(query) ||
      plantsByCategory[cat.id].some(plant => 
        plant.koreanName.toLowerCase().includes(query) ||
        plant.name.toLowerCase().includes(query)
      )
    );
  }, [searchQuery]);

  // 식물 리스트 필터링
  const filteredPlants = useMemo(() => {
    const plants = selectedCategory ? plantsByCategory[selectedCategory] : allPlants;
    
    if (!searchQuery.trim()) return plants;
    
    const query = searchQuery.toLowerCase();
    return plants.filter(p => 
      p.koreanName.toLowerCase().includes(query) || 
      p.name.toLowerCase().includes(query)
    );
  }, [searchQuery, selectedCategory]);

  // 식물 등록 처리 함수 (백엔드 API 연동)
  const handleRegister = async () => {
    if (!selectedPlant) {
      alert("먼저 등록할 식물을 선택해주세요.");
      return;
    }

    const plantName = prompt(`'${selectedPlant.koreanName}'의 애칭을 지어주세요:`);
    if (!plantName || !plantName.trim()) {
      alert("식물의 애칭을 입력해야 합니다.");
      return;
    }

    const plantData = {
      name: plantName,
      speciesId: selectedPlant.id,
      plantedAt: new Date().toISOString(),
      stage: 'SEED',
      serialNumber: serialNumber
    };

    try {
      await createPlant(plantData);
      alert(`'${plantName}'이(가) 성공적으로 등록되었습니다!`);
      navigate(`/main`);
    } catch (error) {
      console.error("식물 등록 실패:", error);
      alert(error.response?.data || "식물 등록에 실패했습니다.");
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      maxWidth: '412px',
      margin: '0 auto',
      backgroundColor: '#f9fafb',
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: '80px',
      boxSizing: 'border-box'
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
      position: 'left',
      top: 0,
      zIndex: 100
    },
    backButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#374151'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#0D986A'
    },
    content: {
      padding: '16px',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto'
    },
    title: {
      color: '#374151',
      fontSize: '16px',
      fontWeight: '600',
      marginBottom: '16px',
      marginTop: '8px',
      textAlign: 'center'
    },
    searchContainer: {
      position: 'relative',
      marginBottom: '20px',
      width: '100%'
    },
    searchInput: {
      width: '100%',
      padding: '12px 16px',
      paddingRight: '48px',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      fontSize: '15px',
      outline: 'none',
      boxSizing: 'border-box',
      backgroundColor: 'white',
      transition: 'border-color 0.2s'
    },
    searchIcon: {
      position: 'absolute',
      right: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#9ca3af'
    },
    categoryGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '12px',
      width: '100%'
    },
    categoryCard: {
      padding: '32px 20px',
      borderRadius: '16px',
      border: 'none',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      height: '180px',
      justifyContent: 'center',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
      width: '100%',
      backgroundColor: 'white'
    },
    categoryIcon: {
      fontSize: '64px'
    },
    categoryName: {
      fontSize: '15px',
      fontWeight: '600',
      color: '#374151',
      textAlign: 'center',
      lineHeight: '1.3'
    },
    plantList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      marginBottom: '16px',
      width: '100%'
    },
    plantCard: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 16px',
      borderRadius: '12px',
      border: '2px solid',
      transition: 'all 0.2s',
      backgroundColor: 'white',
      width: '100%',
      boxSizing: 'border-box',
      cursor: 'pointer'
    },
    plantCardSelected: {
      borderColor: '#0D986A',
      backgroundColor: '#f0fdf4'
    },
    plantCardDefault: {
      borderColor: '#e5e7eb',
      backgroundColor: 'white'
    },
    plantInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flex: 1
    },
    plantIcon: {
      fontSize: '40px',
      minWidth: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    plantDetails: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    },
    plantKoreanName: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1f2937'
    },
    plantEnglishName: {
      fontSize: '13px',
      color: '#6b7280'
    },
    selectButton: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      border: 'none',
      fontSize: '20px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s',
      fontWeight: 'bold'
    },
    selectButtonSelected: {
      backgroundColor: '#0D986A',
      color: 'white'
    },
    selectButtonDefault: {
      backgroundColor: '#f3f4f6',
      color: '#9ca3af'
    },
    confirmButton: {
      width: '100%',
      padding: '16px',
      borderRadius: '12px',
      border: 'none',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '16px',
      transition: 'all 0.2s'
    },
    confirmButtonActive: {
      backgroundColor: '#0D986A',
      color: 'white'
    },
    confirmButtonDisabled: {
      backgroundColor: '#e5e7eb',
      color: '#9ca3af',
      cursor: 'not-allowed'
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px 20px',
      color: '#9ca3af',
      fontSize: '15px'
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

  // 카테고리 선택 화면
  if (step === "category") {
    return (
      <>
        <style>{fontStyles}</style>
        <div style={styles.container}>
          {/* 헤더 */}
          <div style={styles.header}>
            <button onClick={() => navigate(-1)} style={styles.backButton}>
              <ChevronLeft size={24} />
            </button>
            <div style={styles.logo}>
              <span>PLANTI</span>
            </div>
            <div style={{ width: '24px' }}></div>
          </div>

          {/* 메인 컨텐츠 */}
          <div style={styles.content}>
            {/* 안내 문구 */}
            <p style={styles.title}>키우실 식물을 선택해주세요.</p>

            {/* 검색바 */}
            <div style={styles.searchContainer}>
              <input
                type="text"
                placeholder="식물의 이름을 검색하세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
                onFocus={(e) => e.target.style.borderColor = '#0D986A'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
              <Search style={styles.searchIcon} size={20} />
            </div>

            {/* 카테고리 그리드 */}
            <div style={styles.categoryGrid}>
              {filteredCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setStep("plants");
                    setSearchQuery("");
                  }}
                  style={styles.categoryCard}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.backgroundColor = '#f0fdf4';
                    e.currentTarget.style.borderColor = '#0D986A';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                >
                  <div style={styles.categoryIcon}>{category.icon}</div>
                  <span style={styles.categoryName}>{category.name}</span>
                </button>
              ))}
            </div>

            {/* 검색 결과가 없을 때 */}
            {searchQuery && filteredCategories.length === 0 && (
              <div style={styles.emptyState}>
                검색 결과가 없습니다.
              </div>
            )}
          </div>
        </div>

        {/* 하단 네비게이션 바 */}
        <div style={styles.navbar}>
          <div style={styles.navContainer}>
            <button
              onClick={() => navigate('/main')}
              style={{ ...styles.navButton, color: '#6b7280' }}
            >
              <Home size={24} strokeWidth={2} />
              <span style={{ fontSize: '12px', fontWeight: '500' }}>홈</span>
            </button>

            <button
              onClick={() => navigate('/main/community')}
              style={{ ...styles.navButton, color: '#6b7280' }}
            >
              <Users size={24} strokeWidth={2} />
              <span style={{ fontSize: '12px', fontWeight: '500' }}>커뮤니티</span>
            </button>

            <button
              onClick={() => navigate('/community/mypage')}
              style={{ ...styles.navButton, color: '#6b7280' }}
            >
              <Heart size={24} strokeWidth={2} />
              <span style={{ fontSize: '12px', fontWeight: '500' }}>마이페이지</span>
            </button>

            <button
              onClick={() => navigate('/main/setting')}
              style={{ ...styles.navButton, color: '#6b7280' }}
            >
              <Bell size={24} strokeWidth={2} />
              <span style={{ fontSize: '12px', fontWeight: '500' }}>알림</span>
            </button>
          </div>
        </div>
      </>
    );
  }

  // 식물 선택 화면
  return (
    <>
      <style>{fontStyles}</style>
      <div style={styles.container}>
        {/* 헤더 */}
        <div style={styles.header}>
          <button 
            onClick={() => {
              setStep("category");
              setSelectedPlant(null);
              setSearchQuery("");
            }}
            style={styles.backButton}
          >
            <ChevronLeft size={24} />
          </button>
          <div style={styles.logo}>
            <span>🌱</span>
            <span>PLANTI</span>
          </div>
          <div style={{ width: '24px' }}></div>
        </div>

        {/* 메인 컨텐츠 */}
        <div style={styles.content}>
          {/* 안내 문구 */}
          <p style={styles.title}>키우실 식물을 선택해주세요.</p>

          {/* 검색바 */}
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="식물의 이름을 검색하세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
              onFocus={(e) => e.target.style.borderColor = '#0D986A'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
            <Search style={styles.searchIcon} size={20} />
          </div>

          {/* 식물 리스트 */}
          <div style={styles.plantList}>
            {filteredPlants.map((plant) => {
              const isSelected = selectedPlant?.id === plant.id;
              return (
                <div
                  key={plant.id}
                  onClick={() => setSelectedPlant(isSelected ? null : plant)}
                  style={{
                    ...styles.plantCard,
                    ...(isSelected ? styles.plantCardSelected : styles.plantCardDefault)
                  }}
                >
                  <div style={styles.plantInfo}>
                    {/* 식물 아이콘 */}
                    <div style={styles.plantIcon}>
                      {plant.icon}
                    </div>
                    {/* 식물 정보 */}
                    <div style={styles.plantDetails}>
                      <div style={styles.plantKoreanName}>
                        {plant.koreanName}
                      </div>
                      <div style={styles.plantEnglishName}>
                        {plant.name}
                      </div>
                    </div>
                  </div>
                  {/* 선택 버튼 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlant(isSelected ? null : plant);
                    }}
                    style={{
                      ...styles.selectButton,
                      ...(isSelected ? styles.selectButtonSelected : styles.selectButtonDefault)
                    }}
                  >
                    {isSelected ? '✓' : '+'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* 검색 결과가 없을 때 */}
          {searchQuery && filteredPlants.length === 0 && (
            <div style={styles.emptyState}>
              검색 결과가 없습니다.
            </div>
          )}

          {/* 확인 버튼 */}
          <button
            onClick={handleRegister}
            disabled={!selectedPlant}
            style={{
              ...styles.confirmButton,
              ...(selectedPlant ? styles.confirmButtonActive : styles.confirmButtonDisabled)
            }}
            onMouseEnter={(e) => {
              if (selectedPlant) e.target.style.backgroundColor = '#0a7d55';
            }}
            onMouseLeave={(e) => {
              if (selectedPlant) e.target.style.backgroundColor = '#0D986A';
            }}
          >
            확인
          </button>
        </div>
      </div>

      {/* 하단 네비게이션 바 */}
      <div style={styles.navbar}>
        <div style={styles.navContainer}>
          <button
            onClick={() => navigate('/main')}
            style={{ ...styles.navButton, color: '#6b7280' }}
          >
            <Home size={24} strokeWidth={2} />
            <span style={{ fontSize: '12px', fontWeight: '500' }}>홈</span>
          </button>

          <button
            onClick={() => navigate('/main/community')}
            style={{ ...styles.navButton, color: '#6b7280' }}
          >
            <Users size={24} strokeWidth={2} />
            <span style={{ fontSize: '12px', fontWeight: '500' }}>커뮤니티</span>
          </button>

          <button
            onClick={() => navigate('/community/mypage')}
            style={{ ...styles.navButton, color: '#6b7280' }}
          >
            <Heart size={24} strokeWidth={2} />
            <span style={{ fontSize: '12px', fontWeight: '500' }}>마이페이지</span>
          </button>

          <button
            onClick={() => navigate('/main/setting')}
            style={{ ...styles.navButton, color: '#6b7280' }}
          >
            <Bell size={24} strokeWidth={2} />
            <span style={{ fontSize: '12px', fontWeight: '500' }}>알림</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default NogrowPage1;