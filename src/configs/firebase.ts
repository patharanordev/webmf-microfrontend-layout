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
const SUBSCRIBED_MSG_TOPIC = 'Test FCM';
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
async function initFCM(topic:string) {
    const token = await getToken(messaging, { vapidKey:process.env.FIREBASE_VAPID_KEY })
    .then((currentToken: any) => {
        console.log('current token:', currentToken)
        return currentToken
        ? { data: currentToken, error: null }
        : { data: null, error: 'No registration token available. Request permission to generate one.' }
    }).catch((err: any) => ({ data: null, error: err }));

    if(token.data) {
        await sendTokenToServer(token.data);
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
        
        await initFCM(SUBSCRIBED_MSG_TOPIC);
    }).catch((err: any) => {
        console.log('Unable to delete token. ', err);
    });
}

// Request notification permissions from the user
async function requestNotificationPermission() {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
        await initFCM(SUBSCRIBED_MSG_TOPIC);
    } else {
        console.log('Unable to get permission to notify.');
    }
}

requestNotificationPermission();

export {
    app,
    messaging,
    onMessage,
    deleteFCMToken,
    requestNotificationPermission
}