import React from 'react';
import {Text, View, Picker, StyleSheet} from 'react-native';
import {Button, Card, Divider, FormLabel, FormValidationMessage, FormInput } from 'react-native-elements';
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
            uColor: 'blue',
            description: null,
            name: null,
            shape: 'face'
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    componentDidMount() {
        this.anonymous_login();
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
                    this.randomToken();
                    console.log("new map id set! " + uid);
                }
            } else {
                console.log("user sign out");
            }
        });
    }


    randomToken () {


        var codes = [];
        const elements = 'abcdefghijklmnopqrstuvwxyz11223344556677889900';

        // while (true) {
        for (var i = 0; i < 4; i++) {
            randomElement = elements[(Math.random() * 46)|0];
            codes[i] = randomElement;
        }

            // let ref = firebase.database().ref(codes.join("") + "/");
            // console.log(this.ref);
            // ref.once("value", (snapshot) => {
            //     if (snapshot.val() === null) {
            //         break;
            //     }
            // });
        // }
        this.setState({mapcode: codes.join("")});
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
        if (!this.props.navigation.state.params.join) {
            return (
                <View>
                    <FormLabel>Map Color</FormLabel>
                    <Picker
                        selectedValue={this.state.shape}
                        onValueChange={(itemValue, itemIndex) => this.setState({mapColor: itemValue.toLowerCase()})}
                        // onValueChange={(itemValue, itemIndex) => this.setState({language: itemValue})}
                    >
                        <Picker.Item label="red" value="red" />
                        <Picker.Item label="blue" value="blue" />
                        <Picker.Item label="green" value="green" />
                        <Picker.Item label="yellow" value="yellow" />
                        <Picker.Item label="grey" value="grey" />
                        <Picker.Item label="black" value="black" />
                    </Picker>
                </View>
            )
        }
    }


    render() {
        const map_form = this.mapform();


        return (
            <View style={styles.container}>
                <Card style={styles.card} title={"MAP ID: "+this.state.mapcode} titleStyle={styles.titleText}>
                    <View>
                        <FormLabel>Name</FormLabel>
                        <FormInput onChangeText={(text) => this.setState({name: text.toLowerCase()})}/>
                        <FormLabel>Description</FormLabel>
                        <FormInput onChangeText={(text) => this.setState({description: text.toLowerCase()})}/>
                        <FormLabel>Color</FormLabel>
                        <Picker
                            selectedValue={this.state.shape}
                            onValueChange={(itemValue, itemIndex) => this.setState({uColor: itemValue.toLowerCase()})}
                            // onValueChange={(itemValue, itemIndex) => this.setState({language: itemValue})}
                        >
                            <Picker.Item label="red" value="red" />
                            <Picker.Item label="blue" value="blue" />
                            <Picker.Item label="green" value="green" />
                            <Picker.Item label="yellow" value="yellow" />
                            <Picker.Item label="grey" value="grey" />
                            <Picker.Item label="black" value="black" />
                        </Picker>
                        <FormLabel>Shape</FormLabel>
                        <Picker
                            selectedValue={this.state.shape}
                            onValueChange={(itemValue, itemIndex) => this.setState({shape: itemValue.toLowerCase()})}
                            // onValueChange={(itemValue, itemIndex) => this.setState({language: itemValue})}
                        >
                            <Picker.Item label="smily face" value="mood" />
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
                        <Button buttonStyle={styles.button} backgroundColor='orange' title="Submit" onPress={() => this.handleSubmit()}/>
                    </View>

                </Card>
            </View>
        );
    }
}


const styles = StyleSheet.create({

    container:{
        alignContent:'center'
    },

    logoContainer:{
        alignContent:'center',
        alignItems:'center',
        marginTop: 30
    },

    titleText:{
        fontWeight: 'bold',
        fontSize: 30,
        textAlign:'center'
    },

    logo:{
        width: 200,
        height: 200,
        alignContent: 'center'
    },

    card:{
        width: 350,
        padding: 20,
        marginTop: 30,
        borderRadius: 10
    },

    label:{
        color:'grey',

    },
    or: {
        fontWeight: 'bold',
        fontSize: 15,
        textAlign:'center'
    },
    button: {
        width: 300,
        height: 45,
        borderColor: "transparent",
        borderWidth: 0,
        borderRadius: 5
    },
});
