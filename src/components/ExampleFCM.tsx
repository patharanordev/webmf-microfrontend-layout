import { requestNotificationPermission, onMessageListener } from '../configs/firebase';
import React, { useEffect, useState } from 'react';

function ExampleFCM() {

  const [show, setShow] = useState(false);
  const [notification, setNotification] = useState({title: '', body: ''});

  onMessageListener().then(payload => {
    setShow(true);
    setNotification({title: payload?.notification?.title, body: payload?.notification?.body})
    console.log(payload);
  }).catch(err => console.log('failed: ', err));

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <div>
      
    </div>
  );
}

export default ExampleFCM;