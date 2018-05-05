import React from 'react';
import {Text, View} from 'react-native';
import ReactNativeElements, {Card, Icon, Button, ButtonGroup, FormLabel, FormInput} from 'react-native-elements';
import {Marker} from 'react-native-maps';


export default class LandmarkMarker extends React.Component {

    render() {

        return (
            <Marker
                key={this.props.id}
                title={this.props.description}
                description={this.props.nameX}
                coordinate={{
                    latitude: parseFloat(this.props.lat),
                    longitude: parseFloat(this.props.lng),
                }}
            >
                <Icon
                    name={this.props.shapeX}
                    color={this.props.colorX}
                />
            </Marker>
        )
    }
}


