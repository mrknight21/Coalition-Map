import React from 'react';
import { Icon } from 'react-native-elements';
import {Marker} from 'react-native-maps';

/*
    LandmarkMarker class component:
        This is the component for individual landmark markers.
 */
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
                    size={30}
                />
            </Marker>
        )
    }
}


