import React from 'react';
import {Text, ScrollView, View, Picker, StyleSheet,Slider} from 'react-native';
import {Button, Card, FormLabel, FormInput, CheckBox} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from './firebase/firebase';
//import bot from '../script/random_walk';


export default class settingUpPage extends React.Component {
    static navigationOptions = {
        title: 'Set Up',
        headerStyle: {
            backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
    };


    constructor(props) {
        super(props);
        this.state = {
            mapcode: this.props.navigation.state.params.mapcode,
            mapColor: null,
            uid: null,
            uColor: 'blue',
            description: "",
            name: "",
            shape: 'face',
            complete: false,
            botsOn: false,
            botsNum:0,
            botsMode:"random",
            botsColor:"green"
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    componentDidMount() {
        this.anonymous_login();
    }

    //////////////Bot functions////////////////////////////////////////////////////////////



    android_init(mapcode, number, center_lat, center_lng, color) {


        const radius = 0.003;

        let botSquad = {};
        for (let i = 1; i <= number; i++) {
        let id = "bot" + i;

        let la_random = Math.random();
        let lo_random = Math.random();
        console.log(lo_random);
        console.log(la_random);
        //
       let bot_la;
       let bot_lo;

       if(la_random >0.5){
           bot_la = parseFloat(center_lat + radius*10*Math.random()).toFixed(7);
       }else {
           bot_la = parseFloat(center_lat - radius*10*Math.random()).toFixed(7);
       }

       if(lo_random >0.5){
           bot_lo = parseFloat(center_lng + radius*10*Math.random()).toFixed(7);
       }else{
           bot_lo = parseFloat(center_lng - radius*10*Math.random()).toFixed(7);
       }



        console.log(" lat: "+bot_la);
        console.log(" lng: "+bot_lo);


            let bot = {
                id: id,
                color: color,
                lat: bot_la,
                lng: bot_lo
            };
        console.log(bot);
        botSquad[id]= bot;
        }
        console.log("finished!!");
        return botSquad;
    }




    //////////////Bot functions////////////////////////////////////////////////////////////




    anonymous_login() {
        firebase.auth().signInAnonymously().catch(function (error) {
            // Handle Errors here.
            let errorCode = error.code;
            let errorMessage = error.message;
            // ...
        });
        uid = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // User is signed in.
                let isAnonymous = user.isAnonymous;
                let uid = user.uid;
                console.log(this.props.navigation.state.params.join);
                this.setState(() => ({uid: uid}));
                if (!this.props.navigation.state.params.join) {
                    this.randomToken();
                    console.log("new map id set! " + uid);
                }
            } else {
                console.log("user sign out");
            }
        });
    }


    randomToken() {
        let codes = [];
        const elements = 'abcdefghijklmnopqrstuvwxyz11223344556677889900';
        // while (true) {
        for (let i = 0; i < 4; i++) {
            let randomElement = elements[(Math.random() * 46) | 0];
            codes[i] = randomElement;
        }
        // let ref = firebase.database().ref(codes.join("") + "/");
        // console.log(this.ref);
        // ref.once("value", (snapshot) => {
        //     if (snapshot.val() === null) {
        //         break;
        //     }
        // });
        // }
        this.setState({mapcode: codes.join("")});
    }


