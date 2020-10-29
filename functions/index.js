const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

// const firebase = require('firebase-app');
// const database = require('firebase-database');

// var firebaseConfig = {
//     apiKey: "AIzaSyB4Q1_4syNWg1OvivZmm_wM-Ng5Ywxy6pQ",
//     authDomain: "game-87e77.firebaseapp.com",
//     databaseURL: "https://game-87e77.firebaseio.com",
//     projectId: "game-87e77",
//     storageBucket: "game-87e77.appspot.com",
//     messagingSenderId: "451528605862",
//     appId: "1:451528605862:web:8f59faab9fcdd2826cf467"
//   };
//   // Initialize Firebase
//   firebase.initializeApp(firebaseConfig);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// var firebaseConfig = {
//     apiKey: "AIzaSyB4Q1_4syNWg1OvivZmm_wM-Ng5Ywxy6pQ",
//     authDomain: "game-87e77.firebaseapp.com",
//     databaseURL: "https://game-87e77.firebaseio.com",
//     projectId: "game-87e77",
//     storageBucket: "game-87e77.appspot.com",
//     messagingSenderId: "451528605862",
//     appId: "1:451528605862:web:8f59faab9fcdd2826cf467"
//   };
//   // Initialize Firebase
//   firebase.initializeApp(firebaseConfig);



exports.scoreGame = functions.database.ref('games/{gameId}/players/{player}/game')
    .onCreate((snapshot, context) => {
        let game = snapshot.val();
        // console.log(context.params.gameId, context.params.player, game);
        // console.log(game, game.score, game.words);
        let words = game.words;
        let score = game.score;
        let correct = [];
        // console.log("test1");
        return admin.database().ref("dictionary").once("value").then(dSnap => {
            // console.log("test2")
            let dict = dSnap.val();
            for(let i = 0; i < words.length; i++) {
                if(Object.keys(dict).includes(words[i].toLowerCase())) {
                    correct.push(words[i]);
                }
            };

            // console.log("test3")
            // SCORING
            for(let i = 0; i < correct.length; i++) {
                score += scoreWord(correct[i]);
            }

            // UPLOAD
            game.words = correct;
            game.score = score;
            console.log(game);
            return snapshot.ref.parent.child("game").set(game);
        });
    })

function scoreWord(word) {
    if (word.length > 8) {
        return 11;
    } else if (word.length === 7) {
        return 4;
    } else if (word.length === 6) {
        return 3;
    } else if (word.length === 5) {
        return 2;
    } else if (word.length === 4 || word.length === 3) {
        return 1;
    } else {
        return 0;
    }
}