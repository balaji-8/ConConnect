import React, { useState } from "react";

const NotificationSound = () => {
  const [audio] = useState(new Audio("/notification.mp3"));

  const playNotificationSound = () => {
    audio.play();
  };

  return <button onClick={playNotificationSound} />;
};

export default NotificationSound;
