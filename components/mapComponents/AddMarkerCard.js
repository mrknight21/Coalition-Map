import React from 'react';
import {Text} from 'react-native';
import {Card, Button, FormLabel, FormInput} from 'react-native-elements';

/*
    AddMarkerCard class component:
        This is the card component which allows users to add a component.
 */

export default class AddMarkerCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            description: ""
        }
    }

    // Function to bind upto parent Map component to exit the card when exit button pressed.
    exitAddMarker = () => {
        this.props.cardStatus("exit");
    };

    // Function to bind up to parent Map component to add marker to DB when add button pressed.
    addMarkerToDB = () => {
        this.props.addCardBool(this.state.description);
    };

    // Render method rendering the card and containing text, form and exit and add buttons.
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


