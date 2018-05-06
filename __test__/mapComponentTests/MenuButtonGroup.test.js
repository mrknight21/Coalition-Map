import 'react-native';
import React from 'react';
import { Icon, ButtonGroup} from 'react-native-elements';

import renderer from 'react-test-renderer';

it('renders correctly', () => {

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

    const buttonGroup = renderer
        .create(
            <ButtonGroup
                buttons={buttons}
                containerStyle={{height: 100, flex: 1}}
            />
        ).toJSON();
    expect(buttonGroup).toMatchSnapshot();
});