import 'react-native';
import React from 'react';
import {View} from 'react-native';
import {Icon} from 'react-native-elements';
import MapView, {Marker} from 'react-native-maps';

import renderer from 'react-test-renderer';

it('renders correctly', () => {
    const map = renderer
        .create(
            <View>
                <MapView>
                </MapView>
            </View>
        ).toJSON();
    expect(map).toMatchSnapshot();
});