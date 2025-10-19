import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Home, Users, Heart, Sprout, Droplet, ThermometerSnowflake, Apple, MessageCircle, ThumbsUp } from 'lucide-react';
// apiClient 직접 참조 대신, notification API 함수들을 가져옵니다.
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotificationById, getUnreadNotifications, getUnreadCount } from '../api/notification';

function SettingPage() {
  const navigate = useNavigate();
  
  // 기존 상태 유지 - 백엔드에서 받아올 데이터로 변경
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // 백엔드에서 알림 목록 조회
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      // 수정된 부분: 토글 상태에 따라 다른 API 호출
      const response = showUnreadOnly 
        ? await getUnreadNotifications()
        : await getNotifications();
      setNotifications(response.data);
      
      // 읽지 않은 개수도 함께 조회
      const countResponse = await getUnreadCount();
      setUnreadCount(countResponse.data.unreadCount);
    } catch (error) {
      console.error('알림 조회 실패:', error);
      // 실패 시 빈 배열로 설정
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, [showUnreadOnly]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // 기존 getNotificationIcon 함수 유지하되, 백엔드 타입과 매핑
  const getNotificationIcon = (type) => {
    const iconProps = { size: 20, className: "text-green-600" };
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

  // 기존 handleNotificationClick 수정 - 백엔드 API 호출
  const handleNotificationClick = async (id) => {
    try {
      // 수정된 부분: markNotificationAsRead 함수 사용
      await markNotificationAsRead(id);
      
      const notification = notifications.find(n => n.id === id);
      // 읽지 않은 알림이었다면 개수 감소
      if (notification && !notification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      // 프론트엔드 상태 업데이트
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error);
    }
  };

  // 모든 알림 읽음 처리 추가
  const markAllAsRead = async () => {
    try {
      // 수정된 부분: markAllNotificationsAsRead 함수 사용
      await markAllNotificationsAsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      // 읽지 않은 개수 0으로 업데이트
      setUnreadCount(0);
    } catch (error) {
      console.error('모든 알림 읽음 처리 실패:', error);
    }
  };

  // 알림 삭제 기능 추가
  const deleteNotification = async (id, e) => {
    e.stopPropagation();
    try {
      // 수정된 부분: deleteNotificationById 함수 사용
      await deleteNotificationById(id);
      
      const notification = notifications.find(n => n.id === id);
      // 읽지 않은 알림이었다면 개수 감소
      if (notification && !notification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (error) {
      console.error('알림 삭제 실패:', error);
    }
  };

  // 시간 포맷 함수 추가
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

  // 스타일 객체 추가 (MainPage와 동일한 구조)
  const styles = {
  container: {
    minHeight: '100vh',
    maxWidth: '412px',
    minWidth: '412px',  // ✅ 추가: 최소 너비 고정
    margin: '0 auto',
    backgroundColor: '#f9fafb',
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: '80px',
    width: '100%',
    boxSizing: 'border-box',
  },
  header: {
    backgroundColor: 'white',
    borderBottom: '1px solid #e5e7eb',
    padding: '16px 24px',
    boxSizing: 'border-box'
  },
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
    minWidth: '412px',  // ✅ 추가: 최소 너비 고정
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
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flex: 1
        }}>
          <p>알림을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* 헤더 */}
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>알림</h1>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {unreadCount > 0 && (
              <>
                <div style={{ 
                  backgroundColor: '#10b981', 
                  color: 'white', 
                  fontSize: '14px', 
                  fontWeight: '600',
                  padding: '4px 12px', 
                  borderRadius: '9999px' 
                }}>
                  {unreadCount}개의 새 알림
                </div>
                <button
                  onClick={markAllAsRead}
                  style={{
                    padding: '4px 12px',
                    fontSize: '14px',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '9999px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  모두 읽음
                </button>
              </>
            )}
          </div>
        </div>
        
        <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setShowUnreadOnly(false)}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: showUnreadOnly ? 'normal' : '600',
              backgroundColor: showUnreadOnly ? 'white' : '#10b981',
              color: showUnreadOnly ? '#6b7280' : 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            전체 알림
          </button>
          <button
            onClick={() => setShowUnreadOnly(true)}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: showUnreadOnly ? '600' : 'normal',
              backgroundColor: showUnreadOnly ? '#10b981' : 'white',
              color: showUnreadOnly ? 'white' : '#6b7280',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            읽지 않은 알림 {unreadCount > 0 && `(${unreadCount})`}
          </button>
        </div>
      </div>

      {/* 알림 리스트 */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
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
                padding: '16px 24px',
                borderBottom: '1px solid #f3f4f6',
                cursor: 'pointer',
                backgroundColor: notification.isRead ? 'white' : '#ecfdf5',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = notification.isRead ? 'white' : '#ecfdf5'}
            >
              <div style={{ flexShrink: 0, marginTop: '4px' }}>
                {!notification.isRead && (
                  <div style={{ 
                    width: '12px', 
                    height: '12px', 
                    backgroundColor: '#10b981', 
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
                    backgroundColor: notification.isRead ? '#f3f4f6' : '#d1fae5',
                    color: notification.isRead ? '#6b7280' : '#059669',
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
            style={{ ...styles.navButton, color: '#6b7280' }}
          >
            <Heart size={24} strokeWidth={2} />
            <span style={{ fontSize: '12px', fontWeight: '500' }}>좋아요</span>
          </button>
          
          <button
            style={{ ...styles.navButton, color: '#10b981' }}
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