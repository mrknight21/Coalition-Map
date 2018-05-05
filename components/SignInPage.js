import React from 'react';
import {View} from 'react-native';


import LogInForm from "./LoginForm";

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