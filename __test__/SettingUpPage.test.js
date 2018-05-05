import 'react-native';
import React from 'react';
import {Text, ScrollView, View, Picker, StyleSheet,Slider} from 'react-native';
import {Button, Card, FormLabel, FormInput, CheckBox} from 'react-native-elements';

import renderer from 'react-test-renderer';

it('renders correctly', () => {
    const settingUpView = renderer
        .create(
            <ScrollView/>
        ).toJSON();
    expect(settingUpView).toMatchSnapshot();
});
