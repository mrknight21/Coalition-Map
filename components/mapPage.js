import React from 'react';
import {Text, View} from 'react-native';
import {Card} from 'react-native-elements';
import MapView, {Marker} from 'react-native-maps';

import database from './firebase/firebase';

class mapPage extends React.Component {

    state = {
        participants: []
    };

    static navigationOptions = {
        title: 'Map',
        headerStyle: {
            backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
    };

    // ---------------- Component lifecycle methods -----------------------------
    componentDidMount() {

        try {

            /* Using getCurrentPosition method on the geolocation to get the current location of user device every 5
            seconds and then firing the showPosition method() */

            this.interval = setInterval(() => { navigator.geolocation.getCurrentPosition(showPosition) }, 5000);

            // showPosition() method using position obtained to get the exact latitude and longitude and storing to DB

            const showPosition = (position) => {

                console.log("getCurrentPosition working!");
                console.log("Latitude: "+ position.coords.latitude + ", Longitude: " + position.coords.longitude);

                database.ref('testMapA/testUser1').update({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            }


            // Database query to get the details of the Map and store all users who need to be displayed in the State

            database.ref('testMapA')
                .on('value', (snapshot) => {
                    const participants = [];
                    snapshot.forEach((childSnapshot) => {
                        participants.push({
                            id: childSnapshot.key,
                            userName: childSnapshot.child("userName").val().toString(),
                            lat: childSnapshot.child('lat').val().toString(),
                            lng: childSnapshot.child('lng').val().toString()
                            // ...childSnapshot.val()
                        });
                    })
                    console.log('parti2:');
                    console.log(participants);
                    this.setState(() => ({ participants: participants }));
                }, (error) => {
                    console.log("Error", error);
                });

        } catch (e) {
            console.log("error", e);
        }
    }


    //--------------------------- rendering method ---------------------------
    render() {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <MapView
                    style={{
                        left:0,
                        right:0,
                        top:0,
                        bottom:0,
                        position: 'absolute'
                    }}
                    region={{
                        latitude: -36.856,
                        longitude: 174.765644,
                        latitudeDelta: 0.1,
                        longitudeDelta: 0.1
                    }}
                >
                    <Marker
                        coordinate={{
                            latitude: -36.856,
                            longitude: 174.765644,
                        }}
                    />

                </MapView>
            </View>
        );
    }
}


export default mapPage;