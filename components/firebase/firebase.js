import * as firebase from 'firebase';

const config = {
    apiKey: "AIzaSyB3UTGzWOrLYMR9cjz3D7p1yl-N8IWXUk0",
    authDomain: "coalition-44a07.firebaseapp.com",
    databaseURL: "https://coalition-44a07.firebaseio.com",
    projectId: "coalition-44a07",
    storageBucket: "coalition-44a07.appspot.com",
    messagingSenderId: "380029306655"
};

fire = firebase.initializeApp(config);

console.log("CONNECTED");

export default fire;