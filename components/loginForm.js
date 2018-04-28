/**
 * Created by Administer on 10/04/2018.
 */
import React from 'react';
import {Text, View, ScrollView, Keyboard, KeyboardAvoidingView,  StyleSheet, Image} from 'react-native';
import {Card, Button, FormLabel, FormInput, FormValidationMessage} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

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
            <ScrollView style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image
                    style={styles.logo}
                    source={require('../assets/map_icon.png')}/>
                </View>

                <Card
                    title={"Coalition"}
                    containerStyle={styles.card}
                    titleStyle={styles.titleText}
                >
                    <View>
                        <FormLabel><Icon
                            name='map-o'
                            size={20}
                            color='black'
                        />    MAP CODE</FormLabel>
                        <FormInput
                            onChangeText={(text) => this.setState({mapcode: text})}
                            placeholder="Hello Enter the mapp code to proceed"
                        >
                        </FormInput>
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
                            buttonStyle={styles.button}
                            backgroundColor='orange'
                        />
                    </View>
                    <Text style={styles.or}>OR</Text>
                    <View
                        style={{
                            alignItems: "center",
                            justifyContent: 'center'
                        }}
                    >
                        <Button title="Create new map"
                                onPress={() => this.props.navigation.navigate('setUp', {join: false, mapcode: "",})}
                                buttonStyle={styles.button}
                                backgroundColor='#03A9F4'
                        />
                    </View>
                </Card>
            </ScrollView>
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
        width: 320,
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
