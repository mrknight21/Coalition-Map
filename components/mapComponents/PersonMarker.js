import React from 'react';
import {Icon} from 'react-native-elements';
import {Marker} from 'react-native-maps';


export default class PersonMarker extends React.Component {

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
                    raised={true}
                    reverse={true}
                    reverseColor='white'
                />
            </Marker>
        )
    }
}


