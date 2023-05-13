import { initializeApp, FirebaseOptions } from "firebase/app";

import { 
    getMessaging,
    getToken,
    deleteToken,
    onMessage,
} from "firebase/messaging";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MSG_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// FCM
const SUBSCRIBED_MSG_TOPIC = 'TestFCM';
const messaging = getMessaging(app);
const isTokenSentToServer = () => {
    return window.localStorage.getItem('sentToServer') === '1';
}
const setTokenSentToServer = (sent: boolean) => {
    window.localStorage.setItem('sentToServer', sent ? '1' : '0');
}
const sendTokenToServer = async (currentToken: any) => {
    if (!isTokenSentToServer()) {
        console.log('Sending token to server...');
        setTokenSentToServer(true);
    } else {
        console.log('Token already sent to server so won\'t send it again ' +
            'unless it changes');
    }
};
async function initFCM() {
    const token = await getToken(messaging, { vapidKey:process.env.FIREBASE_VAPID_KEY })
    .then((currentToken: any) => {
        console.log('current token:', currentToken)
        return currentToken
        ? { data: currentToken, error: null }
        : { data: null, error: 'No registration token available. Request permission to generate one.' }
    }).catch((err: any) => ({ data: null, error: err }));

    if(token.data) {
        await sendTokenToServer(token.data);
        await subscribeToTopic(SUBSCRIBED_MSG_TOPIC, token.data)
    } else {
        console.log(token.error)
    }
}

function deleteFCMToken() {
    // Delete registration token.
    deleteToken(messaging)
    .then(async () => {
        console.log('Token deleted.');
        setTokenSentToServer(false);
        // Once token is deleted update UI.
        
        await initFCM();
    }).catch((err: any) => {
        console.log('Unable to delete token. ', err);
    });
}


const onMessageListener = () => new Promise((resolve) => {
    onMessage(messaging, (payload) => {
        resolve(payload);
    });
});

const subscribeToTopic = async (topic: string, token: string) => {
    // Subscribe to the topic, requires Cloud Messaging API (Legacy) enabled.
    // Ref. https://console.cloud.google.com/apis/library/googlecloudmessaging.googleapis.com?authuser=0&project=766275633550&hl=en
    const topicURL: string = `https://iid.googleapis.com/iid/v1/${token}/rel/topics/${topic}`;

    const headers = new Headers();
    headers.append('content-type', 'application/json');
    headers.append('Authorization', `key=${process.env.REACT_APP_FIREBASE_CM_API_LEGACY}`);

    const response = await fetch(topicURL, { method: 'POST', headers })
    .then((r) => ({ data: r, error: null }))
    .catch((e) => ({ data: null, error: e }))

    console.log('subscribeToTopic:', response)

    return response;
}

// Request notification permissions from the user
async function requestNotificationPermission() {
    if (!('Notification' in window)) {
        // Check if the browser supports notifications
        alert('This browser does not support desktop notification');
    } else if (Notification.permission === 'granted') {
        new Notification('Welcome');
        await initFCM();
    } else if (Notification.permission !== 'denied') {
        // We need to ask the user for permission
        Notification.requestPermission().then(async (permission) => {
            // If the user accepts, let's create a notification
            if (permission === 'granted') {
                await initFCM();
            } else {
                console.log('Unable to get permission to notify.');
            }
        });
    }
}

export {
    app,
    messaging,
    subscribeToTopic,
    onMessageListener,
    onMessage,
    deleteFCMToken,
    requestNotificationPermission
}