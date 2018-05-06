import * as firebase from 'firebase';

/*
    This is the Firebase connecting JS file where all the Firebase configuration details are stored.
    This is used by various components when requirring DB functionality.
*/

const config = {
    apiKey: "AIzaSyB3UTGzWOrLYMR9cjz3D7p1yl-N8IWXUk0",
    authDomain: "coalition-44a07.firebaseapp.com",
    databaseURL: "https://coalition-44a07.firebaseio.com",
    projectId: "coalition-44a07",
    storageBucket: "coalition-44a07.appspot.com",
    messagingSenderId: "380029306655"
};

fire = firebase.initializeApp(config);

export default fire;