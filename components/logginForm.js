/**
 * Created by Administer on 10/04/2018.
 */
import React from 'react';
import { Text, View } from 'react-native';
import { Card,Button, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';

import firebase from './firebase/firebase';

export default class LogginForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
            mapcode: "",
        };
    }

    check_submit(mapcode){
        console.log(mapcode);
        this.props.navigation.navigate('setUp',this.state)

        // var ref = firebase.database().ref(mapcode+"/");
        // ref.once("value")
        //     .then(function(snapshot) {
        //         console.log(snapshot.val());
        //         if (snapshot.val()){
        //             console.log(snapshot.val());
        //             {};
        //         }else{
        //           console.log("wrong code!!")
        //         }
        //     });
    }


    render(){
        return (
    <View>
        <Card>
            <FormLabel>MAP CODE</FormLabel>
            <FormInput onChangeText={(text) => this.setState({mapcode: text})}/>
            <Button title="Go" onPress={() => this.check_submit(this.state.mapcode)}/>
            <Text>OR</Text>
            <Button title="Creat new map" onPress={() => this.props.navigation.navigate('setUp', {loggedIn: false, mapcode: "",})}/>
        </Card>
    </View>
        );
    }
}