    handleSubmit() {
        const db = firebase.database();
        const uid = this.state.uid;
        const mapcode = this.state.mapcode;
        const host = !this.props.navigation.state.params.join;
        let lat = null;
        let lng = null;

        switch (this.state.botsColor){
            case 'green':this.setState({botsMode: 'random'});
                        break;
            case 'red':this.setState({botsMode: 'attacking'});
                        break;
            case 'orange': this.setState({botsMode:'pet'});
        }

        navigator.geolocation.getCurrentPosition((position) => {
            lat = position.coords.latitude;
            lng = position.coords.longitude;

            console.log("lat: " + lat + " lng: " + lng);

            const user = {
                name: this.state.name,
                description: this.state.description,
                color: this.state.uColor,
                shape: this.state.shape,
                host: host,
                lat: lat,
                lng: lng
            };
            const map = {
                color: this.state.mapColor
            };
            db.ref(mapcode + '/users/' + uid).update(user);
            if (host) {
                db.ref(mapcode + '/setting').set(map);
                console.log("Bots: "+this.state.botsOn);
                console.log("BotNum: "+this.state.botsNum);
                if (this.state.botsOn && this.state.botsNum >0){
                    console.log("reach");
                    let bots = this.android_init(mapcode, this.state.botsNum, lat, lng, this.state.botsColor);
                    console.log(bots);
                    db.ref(mapcode + '/bots').set(bots);
                }
            }

            this.props.navigation.navigate('map', {mapcode: this.state.mapcode, uid: this.state.uid, host:host});
        });
    };

    checkComplete() {
        if (this.state.name != "" && this.state.description != "") {
            this.setState({complete: true})
        } else {
            this.setState({complete: false})
        }
    }


    mapform() {
        if (!this.props.navigation.state.params.join) {
            return (
                <ScrollView>
                    <FormLabel><Icon
                        name='map-o'
                        size={20}
                        color='orange'
                    /> Map Color</FormLabel>

                    <Picker
                        selectedValue={this.state.mapColor}
                        onValueChange={(itemValue, itemIndex) => this.setState({mapColor: itemValue.toLowerCase()})}
                        prompt="Map Color"
                        style={styles.pickers}
                        itemStyle={styles.picker_items}
                    >
                        <Picker.Item label="red" value="red"/>
                        <Picker.Item label="blue" value="blue"/>
                        <Picker.Item label="green" value="green"/>
                        <Picker.Item label="yellow" value="yellow"/>
                        <Picker.Item label="grey" value="grey"/>
                        <Picker.Item label="black" value="black"/>
                    </Picker>

                    <FormLabel><Icon
                        name='android'
                        size={30}
                        color='green'
                    /> Turn on bots?</FormLabel>
                    <CheckBox
                        title='Click Here'
                        checked={this.state.botsOn}
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        onPress={() => this.setState({botsOn: !this.state.botsOn})}
                    />


                    <FormLabel><Icon
                        name='android'
                        size={30}
                        color='green'
                    /> How many bots?</FormLabel>
                    <Slider
                        value={this.state.botsNum}
                        onValueChange={(value) => this.setState({botsNum:value})}
                        maximumValue={10}
                        minimumValue={0}
                        step={1}
                    />
                    <Text>Number: {this.state.botsNum}</Text>

                    <FormLabel><Icon2
                        name='robot'
                        size={30}
                        color='orange'
                    /> Mode</FormLabel>
                    <Picker
                        selectedValue={this.state.botsMode}
                        onValueChange={(itemValue, itemIndex) =>{
                            let color = "green";
                            switch (itemValue){
                                case "Random friendly": color= "green";
                                                        break;
                                case "Rage attacking": color ="red";
                                                        break;
                                case "Cute pet": color="orange";
                                                        break;
                            }
                            this.setState({botsMode: itemValue.toLowerCase(), botsColor:color});
                        }}
                        prompt="Robot Mode"
                        style={styles.pickers}
                        itemStyle={styles.picker_items}
                        // onValueChange={(itemValue, itemIndex) => this.setState({language: itemValue})}
                    >
                        <Picker.Item label="Random friendly" value="Random friendly"/>
                        <Picker.Item label="Rage attacking" value="Rage attacking"/>
                        <Picker.Item label="Cute pet" value="Cute pet"/>
                    </Picker>



                    {/*<Picker*/}
                        {/*selectedValue={this.state.botsColor}*/}
                        {/*onValueChange={(itemValue, itemIndex) => this.setState({mapColor: itemValue.toLowerCase()})}*/}
                        {/*prompt="Map Color"*/}
                        {/*style={styles.pickers}*/}
                        {/*itemStyle={styles.picker_items}*/}
                        {/*// onValueChange={(itemValue, itemIndex) => this.setState({language: itemValue})}*/}
                    {/*>*/}
                        {/*<Picker.Item label="red" value="red"/>*/}
                        {/*<Picker.Item label="blue" value="blue"/>*/}
                        {/*<Picker.Item label="green" value="green"/>*/}
                        {/*<Picker.Item label="yellow" value="yellow"/>*/}
                        {/*<Picker.Item label="grey" value="grey"/>*/}
                        {/*<Picker.Item label="black" value="black"/>*/}
                    {/*</Picker>*/}
                </ScrollView>
            )
        }
    }

