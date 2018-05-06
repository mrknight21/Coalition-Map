import React from 'react';
import {Text} from 'react-native';
import {Card, Button, FormLabel, FormInput} from 'react-native-elements';


export default class AddMarkerCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            description: ""
        }
    }

    exitAddMarker = () => {
        this.props.cardStatus("exit");
    };

    addMarkerToDB = () => {
        this.props.addCardBool(this.state.description);
    };

    render() {

        return (
            <Card
                title='Add a marker'
            >
                <Text style={{marginBottom: 10}}>
                    Pick your choice and add!
                </Text>
                <FormLabel>
                    Add description to marker
                </FormLabel>
                <FormInput
                    onChangeText={(text) => this.setState({description: text})}
                />
                <Button
                    onPress={this.exitAddMarker}
                    buttonStyle={{position: "relative", width: 50, height: 50}}
                    icon={{name: 'clear'}}
                />
                <Button
                    onPress={this.addMarkerToDB}
                    icon={{name: 'code'}}
                    backgroundColor='#03A9F4'
                    buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
                    title='ADD'
                />
            </Card>
        )
    }
}


