// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  messagingSenderId: "766275633550",
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