    render() {
        const map_form = this.mapform();
        const complete = this.state.complete;
        const buttonC = complete ? "orange" : "grey";

        // if(this.state.name !== "" && this.state.description !=="" ){
        //     this.setState({complete:true});
        // }


        return (
            <ScrollView style={styles.container}>
                <Card containerStyle={styles.card} title={"MAP ID: " + this.state.mapcode}
                      titleStyle={styles.titleText}>
                    <ScrollView>
                        <View>
                            <FormLabel><Icon name="user-circle" size={20}
                                             color='orange'/> Name</FormLabel>
                            <FormInput onChangeText={(text) => {
                                this.setState({name: text.toLowerCase()});
                                this.checkComplete();
                            }}/>
                            <FormLabel><Icon name="pencil" size={20}
                                             color='orange'/> Description</FormLabel>
                            <FormInput onChangeText={(text) => {
                                this.setState({description: text.toLowerCase()});
                                this.checkComplete();
                            }}/>


                            <FormLabel><Icon name="adjust" size={20}
                                             color='orange'/> Color</FormLabel>
                            <Picker
                                selectedValue={this.state.uColor}
                                onValueChange={(itemValue, itemIndex) => this.setState({uColor: itemValue.toLowerCase()})}
                                style={styles.pickers}
                                prompt="Color"
                                itemStyle={styles.picker_items}
                                // onValueChange={(itemValue, itemIndex) => this.setState({language: itemValue})}
                            >
                                <Picker.Item label="red" value="red" />
                                <Picker.Item label="blue" value="blue" />
                                <Picker.Item label="green" value="green" />
                                <Picker.Item label="yellow" value="yellow" />
                                <Picker.Item label="grey" value="grey" />
                                <Picker.Item label="black" value="black" />
                            </Picker>


                            <FormLabel>
                                <Icon2 name="shape" size={20}
                                       color='orange'/>
                                Shape
                            </FormLabel>

                            <Picker
                                selectedValue={this.state.shape}
                                onValueChange={(itemValue, itemIndex) => this.setState({shape: itemValue.toLowerCase()})}
                                prompt="Shape of icon"
                                style={styles.pickers}
                                itemStyle={styles.picker_items}
                            >
                                <Picker.Item label="smily face" value="mood"/>
                                <Picker.Item label="heart" value="favorite"/>
                                <Picker.Item label="star" value="grade"/>
                            </Picker>
                        </View>
                        {map_form}
                        <View>
                            <Button backgroundColor={buttonC} title="Submit" onPress={() => this.handleSubmit()}
                                    disabled={!complete}/>
                        </View>
                    </ScrollView>
                </Card>
            </ScrollView>
        );
    }
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignContent: 'center'
    },

    titleText: {
        fontWeight: 'bold',
        fontSize: 30,
        textAlign: 'center'
    },

    card: {
        width: 340,
        padding: 20,
        marginTop: 50,
        borderRadius: 10
    },
    pickers: {
        borderColor: "orange",
        borderWidth: 2,
        borderRadius: 5
    },

    picker_items: {
        fontSize: 15,
        textAlign: 'center',
    }
});
