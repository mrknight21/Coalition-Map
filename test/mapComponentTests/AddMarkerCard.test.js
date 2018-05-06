import 'react-native';
import React from 'react';
import {Text, View, ScrollView, Keyboard,  StyleSheet, Image} from 'react-native';
import {Card, Button, FormLabel, FormInput} from 'react-native-elements';

import renderer from 'react-test-renderer';

it('renders correctly', () => {
    const hello = renderer
        .create(
            <Card>
            </Card>
        ).toJSON();
    expect(hello).toMatchSnapshot();
})