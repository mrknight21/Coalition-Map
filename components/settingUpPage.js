import React from 'react';
import {Text, View, Picker} from 'react-native';
import {Badge, Button, Card, Divider, FormLabel, FormValidationMessage, FormInput} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from './firebase/firebase';


export default class settingUpPage extends React.Component {
    static navigationOptions = {
        title: 'Set Up',
        headerStyle: {
            backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
    };


    constructor(props) {
        super(props);
        this.state = {
            mapcode: this.props.navigation.state.params.mapcode,
            mapColor: null,
            uid: null,
            uColor: null,
            description: null,
            name: null,
            shape: null
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    anonymous_login() {

        firebase.auth().signInAnonymously().catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
        });
        uid = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // User is signed in.
                var isAnonymous = user.isAnonymous;
                var uid = user.uid;
                console.log(this.props.navigation.state.params.join);
                this.setState(() => ({uid: uid}));
                if (!this.props.navigation.state.params.join) {
                    this.setState(() => ({mapcode: uid}));
                    console.log("new map id set! " + uid);
                }
            } else {
                console.log("user sign out");
            }
        });
    }


    componentDidMount() {
        this.anonymous_login();
    }


    handleSubmit() {
        const db = firebase.database();
        const uid = this.state.uid;
        const mapcode = this.state.mapcode;
        const host = !this.props.navigation.state.params.join;
        var lat = null;
        var lng = null;


        navigator.geolocation.getCurrentPosition((position) => {
            lat = position.coords.latitude;
            lng = position.coords.longitude;

            console.log("lat: " + lat + " lng: " + lng);

            const user = {
                name: this.state.name,
                description: this.state.description,
                color: this.state.uColor,
                shape: this.state.shape,
                host: host,
                lat: lat,
                lng: lng
            };
            const map = {
                color: this.state.mapColor
            };
            db.ref(mapcode + '/users/' + uid).update(user);
            if (host) {
                db.ref(mapcode + '/setting').set(map);
            }
            this.props.navigation.navigate('map', {mapcode: this.state.mapcode, uid: this.state.uid});

        });
    }


    mapform() {
        if (this.props.navigation.state.params.join) {
            return (<View><Text>MAP ID: {this.state.mapcode}</Text></View>);
        } else {
            return (
                <View>
                    <Text>MAP ID: {this.state.mapcode} </Text>
                    <FormLabel>Map Color</FormLabel>
                    <FormInput onChangeText={(text) => this.setState({mapColor: text})}/>
                </View>
            )
        }
    }


    render() {
        const map_form = this.mapform();

        return (
            <View>
                <Card>
                    <View>
                        <FormLabel>Name</FormLabel>
                        <FormInput onChangeText={(text) => this.setState({name: text.toLowerCase()})}/>
                        <FormLabel>Description</FormLabel>
                        <FormInput onChangeText={(text) => this.setState({description: text.toLowerCase()})}/>
                        <FormLabel>Color</FormLabel>
                        <FormInput onChangeText={(text) => this.setState({uColor: text.toLowerCase()})}/>
                        <FormLabel>Shape</FormLabel>
                    </View>
                    <View style={{flex: 1}}>
                    <Picker
                            selectedValue={this.state.shape}
                            style={{ height: 50, width: 100 }}
                            onValueChange={(itemValue, itemIndex) => this.setState({shape: itemValue.toLowerCase()})}
                            // onValueChange={(itemValue, itemIndex) => this.setState({language: itemValue})}
                        >
                            <Picker.Item label="Smily Face" value="mood" />
                            <Picker.Item label="heart" value="favorite" />
                            <Picker.Item label="star" value="grade" />
                        </Picker>
                    </View>

                    {/*<FormInput*/}
                        {/*onChangeText={(text) => this.setState({shape: text.toLowerCase()})}*/}
                    {/*/>*/}

                    <Divider style={{backgroundColor: 'blue'}}/>
                    {map_form}
                    <View>
                        <Button title="Submit" onPress={() => this.handleSubmit()}/>
                    </View>

                </Card>
            </View>
        );
    }
}


