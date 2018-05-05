import React from 'react';
import {Text, View} from 'react-native';
import ReactNativeElements, {Card, Icon, Button, ButtonGroup, FormLabel, FormInput} from 'react-native-elements';
import MapView, {Marker} from 'react-native-maps';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from './firebase/firebase';

class mapPage extends React.Component {

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

    constructor(props) {
        super(props);
        this.state = {
            participants: [],
            landmarks: [],
            bots:[],
            addMarker: {
                addMarkerDescription: "default",
                addMarkerCardVisibility: true,
                addMarkerColor: "red",
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
            mounted: true


        };
        this.mapcode = this.props.navigation.state.params.mapcode;
        this.uid = this.props.navigation.state.params.uid;
    }

    // // ---------------- Component lifecycle methods -----------------------------
    componentDidMount() {

        try {
            /* Using getCurrentPosition method on the geolocation to get the current location of user device every 10
            seconds and then firing the showPosition method() */

            if(this.state.mounted) {
                this.interval = setInterval(() => {
                    navigator.geolocation.getCurrentPosition(showPosition)
                }, 1000);
            }

            this.props.navigation.setParams({
                clear: () => {
                    clearInterval(this.interval)
                }
            });

            // showPosition() method using position obtained to get the exact latitude and longitude and storing to DB

            const showPosition = (position) => {
                console.log("getCurrentPosition working!");
                console.log("Latitude: " + position.coords.latitude + ", Longitude: " + position.coords.longitude);

                this.setState(() => ({
                    currentCoordinates: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    }
                }))

                firebase.database().ref(this.mapcode + '/users/' + this.uid).update({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            };


            // firebase.database() query to get the details of the Map and store all users who need to be displayed in the State

            firebase.database().ref(this.mapcode + '/users')
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
                    this.setState(() => ({participants: participants}));
                }, (error) => {
                    console.log("Error", error);
                });


            //    Second DB query to request landmark information and store to landmarks array in state

            firebase.database().ref(this.mapcode + '/landmarks')
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
                    this.setState(() => ({landmarks: landmarks}));
                }, (error) => {
                    console.log("Error", error);
                });


            firebase.database().ref(this.mapcode + '/bots')
                .on('value', (snapshot) => {
                    const bots = [];
                    snapshot.forEach((childSnapshot) => {
                        bots.push({
                            id: childSnapshot.key,
                            lat: childSnapshot.child('lat').val(),
                            lng: childSnapshot.child('lng').val(),
                            color: childSnapshot.child('color').val().toString(),
                        });
                    });
                    console.log(bots);
                    this.setState(() => ({bots: bots}));
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

            this.setState(() => ({ mounted: false }))

            clearInterval(this.interval);

            firebase.database().ref(this.mapcode + '/users/' + this.uid).remove();

        } catch (e) {
            console.log("error", e);
        }
    }

    exitAddMarker() {
        this.setState({
            addMarkerCardVisibility: false
        })
    }

    openAddMarkerCard() {
        this.setState({
            addMarkerCardVisibility: true
        })
    }

    randomToken() {
        const potentialChar = 'abcdefghijklmnopqrstuvwxyz11223344556677889900';
        let codes = [];

        for (var i = 0; i < 4; i++) {
            let randomElement = potentialChar[(Math.random() * 46) | 0];
            codes[i] = randomElement;
        }
        return codes.join("");
    }

    addNewMarkerToDB() {
        const randomCode = this.randomToken();

        this.setState(prevState => ({
            ...prevState,
            addMarker: {
                ...prevState.addMarker,
                addMarkerName: "Marker" + randomCode
            }
        }));

        firebase.database().ref(this.mapcode + '/landmarks/' + randomCode).set({
            lat: this.state.addMarkerCoordinates.latitude,
            lng: this.state.addMarkerCoordinates.longitude,
            description: this.state.addMarker.addMarkerDescription,
            shape: this.state.addMarker.addMarkerShape,
            name: this.state.addMarker.addMarkerName,
            color: this.state.addMarker.addMarkerColor
        });

        this.setState({
            addMarkerCardVisibility: true
        })
    }

    //Method to update the location of the addmarker to be right next to the person.

    setAddNewMarkerLocation(personLatitude, personLongitude) {
        this.setState(prevState => ({}))
    }


    //--------------------------- rendering method ---------------------------
    render() {

        const addMarkerIcon = () => <Icon
            size={20}
            style={{
                flex: 1,
                justifyContent: 'space-between',
            }}
            onPress={() => this.openAddMarkerCard()}
            name="add"
            // raised={true}
        />
        const messagingIcon = () => <Icon
            size={20}
            style={{
                flex: 1,
                justifyContent: 'space-between',
            }}
            name="message"
            // raised={true}
        />

        const buttons = [
            {element: addMarkerIcon},
            {element: messagingIcon}
        ];


        //only show add marker option if button pressed.
        let addMarkerCard = null;
        let addMarkerItem = null;

        if (this.state.addMarkerCardVisibility) {
            addMarkerCard = (
                <Card
                    title='Add a marker'
                >
                    <Text style={{marginBottom: 10}}>
                        Pick your choice and add!
                    </Text>
                    <FormLabel>
                        Add description to marker
                    </FormLabel>
                    <FormInput/>
                    <Button
                        onPress={() => this.exitAddMarker()}
                        buttonStyle={{position: "relative", width: 50, height: 50}}
                        icon={{name: 'clear'}}
                    />
                    <Button
                        onPress={() => this.addNewMarkerToDB()}
                        icon={{name: 'code'}}
                        backgroundColor='#03A9F4'
                        buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
                        title='ADD'
                    />
                </Card>
            )

            addMarkerItem = (
                <Marker draggable
                        coordinate={this.state.addMarkerCoordinates}
                        onDragEnd={(e) => this.setState({
                            addMarkerCoordinates: e.nativeEvent.coordinate
                        })}
                >
                    <Icon
                        name="beenhere"
                        color="pink"
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
                        <Marker
                            key={person.id}
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
                    key={mark.id}
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

                    {this.state.bots.map((bot) => (
                        <Marker
                            key={bot.id}
                            title={bot.id}
                            coordinate={{
                                latitude: parseFloat(bot.lat),
                                longitude: parseFloat(bot.lng),
                            }}
                        >
                            <Icon
                                name='android'
                                color={bot.color}
                                raised={true}
                                reverse={true}
                            />
                        </Marker>
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
                    {addMarkerCard}
                </View>

                <ButtonGroup
                    buttons={buttons}
                    containerStyle={{height: 100, flex: 1}}
                />
            </View>
        );
    }
}


export default mapPage;