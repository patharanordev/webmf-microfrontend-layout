import { requestNotificationPermission, onMessage, messaging } from '../configs/firebase';
import React, { useEffect } from 'react';

function ExampleFCM() {

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <div>
      
    </div>
  );
}

export default ExampleFCM;