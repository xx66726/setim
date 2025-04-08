import { useState, useEffect, useCallback } from 'react';
import { Bell } from 'lucide-react';
import ContentModal from './ContentModal';

const NotificationButton = () => {
  const [isNotificationActive, setIsNotificationActive] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Check if notification should be active based on last dismissed time
  useEffect(() => {
    const checkNotificationStatus = () => {
      try {
        const lastDismissedTime = localStorage.getItem('notificationDismissedTime');

        if (lastDismissedTime) {
          const lastDismissed = new Date(lastDismissedTime);
          const now = new Date();

          // Reset notification if it's a new day (past midnight)
          if (
            lastDismissed.getDate() !== now.getDate() ||
            lastDismissed.getMonth() !== now.getMonth() ||
            lastDismissed.getFullYear() !== now.getFullYear()
          ) {
            setIsNotificationActive(true);
            localStorage.removeItem('notificationDismissed');
          } else {
            // Check if notification was dismissed today
            const notificationStatus = localStorage.getItem('notificationDismissed');
            setIsNotificationActive(notificationStatus !== 'true');
          }
        }
      } catch (err) {
        console.error('Error checking notification status:', err);
      }
    };

    // Check status on mount
    checkNotificationStatus();
  }, []);

  // Start animation if notification is active
  useEffect(() => {
    if (isNotificationActive) {
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
    }
  }, [isNotificationActive]);

  // Memoized handler for notification click
  const handleNotificationClick = useCallback(() => {
    setIsModalOpen(true);

    // If this is the first time clicking notification, disable the animation
    if (isNotificationActive) {
      setIsNotificationActive(false);
      setIsAnimating(false);
      try {
        localStorage.setItem('notificationDismissed', 'true');
        localStorage.setItem('notificationDismissedTime', new Date().toISOString());
      } catch (err) {
        console.error('Error setting notification dismissed status:', err);
      }
    }
  }, [isNotificationActive]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <>
      <button
        onClick={handleNotificationClick}
        className={`absolute top-0 left-4 md:left-8 mt-4 p-3 rounded-full bg-white shadow-md hover:bg-gray-50 transition-all ${
          isAnimating ? 'animate-pulse' : ''
        } hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-200`}
        aria-label="Notifications"
      >
        <Bell size={24} className="text-indigo-700" />
        {isNotificationActive && (
          <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500">
            <span className="absolute inset-0 rounded-full bg-red-400 opacity-75 animate-ping"></span>
          </span>
        )}
      </button>

      <ContentModal isOpen={isModalOpen} onRequestClose={closeModal} />
    </>
  );
};

export default NotificationButton;