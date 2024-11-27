// Import the functions you need from the SDKs you need
import axios from "axios";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB2SydHkHngeVNXD6w2y-6JyYE4h7RtIXQ",
  authDomain: "ringover-notifications-poc.firebaseapp.com",
  projectId: "ringover-notifications-poc",
  storageBucket: "ringover-notifications-poc.firebasestorage.app",
  messagingSenderId: "224100615935",
  appId: "1:224100615935:web:0f09c575581136bda86eca",
  measurementId: "G-EFWMR9SVQQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
const messaging = getMessaging(app);

const requestForToken = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey:
        "BPky3-zAbnCQJx6-KmWm8r3cK_shOgoFYNGSbuH8-yJ0wzcRN4BTOzxk1WXTmsKC7Cie6_KKOlZa96HXOYrfFpE", // Found in Firebase Console > Project Settings > Cloud Messaging > Web Push certificates
    });

    if (token) {
      console.log("Device token:", token);
      // Send the token to your server to save and use later

      const res = await axios.post(
        "https://0b2f-103-234-156-55.ngrok-free.app/get-token",
        { token }
      );
      console.log(res.data);

      // onMessage(messaging, (payload) => {
      //   console.log("Message received: ", payload);
      //   // window.alert(payload.notification.body);
      // });
    } else {
      console.log(
        "No registration token available. Request permission to generate one."
      );
    }
  } catch (error) {
    console.error("An error occurred while retrieving token. ", error);
  }
};

export { requestForToken, app };
