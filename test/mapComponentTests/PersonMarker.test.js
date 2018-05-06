import 'react-native';
import React from 'react';
import { Icon } from 'react-native-elements';
import {Marker} from 'react-native-maps';

import renderer from 'react-test-renderer';

it('renders correctly', () => {
    const marker = renderer
        .create(
            <Marker>
            </Marker>
        ).toJSON();
    expect(marker).toMatchSnapshot();
})

it('renders correctly', () => {
    const icon = renderer
        .create(
            <Icon>
            </Icon>
        ).toJSON();
    expect(icon).toMatchSnapshot();
})