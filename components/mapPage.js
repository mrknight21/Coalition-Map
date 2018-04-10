import React from 'react';
import {Text, View} from 'react-native';
import {Card} from 'react-native-elements';
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
            this.interval = setInterval(() => { navigator.geolocation.getCurrentPosition(showPosition) }, 5000);
            const showPosition = (position) => {
                console.log("Fired!");
                console.log(position.coords.latitude)
                console.log(position.coords.longitude)
                database.ref('testMapA/testUser1').update({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            }

            console.log("hello");
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
                <Card>
                    <Text>Map</Text>
                </Card>
            </View>
        );
    }
}

export default mapPage;