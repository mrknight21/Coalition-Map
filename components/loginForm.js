/**
 * Created by Administer on 10/04/2018.
 */
import React from 'react';
import {Text, View} from 'react-native';
import {Card, Button, FormLabel, FormInput, Icon, FormValidationMessage} from 'react-native-elements';

import firebase from './firebase/firebase';

export default class LogginForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            join: false,
            mapcode: "",
        };
    }

    check_submit() {
        this.ref = firebase.database().ref(this.state.mapcode + "/");
        console.log(this.ref);
        this.ref.once("value", (snapshot) => {
            console.log(snapshot.val());
            if (snapshot.val()) {
                console.log(snapshot.val());
                this.setState({join: true});
                this.props.navigation.navigate('setUp', this.state);
            } else {
                console.log("bind state");
                console.log(this.state);
            }
        });
    }


    render() {
        return (
            <View>
                <Card>
                    <FormLabel>MAP CODE</FormLabel>
                    <FormInput
                        onChangeText={(text) => this.setState({mapcode: text})}
                        placeholder="Hello Enter the map code to proceed"
                    >
                    </FormInput>
                    <FormValidationMessage>{'This field is required'}</FormValidationMessage>
                    <Button title="Go" onPress={() => this.check_submit()}/>
                    <Text>OR</Text>
                    <Button title="Create new map"
                            onPress={() => this.props.navigation.navigate('setUp', {join: false, mapcode: "",})}/>
                </Card>
            </View>
        );
    }
}

