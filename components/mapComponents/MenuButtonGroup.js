import React from 'react';
import { Icon, ButtonGroup} from 'react-native-elements';

/*
    MenuButtonGroup class component:
        This is the component which contains the Add landmark and Message buttons.
 */

export default class MenuButtonGroup extends React.Component {

    // Function which binds up to the parent Map component to ensure the addMarker Card is opened.
    handleAddMarkerCard = () => {
        this.props.toggledStatus("add");
    };

    // Function which binds up to parent Map component to open message modal.
    handleMessageButton = () => {
        this.props.messagesToggled();
    };

    /*  Render method which renders addMarkerIcon and messagingIcon as the elements contained inside of ButtonGroup
        Component
    */
    render () {
        const addMarkerIcon = () => <Icon
            size={50}
            style={{
                flex: 1,
                justifyContent: 'space-between',
            }}
            onPress={this.handleAddMarkerCard}
            name="add"
        />

        const messagingIcon = () => <Icon
            size={50}
            style={{
                flex: 1,
                justifyContent: 'space-between',
            }}
            onPress={this.handleMessageButton}
            name="message"
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



