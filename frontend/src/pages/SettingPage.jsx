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

  // 로딩 중 표시
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>알림을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column' }}>
      {/* 헤더 */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>알림</h1>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {unreadCount > 0 && (
              <>
                <div style={{ 
                  backgroundColor: '#10b981', 
                  color: 'white', 
                  fontSize: '0.875rem', 
                  fontWeight: '600',
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '9999px' 
                }}>
                  {unreadCount}개의 새 알림
                </div>
                <button
                  onClick={markAllAsRead}
                  style={{
                    padding: '0.25rem 0.75rem',
                    fontSize: '0.875rem',
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
        
        {/* 토글 버튼 */}
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setShowUnreadOnly(false)}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              fontWeight: showUnreadOnly ? 'normal' : '600',
              backgroundColor: showUnreadOnly ? 'white' : '#10b981',
              color: showUnreadOnly ? '#6b7280' : 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            전체 알림
          </button>
          <button
            onClick={() => setShowUnreadOnly(true)}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              fontWeight: showUnreadOnly ? '600' : 'normal',
              backgroundColor: showUnreadOnly ? '#10b981' : 'white',
              color: showUnreadOnly ? 'white' : '#6b7280',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            읽지 않은 알림 {unreadCount > 0 && `(${unreadCount})`}
          </button>
        </div>
      </div>

      {/* 알림 리스트 */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '6rem' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
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
                gap: '0.75rem',
                padding: '1rem 1.5rem',
                borderBottom: '1px solid #f3f4f6',
                cursor: 'pointer',
                backgroundColor: notification.isRead ? 'white' : '#ecfdf5',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = notification.isRead ? 'white' : '#ecfdf5'}
            >
              {/* 읽음/안읽음 표시 */}
              <div style={{ flexShrink: 0, marginTop: '0.25rem' }}>
                {!notification.isRead && (
                  <div style={{ 
                    width: '0.75rem', 
                    height: '0.75rem', 
                    backgroundColor: '#10b981', 
                    borderRadius: '9999px' 
                  }}></div>
                )}
                {notification.isRead && (
                  <div style={{ width: '0.75rem', height: '0.75rem' }}></div>
                )}
              </div>

              {/* 아이콘 */}
              <div style={{ flexShrink: 0, marginTop: '0.125rem' }}>
                {getNotificationIcon(notification.noticeType)}
              </div>

              {/* 알림 내용 */}
              <div style={{ flex: 1 }}>
                {/* deviceNickname이 있으면 표시 (기존 plantName, userName 대체) */}
                {notification.deviceNickname && (
                  <p style={{ 
                    fontSize: '0.75rem',
                    color: notification.isRead ? '#6b7280' : '#059669',
                    fontWeight: notification.isRead ? 'normal' : '600'
                  }}>
                    {notification.deviceNickname}
                  </p>
                )}
                <p style={{ 
                  fontSize: '0.875rem',
                  marginTop: '0.125rem',
                  color: notification.isRead ? '#6b7280' : '#1f2937',
                  fontWeight: notification.isRead ? 'normal' : '500'
                }}>
                  {notification.message}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                  {formatTime(notification.createdAt)}
                  {/* 우선순위가 1(긴급)인 경우 표시 */}
                  {notification.priority === 1 && (
                    <span style={{ marginLeft: '0.5rem', color: '#ef4444' }}>⚠ 긴급</span>
                  )}
                </p>
              </div>

              {/* 삭제 버튼 추가 */}
              <button
                onClick={(e) => deleteNotification(notification.id, e)}
                style={{
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '0.25rem'
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
      <div style={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        backgroundColor: 'white', 
        borderTop: '1px solid #e5e7eb',
        boxShadow: '0 -1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-around', 
          padding: '0.75rem 1rem',
          maxWidth: '28rem',
          margin: '0 auto'
        }}>
          <button
            onClick={() => navigate('/main')}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '0.25rem',
              color: '#6b7280',
              minWidth: '60px',
              border: 'none',
              background: 'none',
              cursor: 'pointer'
            }}
          >
            <Home size={24} strokeWidth={2} />
            <span style={{ fontSize: '0.75rem', fontWeight: '500' }}>홈</span>
          </button>
          
          <button
            onClick={() => navigate('/main/community')}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '0.25rem',
              color: '#6b7280',
              minWidth: '60px',
              border: 'none',
              background: 'none',
              cursor: 'pointer'
            }}
          >
            <Users size={24} strokeWidth={2} />
            <span style={{ fontSize: '0.75rem', fontWeight: '500' }}>커뮤니티</span>
          </button>
          
          <button
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '0.25rem',
              color: '#6b7280',
              minWidth: '60px',
              border: 'none',
              background: 'none',
              cursor: 'pointer'
            }}
          >
            <Heart size={24} strokeWidth={2} />
            <span style={{ fontSize: '0.75rem', fontWeight: '500' }}>좋아요</span>
          </button>
          
          <button
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '0.25rem',
              color: '#10b981',
              minWidth: '60px',
              border: 'none',
              background: 'none',
              cursor: 'pointer'
            }}
          >
            <Bell size={24} strokeWidth={2} />
            <span style={{ fontSize: '0.75rem', fontWeight: '500' }}>알림</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingPage;