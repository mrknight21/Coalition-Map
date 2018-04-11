/**
 * Created by Administer on 10/04/2018.
 */
import React from 'react';
import { Text, View } from 'react-native';
import { Card,Button, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';

export default class LogginForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
            mapcode: "",
        };
    }
    render() {
        return (
    <View>
        <Card>
            <FormLabel>MAP CODE</FormLabel>
            <FormInput onChangeText={(text) => this.setState({loggedIn, mapcode: text})}/>
            <Button title="Go" onPress={() => this.props.navigation.navigate('map',this.state)}/>
            <Text>OR</Text>
            <Button title="Creat new map" onPress={() => this.props.navigation.navigate('setUp')}/>
        </Card>
    </View>
        );
    }
}

