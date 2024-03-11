import React from 'react';
import styles from './Notification.module.css';

function Notifications({ notifications, onClose }) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Notifications</h2>
        <button onClick={onClose} className={styles.notificationclosebutton}>
          Close
        </button>
      </div>
      <div className={styles.notifications}>
        {notifications.map((notification) => (
          <div key={notification.id} className={styles.notification}>
            {console.log(notification.read)} {/* Log the read property */}
            {console.log(notification.message)}
            <p>{notification.message}</p>
            <p>{notification.read}</p>

            
            
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;
