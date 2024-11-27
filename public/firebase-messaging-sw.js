// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyB2SydHkHngeVNXD6w2y-6JyYE4h7RtIXQ",
  authDomain: "ringover-notifications-poc.firebaseapp.com",
  projectId: "ringover-notifications-poc",
  storageBucket: "ringover-notifications-poc.firebasestorage.app",
  messagingSenderId: "224100615935",
  appId: "1:224100615935:web:0f09c575581136bda86eca",
  measurementId: "G-EFWMR9SVQQ",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
