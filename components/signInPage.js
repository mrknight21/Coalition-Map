import React from 'react';
import {Text, View} from 'react-native';
//import {FormLabel} from "react-native-elements/src/index.d";


import LogInForm from "./loginForm";

class signInPage extends React.Component {
    static navigationOptions = {
        title: 'log in',
        headerStyle: {
            backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
    };

    render() {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <LogInForm navigation={this.props.navigation}/>
            </View>
        );
    }
}

export default signInPage;