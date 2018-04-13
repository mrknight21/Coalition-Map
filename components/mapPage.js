import React from 'react';
import {Text, View} from 'react-native';
import {Card, Icon} from 'react-native-elements';
import MapView, {Marker} from 'react-native-maps';

//import database from './firebase/firebase';

class mapPage extends React.Component {

    state = {
        participants: [],
        landmarks: []
    };

    static navigationOptions = {
        title: 'Map',
        headerStyle: {
            backgroundColor: '#397cf4',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
    };

    // // ---------------- Component lifecycle methods -----------------------------
    componentDidMount() {

        try {

            /* Using getCurrentPosition method on the geolocation to get the current location of user device every 5
            seconds and then firing the showPosition method() */

            this.interval = setInterval(() => { navigator.geolocation.getCurrentPosition(showPosition) }, 5000);

            // showPosition() method using position obtained to get the exact latitude and longitude and storing to DB

            const showPosition = (position) => {

                console.log("getCurrentPosition working!");
                console.log("Latitude: "+ position.coords.latitude + ", Longitude: " + position.coords.longitude);

                database.ref('map001/users/user001').update({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            }


            // Database query to get the details of the Map and store all users who need to be displayed in the State

            database.ref('map001/users')
                .on('value', (snapshot) => {
                    const participants = [];
                    snapshot.forEach((childSnapshot) => {
                        participants.push({
                            id: childSnapshot.key,
                            nameX: childSnapshot.child("name").val().toString(),
                            description: childSnapshot.child('description').val().toString(),
                            lat: childSnapshot.child('lat').val().toString(),
                            lng: childSnapshot.child('lng').val().toString(),
                            shapeX: childSnapshot.child('shape').val().toString(),
                            colorX: childSnapshot.child('color').val().toString(),

                            // ...childSnapshot.val()
                        });
                    })
                    console.log('parti2:');
                    console.log(participants);
                    this.setState(() => ({ participants: participants }));
                }, (error) => {
                    console.log("Error", error);
                });


        //    Second DB query to request landmark information and store to landmarks array in state

            database.ref('map001/landmarks')
                .on('value', (snapshot) => {
                    const landmarks = [];
                    snapshot.forEach((childSnapshot) => {
                        landmarks.push({
                            id: childSnapshot.key,
                            nameX: childSnapshot.child("name").val().toString(),
                            description: childSnapshot.child('description').val().toString(),
                            lat: childSnapshot.child('lat').val().toString(),
                            lng: childSnapshot.child('lng').val().toString(),
                            shapeX: childSnapshot.child('shape').val().toString(),
                            colorX: childSnapshot.child('color').val().toString(),

                            // ...childSnapshot.val()
                        });
                    })
                    console.log('parti2:');
                    console.log(landmarks);
                    this.setState(() => ({ landmarks: landmarks }));
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
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01
                    }}
                >

                    {this.state.participants.map((person) => (
                    <Marker
                        title={person.description}
                        description={person.nameX}
                        coordinate={{
                            latitude: parseFloat(person.lat),
                            longitude: parseFloat(person.lng),
                        }}
                    >
                        <Icon
                            name={person.shapeX}
                            color={person.colorX}
                            raised={true}
                            reverse={true}
                            reverseColor='white'
                        />
                    </Marker>
                ))}


                    {this.state.landmarks.map((mark) => (
                        <Marker
                            title={mark.description}
                            description={mark.nameX}
                            coordinate={{
                                latitude: parseFloat(mark.lat),
                                longitude: parseFloat(mark.lng),
                            }}
                        >
                            <Icon
                                name={mark.shapeX}
                                color={mark.colorX}
                            />
                        </Marker>
                    ))}

                </MapView>
            </View>
        );
    }
}


export default mapPage;