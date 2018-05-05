import React from 'react';
import { Icon, ButtonGroup} from 'react-native-elements';

export default class MenuButtonGroup extends React.Component {

    handleAddMarkerCard = () => {
        this.props.toggledStatus("add");
    };

    render () {
        const addMarkerIcon = () => <Icon
            size={20}
            style={{
                flex: 1,
                justifyContent: 'space-between',
            }}
            onPress={this.handleAddMarkerCard}
            name="add"
        />

        const messagingIcon = () => <Icon
            size={20}
            style={{
                flex: 1,
                justifyContent: 'space-between',
            }}
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



