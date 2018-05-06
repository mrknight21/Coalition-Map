import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {StackNavigator} from 'react-navigation'
import { Card } from 'react-native-elements';
import mapPage from './components/MapPage';
import settingUpPage from './components/SettingUpPage';
import signInPage from './components/SignInPage';

const RootStack = StackNavigator(
    {
        signIn: {
            screen: signInPage,
        },
        setUp: {
            screen: settingUpPage,
        },
        map: {
            screen: mapPage,
        }
    },
    {
        initialRouteName: 'signIn',
    }
);


export default class App extends React.Component {
    render() {
        return <RootStack />;
    }
}
