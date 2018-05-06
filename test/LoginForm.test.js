import Icon from 'react-native-vector-icons/FontAwesome';
import React from 'react';
import {Text, View, ScrollView, Keyboard,  StyleSheet, Image} from 'react-native';
import LoginForm from '../components/LoginForm';

import renderer from 'react-test-renderer';

it('renders correctly', () => {
    const hello = renderer
        .create(
        <ScrollView style={{alignContent:'center'}}>
        </ScrollView>
    ).toJSON();
    expect(hello).toMatchSnapshot();
});

it('renders correctly', () => {
    const iconic = renderer
        .create(
            <Icon
                name='map-o'
                size={20}
                color='black'
            />
        ).toJSON();
    expect(iconic).toMatchSnapshot();
});

