import React from 'react';
import {View, Text, ScrollView} from 'react-native';
import {Icon, Button, FormLabel, FormInput} from 'react-native-elements';
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
This component is the Map component where all the user interaction will occur.
Due to the considerable logic required for this component, further smaller components have been created and imported here.
Note. For these smaller components, see the ./mapComponents folder.
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

    //Constructor setting out all the states used in the Map component.

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

    // A. ComponentDidMount lifecycle, where actions taken when the component is loaded.

    componentDidMount() {

        try {

            /* Checks whether state is mounted, and if so does two things during 1 second intervals:
                (1) Getting Robot/Zombie's and setting their locations.
                (2) Using getCurrentPosition method on the geolocation to get the current location of user device
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

            /* showPosition() method:
                (1) using position obtained to get the exact latitude and longitude and storing to DB;
                (2) updates

             */
            const showPosition = (position) => {

                this.setState((prevstate) => ({
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

            // firebase.database() query to get the details of the Map and store all users who need to be displayed in the State
            this.firebaseRetrieving('users', 'participants');

            //    Second DB query to request landmark information and store to landmarks array in state
            this.firebaseRetrieving('landmarks', 'landmarks');

            this.accessMessages();

            // firebase.database().ref(this.mapcode + '/bots')
            //     .on('value', (snapshot) => {
            //         let bots;
            //             bots={
            //                 id: snapshot.child('id').val().toString(),
            //                 lat: snapshot.child('lat').val(),
            //                 lng: snapshot.child('lng').val(),
            //                 color: snapshot.child('color').val().toString(),
            //             };
            //         console.log(bots);
            //         this.setState({bots: bots});
            //         });

        } catch (e) {
            console.log("error", e);
        }
    }

    //When the map component dismounts, the interval updating current location is cleared
    //And the map entry is deleted.
    componentWillUnmount() {
        try {
            this.setState(() => ({mounted: false}));
            clearInterval(this.interval);
            firebase.database().ref(this.mapcode + '/users/' + this.uid).remove();
        } catch (e) {
            console.log("error", e);
        }
    }

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

    randomToken() {
        const potentialChar = 'abcdefghijklmnopqrstuvwxyz11223344556677889900';
        let codes = [];

        for (let i = 0; i < 4; i++) {
            codes[i] = potentialChar[(Math.random() * 46) | 0];
        }
        return codes.join("");
    }

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

    changeMessage = () => {
        firebase.database().ref(this.mapcode + '/users/' + this.uid).update({
            description: this.state.messageText
        });
    }

    toggleMessagesModal = () => {
        if (this.state.modalVisible) {
            this.setState({modalVisible : false})
        } else {
            this.setState({modalVisible : true})
        }
    }

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

    //--------------------------- rendering method ---------------------------
    render() {

        //only show add marker option if button pressed.
        let addMarkerCard = null;
        let addMarkerItem = null;
        let botmark = null;

        console.log(this.state.bots);


        // if(this.state.bots !== null){
        //     botmark = (
        //         <Marker
        //             key={this.state.bots.id}
        //             title={this.state.bots.id}
        //             coordinate={{
        //                 latitude: parseFloat(this.state.bots.lat),
        //                 longitude: parseFloat(this.state.bots.lng),
        //             }}
        //         >
        //             <Icon
        //                 name='android'
        //                 color={this.state.bots.color}
        //                 raised={true}
        //                 reverse={true}
        //             />
        //         </Marker>
        //     );
        // }

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
                    toggledStatus= {this.toggleAddMarkerCard}
                    messagesToggled={this.toggleMessagesModal}
                />

                <Overlay visible={this.state.modalVisible}
                         closeOnTouchOutside animationType="zoomIn"
                         containerStyle={{backgroundColor: 'rgba(37, 8, 10, 0.78)'}}
                         childrenWrapperStyle={{backgroundColor: '#eee'}}
                         animationDuration={500}>
                    <ScrollView
                        style={{alignContent:'center'}}>
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