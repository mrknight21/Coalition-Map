import React from 'react';
import { Text, View } from 'react-native';
import {Badge, Button, Card, Divider,FormLabel, FormValidationMessage, FormInput } from 'react-native-elements';
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
        this.state ={
            mapcode: this.props.navigation.state.params.mapcode,
            mapColor: null,
            uid: null,
            uColor:null,
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
                this.setState(() => ({uid:uid}));
                if (!this.props.navigation.state.params.join){
                    this.setState(() => ({mapcode:uid}));
                    console.log("new map id set! "+uid);
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
        const user = {
            name: this.state.name,
            description: this.state.description,
            color: this.state.uColor,
            shape: this.state.shape,
            host: host
        };
        const map ={
            color:this.state.mapColor
        };
        db.ref(mapcode+'/users/'+uid).update(user);
        if (host){
            db.ref(mapcode+'/setting').set(map);
        }
        this.props.navigation.navigate('map',{mapcode:this.state.mapcode, uid:this.state.uid});

    }




    mapform () {
        if (this.props.navigation.state.params.join) {
            return (<View><Text>MAP ID: {this.state.mapcode}</Text></View>);
        }else{
            return (
                <View>
                    <Text>MAP ID: {this.state.mapcode} </Text>
        <FormLabel>Map Color</FormLabel>
            <FormInput onChangeText={(text) => this.setState({mapColor: text})}/>
                </View>
            )
        }
    }



    render(){
        const map_form = this.mapform();

        return (
            <View>
                <Card>
                    <FormLabel>Name</FormLabel>
                    <FormInput onChangeText={(text) => this.setState({name: text})}/>
                    <FormLabel>Description</FormLabel>
                    <FormInput onChangeText={(text) => this.setState({description: text})}/>
                    <FormLabel>Color</FormLabel>
                    <FormInput onChangeText={(text) => this.setState({uColor: text})}/>
                    <FormLabel>Shape</FormLabel>
                    <FormInput onChangeText={(text) => this.setState({shape: text})}/>
                    <Divider style={{ backgroundColor: 'blue' }} />
                    {map_form}
                    <Button title="Submit" onPress={() => this.handleSubmit()}/>
                </Card>
            </View>
        );
    }
}


