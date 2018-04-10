import * as firebase from 'firebase';

const config = {
    apiKey: "AIzaSyAOZYDe2wCeRyK0CNIZqFryVN1kYgBXRTg",
    authDomain: "mapproject-d45fc.firebaseapp.com",
    databaseURL: "https://mapproject-d45fc.firebaseio.com",
    projectId: "mapproject-d45fc",
    storageBucket: "mapproject-d45fc.appspot.com",
    messagingSenderId: "839471714785"
};

firebase.initializeApp(config);

console.log("CONNECTED")

const database = firebase.database();

export {firebase, database as default};