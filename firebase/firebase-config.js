// Firebase Configuration (v8 compatible)
const firebaseConfig = {
    apiKey: "AIzaSyBCMT0MEw886uAchvq5MqP9tLztSvylgEo",
    authDomain: "school-management-system-92615.firebaseapp.com",
    projectId: "school-management-system-92615",
    storageBucket: "school-management-system-92615.firebasestorage.app",
    messagingSenderId: "954041935789",
    appId: "1:954041935789:web:7232d0eceeaecf221ee324"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// Enable offline persistence
db.enablePersistence()
    .catch((err) => {
        if (err.code == 'failed-precondition') {
            console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
        } else if (err.code == 'unimplemented') {
            console.log('The current browser does not support all of the features required to enable persistence');
        }
    });

console.log('Firebase initialized successfully');
