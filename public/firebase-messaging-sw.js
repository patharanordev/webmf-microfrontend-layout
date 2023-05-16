// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyAnzzE1dZboGFo5V7PlWZgT6QdR4o_wi",
  authDomain: "temp-bedee-rtdb.firebaseapp.com",
  projectId: "temp-bedee-rtdb",
  storageBucket: "temp-bedee-rtdb.appspot.com",
  messagingSenderId: "766275633550",
  appId: "1:766275633550:web:14bb751e6f899301c7e4df"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  let notificationTitle = '';
  let notificationOptions = { body:'' };

  if (payload.data) {
    notificationTitle = 'Updated';

    try {
      notificationOptions.body = payload.data;
    } catch (err) {

    } finally {
      notificationOptions.body = 'Got new information';
    }
  } else if (payload.notification) {
    notificationTitle = payload.notification.title;
    notificationOptions.body = payload.notification.body;
  }

  self.registration.showNotification(notificationTitle, notificationOptions);
});