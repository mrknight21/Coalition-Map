import React from 'react';
import { Text, View } from 'react-native';
import { Card } from 'react-native-elements';

class mapPage extends React.Component {
    static navigationOptions = {
        title: 'Map',
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
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Card>
                <Text>Map</Text>
                </Card>
            </View>
        );
    }
}

export default mapPage;