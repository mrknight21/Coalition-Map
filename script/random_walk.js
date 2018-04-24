/**
 * Created by Administer on 23/04/2018.
 */


/*
 n sLatitude: 1 deg = 110.574 km
 w eLongitude: 1 deg = 111.320*cos(latitude) km
 */


function random_walker (center_la, center_lo, radius, speed=3000){

    const bound_north = center_la + radius;
    const bound_south = center_la + radius;
    const bound_east =center_lo + radius;
    const bound_west = center_lo - radius;
    const move = 0.00003;

    var cur_lat = center_la + Math.random()*radius;
    var cur_lo = center_lo+ Math.random()*radius;
    var tag = false;


    while (!false){
        //TODO


    }


}