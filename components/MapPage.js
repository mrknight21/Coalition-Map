import React from 'react';
import {View, Text, ScrollView} from 'react-native';
import {Icon, Button, FormInput} from 'react-native-elements';
import MapView, {Marker} from 'react-native-maps';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from './firebase/firebase';
import Overlay from 'react-native-modal-overlay';

import Android_bot from './Android_bot';
import MenuButtonGroup from './mapComponents/MenuButtonGroup';
import PersonMarker from './mapComponents/PersonMarker';
import LandmarkMarker from './mapComponents/LandmarkMarker';
import AddMarkerCard from './mapComponents/AddMarkerCard';

/*
MAP COMPONENT:
>   This component is the Map component where all the user interaction will occur.
>   Due to the considerable logic required for this component, further smaller components have been created and imported
    here.

Note #1.    For these smaller components, see the ./mapComponents folder.

 */

class mapPage extends React.Component {

    // Navigator static parameters

    static navigationOptions = ({navigation}) => ({
        title: 'Map: ' + navigation.state.params.mapcode,
        headerStyle: {
            backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
        headerRight: navigation.state.params.host ?
            <Icon2 reverse name="delete" size={30} color='white' onPress={() => {
                navigation.state.params.clear();
                firebase.database().ref(navigation.state.params.mapcode).remove();
                navigation.navigate('signIn');
            }}/> : null
    });

    //  Constructor setting out all the states used in the Map component.

    constructor(props) {
        super(props);
        this.state = {
            participants: [],
            landmarks: [],
            bots: null,
            addMarker: {
                addMarkerDescription: "default",
                addMarkerCardVisibility: true,
                addMarkerColor: "green",
                addMarkerShape: "beenhere",
                addMarkerName: ""
            },
            addMarkerCoordinates: {
                latitude: -36.8561968,
                longitude: 174.7624813,
            },
            currentCoordinates: {
                latitude: -36.8561968,
                longitude: 174.7624813,
            },
            mounted: true,
            modalVisible: false,
            messageText: ""


        };
        this.mapcode = this.props.navigation.state.params.mapcode;
        this.uid = this.props.navigation.state.params.uid;
        this.host = this.props.navigation.state.params.host;
    }

    // ---------------- Component lifecycle methods -----------------------------

    //  A. ComponentDidMount lifecycle, where actions taken when the component is loaded.

    componentDidMount() {

        try {

            /* Checks whether state is mounted, and if so does two things during 1 second intervals:

                (1)     Getting Robot/Zombie's and setting their locations.
                (2)     Using getCurrentPosition method on the geolocation to get the current location of user device
                        and then firing the showPosition method()

            */
            if (this.state.mounted) {
                this.interval = setInterval(() => {

                    if (this.host && this.state.participants.length > 0 && this.state.bots !== null) {
                        firebase.database().ref(this.mapcode + '/users')
                            .once('value', (snapshot) => {
                                const users = [];
                                snapshot.forEach((childSnapshot) => {
                                    users.push({
                                        id: childSnapshot.key,
                                        nameX: childSnapshot.child("name").val().toString(),
                                        description: childSnapshot.child('description').val().toString(),
                                        lat: childSnapshot.child('lat').val().toString(),
                                        lng: childSnapshot.child('lng').val().toString(),
                                        shapeX: childSnapshot.child('shape').val().toString(),
                                        colorX: childSnapshot.child('color').val().toString(),
                                    });
                                });
                                console.log("line 93:" + users);
                                let bot = this.state.bots;
                                let distances = [];
                                for (let j = 0; j < users.length; j++) {
                                    distances.push((Math.abs(users[j].lat - bot.lat) + Math.abs(users[j].lng - bot.lng)))
                                }
                                console.log(distances);
                                const idx = distances.indexOf(Math.min.apply(null, distances));
                                console.log(idx);
                                let closest_user = users[idx];
                                console.log(closest_user);
                                const radius = 0.0003;
                                let new_coor = {lat: 0, lng: 0};
                                if ((bot.lat - closest_user.lat) > 0) {
                                    new_coor.lat = bot.lat - radius;
                                } else {
                                    new_coor.lat = bot.lat + radius;
                                }
                                if ((bot.lng - closest_user.lng) > 0) {
                                    new_coor.lng = bot.lng - radius;
                                } else {
                                    new_coor.lng = bot.lng + radius;
                                }

                                //let coor = this.android_move(bot, closest_user);
                                bot.lat = new_coor.lat;
                                bot.lng = new_coor.lng;
                                this.setState({bots: bot});
                                firebase.database().ref(this.mapcode + "/bots/" + bot.id).set(bot);
                            }, (error) => {
                                console.log("Error", error);
                            });
                    }
                    navigator.geolocation.getCurrentPosition(showPosition);
                    console.log(this.state.participants)
                }, 1000);
            }

            this.props.navigation.setParams({
                clear: () => {
                    clearInterval(this.interval)
                }
            });

            /* showPosition() method, which does the following:
                    (1) using position obtained to get the exact latitude and longitude and storing to DB;
                    (2) updates current Coordinates state.

             */
            const showPosition = (position) => {

                this.setState(() => ({
                    currentCoordinates: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }
                }));

                firebase.database().ref(this.mapcode + '/users/' + this.uid).update({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            };

            // Following two database queries use the firebaseRetrieving Function defined further below.

            //  #1 Firebase.database() query to get the details of the Map and store all users who need to be displayed in the State
            this.firebaseRetrieving('users', 'participants');

            //  #2 DB query to request landmark information and store to landmarks array in state
            this.firebaseRetrieving('landmarks', 'landmarks');

        } catch (e) {
            console.log("error", e);
        }
    }

    /* B. ComponentWillUnmount lifecycle: just before the component dismounts

        (a) The user's current location is cleared.
        (b) This is updated to the Firebase database.

        Design rationale: This is to ensure that the map will only show active users, and prevent cluttering
        of non-active users.
    */
    componentWillUnmount() {
        try {
            this.setState(() => ({mounted: false}));
            clearInterval(this.interval);
            firebase.database().ref(this.mapcode + '/users/' + this.uid).remove();
        } catch (e) {
            console.log("error", e);
        }
    }

    // --------------------- Functions used in Map Component --------------------------------------------//

    /*  This function allows toggling of Adding Marker Card.

        (a) This opens a Card where you can write the description for a new landmark marker
        (b) When the adding Marker Card is opened, a new marker is displayed +0.001 GPS longitude and latitude to the
            user's location.

        Design rationale: new markers are always displayed near the users current location for better usability.
    */
    toggleAddMarkerCard = (command) => {
        if (command === 'add') {
            this.setState({
                addMarkerCardVisibility: true,
            });
            this.setState((prevState) => ({
                addMarkerCoordinates: {
                    latitude: prevState.currentCoordinates.latitude + 0.001,
                    longitude: prevState.currentCoordinates.longitude + 0.001
                }
            }));
        } else if (command === 'exit') {
            this.setState({
                addMarkerCardVisibility: false
            })
        }
    };

    //  Function to create Random token to assign unique values, used throughout the component.
    randomToken() {
        const potentialChar = 'abcdefghijklmnopqrstuvwxyz11223344556677889900';
        let codes = [];

        for (let i = 0; i < 4; i++) {
            codes[i] = potentialChar[(Math.random() * 46) | 0];
        }
        return codes.join("");
    }

    //  Function to add new landmark marker to database
    addNewMarkerToDB = (markerDescription) => {
        const randomCode = this.randomToken();

        firebase.database().ref(this.mapcode + '/landmarks/' + randomCode).set({
            lat: this.state.addMarkerCoordinates.latitude,
            lng: this.state.addMarkerCoordinates.longitude,
            description: markerDescription,
            shape: this.state.addMarker.addMarkerShape,
            name: "Marker" + randomCode,
            color: this.state.addMarker.addMarkerColor
        });

        this.setState({
            addMarkerCardVisibility: false
        });
    };

    /*  Function to change the message that the user wants to convey to others.
        Note.   The user can only have one message at any one time. This is specifically by design as it simplifies a
                potentially chaotic messaging situation where there are many users. The message synchronises with the
                description of the users live marker.
    */
    changeMessage = () => {
        firebase.database().ref(this.mapcode + '/users/' + this.uid).update({
            description: this.state.messageText
        });
    };

    // Function which toggles the messages modal on and off
    toggleMessagesModal = () => {
        if (this.state.modalVisible) {
            this.setState({modalVisible: false})
        } else {
            this.setState({modalVisible: true})
        }
    };

    // Reusable function that retrieves Firebase DB entries.
    firebaseRetrieving = (dbAddress, stateArrayName) => {
        firebase.database().ref(this.mapcode + '/' + dbAddress)
            .on('value', (snapshot) => {
                const tempArray = [];
                snapshot.forEach((childSnapshot) => {
                    tempArray.push({
                        id: childSnapshot.key,
                        nameX: childSnapshot.child("name").val().toString(),
                        description: childSnapshot.child('description').val().toString(),
                        lat: childSnapshot.child('lat').val().toString(),
                        lng: childSnapshot.child('lng').val().toString(),
                        shapeX: childSnapshot.child('shape').val().toString(),
                        colorX: childSnapshot.child('color').val().toString(),
                    });
                });
                this.setState(() => ({[stateArrayName]: tempArray}));
            }, (error) => {
                console.log("Error", error);
            });
    };

    //--------------------------- Rendering method -----------------------------------------//
    render() {

        // Setting up of various variables that will be used.
        let addMarkerCard = null;
        let addMarkerItem = null;
        let botmark = null;

        /*
        Where the marker Card has been opened, then:
            (a) The addMarkerCard variable will contain the marker Component.
            (b) The addMarkerItem variable will contain the draggable landmark Marker.
        */
        if (this.state.addMarkerCardVisibility) {
            addMarkerCard = (
                <AddMarkerCard
                    cardStatus={this.toggleAddMarkerCard}
                    addCardBool={this.addNewMarkerToDB}
                />
            );
            addMarkerItem = (
                <Marker draggable
                        coordinate={this.state.addMarkerCoordinates}
                        onDragEnd={(e) => this.setState({
                            addMarkerCoordinates: e.nativeEvent.coordinate
                        })}
                >
                    <Icon
                        name="beenhere"
                        color="grey"
                        size={100}
                    />
                </Marker>
            )
        }
        /*
        The following is the JSX to be rendered from the Map Component:
            (a) For every user who has joined the map, a PersonMarker component will be displayed.
            (b) For every landmark that has been placed by a user, a Landmark component will be displayed.
            (c) MapButtonGroup component gives users options to ADD a landmark, or MESSAGE with other users.
            (d) Messages overlay, when it is opened then the messages of all the users are displayed.
        */
        return (
            <View style={{flex: 1, alignItems: 'stretch'}}>
                {/*Card for displaying marker addition*/}
                <MapView
                    style={{
                        flex: 8,
                    }}
                    initialRegion={{
                        latitude: this.state.currentCoordinates.latitude,
                        longitude: this.state.currentCoordinates.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01
                    }}
                >
                    {this.state.participants.map((person) => (
                        <PersonMarker
                            key={person.id}
                            {...person}
                        />
                    ))}

                    {this.state.landmarks.map((mark) => (
                        <LandmarkMarker
                            {...mark}
                        />
                    ))}
                    {addMarkerItem}
                </MapView>
                <View
                    style={{
                        position: "absolute",
                        backgroundColor: "transparent",
                        width: 300
                    }}
                >
                    {botmark}
                    {addMarkerCard}
                </View>
                <MenuButtonGroup
                    toggledStatus={this.toggleAddMarkerCard}
                    messagesToggled={this.toggleMessagesModal}
                />
                <Overlay visible={this.state.modalVisible}
                         closeOnTouchOutside animationType="zoomIn"
                         containerStyle={{backgroundColor: 'rgba(37, 8, 10, 0.78)'}}
                         childrenWrapperStyle={{backgroundColor: '#eee'}}
                         animationDuration={500}>
                    <ScrollView
                        style={{alignContent: 'center'}}>
                        <Text style={{fontSize: 28}}>Messages</Text>
                        {this.state.participants.map((person) => (
                            <Text>{person.nameX + ": " + person.description}</Text>
                        ))}
                        <FormInput
                            containerStyle={{width: 200}}
                            onChangeText={(text) => this.setState({messageText: text})}
                        />
                        <Button
                            onPress={this.toggleMessagesModal}
                            buttonStyle={{position: "relative", width: 50, height: 50}}
                            icon={{name: 'clear'}}
                        />
                        <Button
                            onPress={this.changeMessage}
                            icon={{name: 'code'}}
                            backgroundColor='#03A9F4'
                            buttonStyle={{width: 200, borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
                            title='SEND'
                        />
                    </ScrollView>
                </Overlay>
            </View>
        );
    }
}

export default mapPage;