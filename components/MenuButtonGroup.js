import React from 'react';
import {Text, View} from 'react-native';
import ReactNativeElements, {Card, Icon, Button, ButtonGroup, FormLabel, FormInput} from 'react-native-elements';

export default class MenuButtonGroup extends React.Component {

    render () {
        const addMarkerIcon = () => <Icon
            size={20}
            style={{
                flex: 1,
                justifyContent: 'space-between',
            }}
            // onPress={() => this.toggleAddMarkerCard('add')}
            name="add"
            // raised={true}
        />

        const messagingIcon = () => <Icon
            size={20}
            style={{
                flex: 1,
                justifyContent: 'space-between',
            }}
            name="message"
            // raised={true}
        />

        const buttons = [
            {element: addMarkerIcon},
            {element: messagingIcon}
        ];

        return (
                <ButtonGroup
                    buttons={buttons}
                    containerStyle={{height: 100, flex: 1}}
                />
        )
    }
}



