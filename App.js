import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {StackNavigator} from 'react-navigation'
import { Card } from 'react-native-elements';
import mapPage from './components/MapPage';
import settingUpPage from './components/SettingUpPage';
import signInPage from './components/SignInPage';

/*
    The top level application component containing:
        (a) Stack Navigator variable
        (b) Rendering this Stack Navigator as RootStack

    Design rationale:   Navigator components have been chosen for organising navigation routes between the three various
                        Pages (SignInPage, settingUpPage, and mapPage).
 */

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
