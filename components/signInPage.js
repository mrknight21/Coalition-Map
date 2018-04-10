import React from 'react';
import { Text, View } from 'react-native';
import { Card } from 'react-native-elements';

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
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Card>
                    <Text>sign in page</Text>
                </Card>
            </View>
        );
    }
}

export default signInPage;