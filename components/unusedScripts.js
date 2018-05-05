// firebase.database().ref(this.mapcode + '/users')
//     .on('value', (snapshot) => {
//         const participants = [];
//         snapshot.forEach((childSnapshot) => {
//             participants.push({
//                 id: childSnapshot.key,
//                 nameX: childSnapshot.child("name").val().toString(),
//                 description: childSnapshot.child('description').val().toString(),
//                 lat: childSnapshot.child('lat').val().toString(),
//                 lng: childSnapshot.child('lng').val().toString(),
//                 shapeX: childSnapshot.child('shape').val().toString(),
//                 colorX: childSnapshot.child('color').val().toString(),
//             });
//         })
//         this.setState(() => ({participants: participants}));
//     }, (error) => {
//         console.log("Error", error);
//     });