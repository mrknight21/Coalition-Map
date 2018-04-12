/**
 * Created by Administer on 10/04/2018.
 */
import React from 'react';
import { Text, View } from 'react-native';
import { Card,Button, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';

import auth from './firebase/firebase';

export default class LogginForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
            mapcode: "",
        };
    }

    anynonymous_login(){
        auth.signInAnonymously().catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
        });
        auth.onAuthStateChanged(function(user) {
            if (user) {
                // User is signed in.
                var isAnonymous = user.isAnonymous;
                var uid = user.uid;
                console.log(isAnonymous);
                console.log(uid);
            } else {
                console.log("user sign out");
            }
        });

    }


    render() {
        return (
    <View>
        <Card>
            <FormLabel>MAP CODE</FormLabel>
            <FormInput onChangeText={(text) => this.setState({loggedIn, mapcode: text})}/>
            <Button title="Go" onPress={() => this.props.navigation.navigate('map',this.state)}/>
            <Button title="Login Any" onPress= {this.anynonymous_login}/>
            <Text>OR</Text>
            <Button title="Creat new map" onPress={() => this.props.navigation.navigate('setUp')}/>
        </Card>
    </View>
        );
    }
}

