import React from 'react';
import { Text, View } from 'react-native';
import { Card } from 'react-native-elements';

class settingUpPage extends React.Component {
    static navigationOptions = {
        title: 'Set Up',
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
                    <Text>settingUpPage</Text>
                </Card>
            </View>
        );
    }
}

export default settingUpPage;