/**
 * Created by Administer on 23/04/2018.
 */
import firebase from './firebase/firebase';

/*
 n sLatitude: 1 deg = 110.574 km
 w eLongitude: 1 deg = 111.320*cos(latitude) km

 Planning:

 Initialisation in settingup page

 mode:random, zombie, follow

 detect the closest target
 check attach possible
 search and move






 */
module.export= {

    android_init: function(mapcode, number, center_lat, center_lng, radius = 0.0003, color){
    const db = firebase.database();
    const ref = db.ref(mapcode / bots);
    let botSquad = {};
    for (let i = 1; i <= number; i++) {
        let id = "bot" + i;

        let la_random = Math.random();
        let lo_random = Math.random();

        let bot_lat = la_random > 0.5 ? center_la + radius : center_la - radius;
        let bot_lng = lo_random > 0.5 ? center_lo + radius : center_lo - radius;


        botSquad[id] = {
            id: id,
            color: color,
            lat: bot_lat,
            lng: bot_lng
        }
    }
    ref.update(botSquad);
    }


// function random_walker(center_la, center_lo, radius) {
//
//     const bound_north = center_la + radius;
//     const bound_south = center_la + radius;
//     const bound_east = center_lo + radius;
//     const bound_west = center_lo - radius;
//     const move = 0.00003;
//
//     var cur_lat = center_la + Math.random() * radius;
//     var cur_lo = center_lo + Math.random() * radius;
//     var tag = false;
//
//
//     while (!false) {
//         //TODO
//
//
//     }
// }
};


// function search_closest(its_la, its_lo, users) {
//     closest_user
// }
//
// function check_attach() {
//
// }
//
// function move() {
//
// }
