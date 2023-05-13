import React, { useState } from "react";

const ExampleInAppNotification = (props: any) => {
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);

  const callNotification = () => {
    if (notificationPermission !== 'granted') {
      Notification.requestPermission().then(permission => {
        setNotificationPermission(permission);
      });
    } else {
      new Notification('Hello, world!');
    }
  }

  return (
    <div>
      <button onClick={callNotification}>
      {notificationPermission === 'granted' ? 'Show Notification' : 'Request Permission'}
      </button>
    </div>
  );
};

export default ExampleInAppNotification;

ExampleInAppNotification.displayName = "ExampleInAppNotification";
