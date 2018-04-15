import React from 'react';
import { Text, View } from 'react-native';
import {Badge, Button, Card, Divider,FormLabel, FormValidationMessage, FormInput } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from './firebase/firebase';





/*
id:
{
color:
description:
lat:
lng:
name:
shape:
}

map:
{
color:
}
 */

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
    }

    anonymous_login() {
        var isAnonymous = null;
        var uid = null;
        firebase.auth().signInAnonymously().catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
        });
        uid = firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // User is signed in.
                var isAnonymous = user.isAnonymous;
                var uid = user.uid;
                return uid;
            } else {
                console.log("user sign out");
            }
        });
        return uid;
    }




    componentDidMount() {
        // Updating the `isSignedIn` and `userProfile` local state attributes when the Firebase Auth
        // state changes.
        const join = this.props.navigation.state.params.join;
        console.log("didMount check:"+join);
        const uid = this.anonymous_login();
        this.setState({uid:uid});
        console.log(uid);
        if (!join){
            this.setState({mapcode:uid});
            console.log("new map id:" + this.state.mapcode);
        }else{
            console.log("DidMount else part: "+this.state.mapcode);
        }
    }




    mapform (join) {
        if (join) {
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
        const params = this.props.navigation.state.params;
        const settingMap = params ? params.join : null;
        const mapcode = params ? params.mapcode : null;
        const map_form = this.mapform(settingMap, mapcode);

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
                </Card>
            </View>
        );
    }
}


