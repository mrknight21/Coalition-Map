/**
 * Created by Administer on 5/05/2018.
 */


import React from 'react';
import {Icon} from 'react-native-elements';
import {Marker} from 'react-native-maps';

import firebase from './firebase/firebase';
export default class Android_bot extends React.Component {

    constructor(props) {
        super(props);
        this.lat =this.props.lat;
        this.lng = this.props.lng;
        this.host = this.props.host;
        this.mapcode = this.props.mapcode;
        this.users = this.props.users;
    }


    componentDidMount() {

        try {
            /* Using getCurrentPosition method on the geolocation to get the current location of user device every 10
             seconds and then firing the showPosition method() */
                this.interval = setInterval(() => {

                    if(this.host && this.users.length>0) {

                            let distances = this.users.map((user) => (Math.abs(user.lat-this.lat)+Math.abs(user.lng-this.lng)));
                            console.log(distances);
                            const idx=distances.indexOf(Math.min.apply(null,distances));
                            console.log(idx);
                            let closest_user = this.users[idx];
                            console.log(closest_user);

                            const radius = 0.0003;


                            let new_coor = {lat:0, lng:0};
                            if ((this.lat-closest_user.lat) > 0){
                                new_coor.lat = this.lat-radius;
                            }else {
                                new_coor.lat = this.lat+radius;
                            }
                            if((this.lng-closest_user.lng) > 0){
                                new_coor.lng = this.lng-radius;
                            }else{
                                new_coor.lng = this.lng+radius;
                            }

                            //let coor = this.android_move(this, closest_user);
                            this.lat = new_coor.lat;
                            this.lng = new_coor.lng;
                            firebase.database().ref(this.mapcode + "/thiss/" + this.id).update({lat:this.lat, lng:this.lng});
                        }
                }, 1000);
        } catch (e) {
            console.log("error", e);
        }
    }



    render(){

        return(
            <Marker
            key={this.props.id}
            title={this.props.id}
            coordinate={{
                latitude: parseFloat(this.props.lat),
                longitude: parseFloat(this.props.lng),
            }}
        >
            <Icon
                name='android'
                color={this.props.color}
                raised={true}
                reverse={true}
            />
        </Marker>
        );}
}