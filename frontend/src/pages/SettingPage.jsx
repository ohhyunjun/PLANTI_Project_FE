import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Home, Users, Heart, Sprout, Droplet, ThermometerSnowflake, Apple, MessageCircle, ThumbsUp, ChevronLeft } from 'lucide-react';
import { getNotifications, markNotificationAsRead, deleteNotificationById, getUnreadNotifications, getUnreadCount } from '../api/notification';

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

function SettingPage() {
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = showUnreadOnly 
        ? await getUnreadNotifications()
        : await getNotifications();
      setNotifications(response.data);
      
      const countResponse = await getUnreadCount();
      setUnreadCount(countResponse.data.unreadCount);
    } catch (error) {
      console.error('알림 조회 실패:', error);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, [showUnreadOnly]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const getNotificationIcon = (type) => {
    const iconProps = { size: 20, color: '#0D986A' }; // <<< 아이콘 색상 변경
    switch(type) {
      case 'GROWTH_STAGE_CHANGED':
      case 'FRUIT_FIRST_APPEARED':
      case 'growth':
        return <Sprout {...iconProps} />;
      case 'WATER_SHORTAGE':
      case 'water':
        return <Droplet {...iconProps} />;
      case 'PEST_DETECTED':
      case 'temperature':
        return <ThermometerSnowflake {...iconProps} />;
      case 'HARVEST_READY':
      case 'harvest':
        return <Apple {...iconProps} />;
      case 'comment':
        return <MessageCircle {...iconProps} />;
      case 'like':
        return <ThumbsUp {...iconProps} />;
      case 'SYSTEM_ALERT':
      default:
        return <Bell {...iconProps} />;
    }
  };

  const handleNotificationClick = async (id) => {
    try {
      await markNotificationAsRead(id);
      
      const notification = notifications.find(n => n.id === id);
      if (notification && !notification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error);
    }
  };

  const deleteNotification = async (id, e) => {
    e.stopPropagation();
    try {
      await deleteNotificationById(id);
      
      const notification = notifications.find(n => n.id === id);
      if (notification && !notification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (error) {
      console.error('알림 삭제 실패:', error);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    return `${days}일 전`;
  };

  const styles = {
    container: {
      minHeight: '100vh',
      maxWidth: '412px',
      margin: '0 auto',
      backgroundColor: '#f9fafb',
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
      position: 'sticky',
      top: 0,
      zIndex: 100
    },
    backButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '8px',
      marginRight: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    logo: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#374151',
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

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <p>알림을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{fontStyles}</style>
      
      <div style={styles.header}>
        <button 
          style={styles.backButton}
          onClick={() => navigate('/main')}
        >
          <ChevronLeft size={24} />
        </button>
        <div style={styles.logo}>
          <span>알림</span>
        </div>
      </div>

      <div style={{ padding: '16px', backgroundColor: '#f9fafb' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setShowUnreadOnly(false)}
            style={{
              padding: '8px 16px', fontSize: '14px',
              fontWeight: showUnreadOnly ? 'normal' : '600',
              backgroundColor: showUnreadOnly ? 'white' : '#0D986A', // <<< 색상 변경
              color: showUnreadOnly ? '#6b7280' : 'white',
              border: '1px solid #e5e7eb', borderRadius: '8px',
              cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            전체 알림
          </button>
          <button
            onClick={() => setShowUnreadOnly(true)}
            style={{
              padding: '8px 16px', fontSize: '14px',
              fontWeight: showUnreadOnly ? '600' : 'normal',
              backgroundColor: showUnreadOnly ? '#0D986A' : 'white', // <<< 색상 변경
              color: showUnreadOnly ? 'white' : '#6b7280',
              border: '1px solid #e5e7eb', borderRadius: '8px',
              cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            읽지 않은 알림 {unreadCount > 0 && `(${unreadCount})`}
          </button>
        </div>
      </div>

      {/* 알림 리스트 */}
      <div style={{ flex: 1, overflowY: 'auto', paddingTop: '4px' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
            알림이 없습니다.
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification.id)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '16px',
                cursor: 'pointer',
                backgroundColor: notification.isRead ? 'white' : '#E7F5EF', // <<< 색상 변경
                transition: 'background-color 0.2s',
                borderRadius: '12px',
                margin: '0 16px 12px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = notification.isRead ? 'white' : '#E7F5EF'} // <<< 색상 변경
            >
              <div style={{ flexShrink: 0, marginTop: '4px' }}>
                {!notification.isRead && (
                  <div style={{ 
                    width: '12px', 
                    height: '12px', 
                    backgroundColor: '#0D986A', // <<< 색상 변경
                    borderRadius: '9999px' 
                  }}></div>
                )}
                {notification.isRead && (
                  <div style={{ width: '12px', height: '12px' }}></div>
                )}
              </div>

              <div style={{ flexShrink: 0, marginTop: '2px' }}>
                {getNotificationIcon(notification.noticeType)}
              </div>

              <div style={{ flex: 1 }}>
                {notification.deviceNickname && (
                  <div style={{
                    display: 'inline-block',
                    backgroundColor: notification.isRead ? '#f3f4f6' : '#ccece0', // <<< 색상 변경
                    color: notification.isRead ? '#6b7280' : '#0D986A', // <<< 색상 변경
                    fontSize: '12px',
                    fontWeight: '600',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    marginBottom: '4px'
                  }}>
                     {notification.deviceNickname}
                  </div>
                )}
                <p style={{ 
                  fontSize: '14px',
                  marginTop: '2px',
                  color: notification.isRead ? '#6b7280' : '#1f2937',
                  fontWeight: notification.isRead ? 'normal' : '500'
                }}>
                  {notification.message}
                </p>
                <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                  {formatTime(notification.createdAt)}
                  {notification.priority === 1 && (
                    <span style={{ marginLeft: '8px', color: '#ef4444' }}>⚠ 긴급</span>
                  )}
                </p>
              </div>

              <button
                onClick={(e) => deleteNotification(notification.id, e)}
                style={{
                  padding: '4px 8px',
                  fontSize: '12px',
                  color: '#6b7280',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#fee2e2'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

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
            style={{ ...styles.navButton, color: '#6b7280' }}>
            <Heart size={24} strokeWidth={2} />
            <span style={{ fontSize: '12px', fontWeight: '500' }}>마이페이지</span>
          </button>
          
          <button
            onClick={() => navigate('/main/setting')}
            style={{ ...styles.navButton, color: '#0D986A' }} // <<< 색상 변경
          >
            <Bell size={24} strokeWidth={2} />
            <span style={{ fontSize: '12px', fontWeight: '500' }}>알림</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingPage;