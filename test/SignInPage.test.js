import 'react-native';
import React from 'react';

import renderer from 'react-test-renderer';
import LoginForm from "../components/LoginForm";

it('renders correctly', () => {
    const loginForm = renderer
        .create(
            <LoginForm/>
        ).toJSON();
    expect(loginForm).toMatchSnapshot();
});