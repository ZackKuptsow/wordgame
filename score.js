var firebaseConfig = {
    apiKey: "AIzaSyB4Q1_4syNWg1OvivZmm_wM-Ng5Ywxy6pQ",
    authDomain: "game-87e77.firebaseapp.com",
    databaseURL: "https://game-87e77.firebaseio.com",
    projectId: "game-87e77",
    storageBucket: "game-87e77.appspot.com",
    messagingSenderId: "451528605862",
    appId: "1:451528605862:web:8f59faab9fcdd2826cf467"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

let url = new URL(window.location.href);
let gameid = url.searchParams.get("gameid");

let db = firebase.database().ref("games").child(gameid);
db.once("value", gameSnap => {
    game = gameSnap.val();

    ["player1", "player2"].forEach((p) => {
        // CHECK WORD LIST IF WORDS ARE IN ENGLISH DICTIONARY
        let guessed = game.players[p]["words"];
        console.log(game);
        let correct = [];
        dictionary = firebase.database().ref("dictionary");
        dictionary.once("value", dSnap => {
            let dict = dSnap.val();
            for(let i = 0; i < guessed.length; i++) {
                if(Object.keys(dict).includes(guessed[i].toLowerCase())) {
                    correct.push(guessed[i]);
                }
            };
            // SCORING
            let score = 0;
            for(let i = 0; i < correct.length; i++) {
                score += scoreWord(correct[i]);
            }

            // UPLOAD
            game.players[p]["words"] = correct;
            game.players[p]["score"] = score;
            db.set(game);
        });
    })
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