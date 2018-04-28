import React from 'react';
import {Text, View} from 'react-native';
import {Card, Icon} from 'react-native-elements';
import MapView, {Marker, AnimatedRegion, Animated} from 'react-native-maps';

import firebase from './firebase/firebase';

class mapPage extends React.Component {



    static navigationOptions = {
        title: 'Map: '+this.mapcode,
        headerStyle: {
            backgroundColor: '#397cf4',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
    };

    constructor(props) {
        super(props);
        this.state = {
            participants: [],
            landmarks: [],
            addMarker: {
                latitude: -36.8561968,
                longitude: 174.7624813,
            }
        };
        this.mapcode = this.props.navigation.state.params.mapcode;
        this.uid = this.props.navigation.state.params.uid;
    }

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
                firebase.database().ref(this.mapcode+'/users/'+this.uid).update({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            };


            // firebase.database() query to get the details of the Map and store all users who need to be displayed in the State

            firebase.database().ref(this.mapcode+'/users')
                .on('value', (snapshot) => {
                    const participants = [];
                    snapshot.forEach((childSnapshot) => {
                        participants.push({
                            idKey: childSnapshot.key,
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

            firebase.database().ref(this.mapcode+'/landmarks')
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

    //When the map component dismounts, the interval updating current location is cleared
    //And the map entry is deleted.
    componentWillUnmount() {
        try {

            clearInterval(this.interval);

            firebase.database().ref(this.mapcode+'/users/'+this.uid).remove();

        } catch (e) {
            console.log("error", e);
        }
    }


    //--------------------------- rendering method ---------------------------
    render() {
        return (
            <View style={{flex: 1, alignItems: 'stretch'}}>
                <MapView
                    style={{
                        flex: 4,
                    }}

                    initialRegion={{
                        latitude: -36.856,
                        longitude: 174.765644,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01
                    }}
                >

                    {this.state.participants.map((person) => (
                    <Marker
                        key={person.idKey}
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
                            key={mark.idKey}
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

                    <Marker draggable
                            coordinate={this.state.addMarker}
                            onDragEnd={(e) => this.setState({ addMarker: e.nativeEvent.coordinate })}
                    >
                        <Icon
                            name="beenhere"
                            color="pink"
                        />
                    </Marker>


                </MapView>
                <View
                    style={{
                        flex:1,
                        flexDirection: 'row',
                        backgroundColor: 'grey',
                        alignItems: 'center',
                        justifyContent: 'center'
                }}>
                    <Icon
                        style={{
                            flex: 1,
                            justifyContent: 'space-between',
                            // alignItems: 'flex-end',
                            // backgroundColor: 'grey',
                        }}
                        name="add"
                        // color="green"
                        raised={true}
                        // reverse={true}
                        // reverseColor='white'
                    />
                    <Icon
                        style={{
                            flex: 1,
                            // position: "absolute", bottom: 0, right: 0,
                            justifyContent: 'space-between',
                            // alignItems: 'flex-end',
                            // backgroundColor: 'grey',
                        }}
                        name="message"
                        raised={true}
                    />
                </View>
            </View>
        );
    }
}


export default mapPage;