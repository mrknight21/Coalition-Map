/**
 * Created by Administer on 10/04/2018.
 */
import React from 'react';
import {Text, View, ScrollView, Keyboard, KeyboardAvoidingView} from 'react-native';
import {Card, Button, FormLabel, FormInput, Icon, FormValidationMessage} from 'react-native-elements';

import firebase from './firebase/firebase';

Keyboard.dismiss();

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
            <ScrollView
                style={{
                    padding: 1,
                }}
            >
                <Card
                    containerStyle={{
                        width: 350,
                        height: 300,
                        // padding: 1,
                        marginTop: 100
                    }}
                >
                    <View>
                        <FormLabel>MAP CODE</FormLabel>
                        <FormInput
                            onChangeText={(text) => this.setState({mapcode: text})}
                            placeholder="Hello Enter the mapp code to proceed"
                        >
                        </FormInput>
                        <FormValidationMessage>{'This field required'}</FormValidationMessage>
                    </View>

                    <View
                        style={{
                            alignItems: "center",
                            justifyContent: 'center'
                        }}
                    >
                        <Button
                            title="Go"
                            onPress={() => this.check_submit()}
                            buttonStyle={{
                                backgroundColor: "purple",
                                width: 300,
                                height: 45,
                                borderColor: "transparent",
                                borderWidth: 0,
                                borderRadius: 5
                            }}
                        />
                    </View>

                    <Text>OR</Text>

                    <View
                        style={{
                            alignItems: "center",
                            justifyContent: 'center'
                        }}
                    >
                        <Button title="Create new map"
                                onPress={() => this.props.navigation.navigate('setUp', {join: false, mapcode: "",})}
                                buttonStyle={{
                                    backgroundColor: "orange",
                                    width: 300,
                                    height: 45,
                                    borderColor: "transparent",
                                    borderWidth: 0,
                                    borderRadius: 5
                                }}
                        />
                    </View>


                </Card>
            </ScrollView>
        );
    }
}

