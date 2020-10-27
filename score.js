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

function wordExists(gameid, p) {
    let thisGame = firebase.database().ref("games").child(gameid);
    thisGame.once("value", gameSnap => {
        let game = gameSnap.val();
        let guessed = game.players[p]["words"];
        let correct = [];
        dictionary = firebase.database().ref("dictionary");
        dictionary.once("value", dSnap => {
            let dict = dSnap.val();
            for(let i = 0; i < guessed.length; i++) {
                // console.log(`Checking ${guessed[i]}`);
                if(Object.keys(dict).includes(guessed[i].toLowerCase())) {
                    correct.push(guessed[i]);
                }
            };
            game.players[p]["words"] = correct;
            thisGame.set(game);
        });
    });
};

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

function score(gameid, p) {
    const gamesDB = firebase.database().ref("games").child(gameid);
    gamesDB.once("value", gameSnap => {
        let gameinfo = gameSnap.val();
        let words = gameinfo.players[p]["words"];
        let score = 0;
        for (let i = 0; i < words.length; i++) {
            score += scoreWord(words[i]);
        }
        gameinfo.players[p]["score"] = score;
        gamesDB.set(gameinfo);
    });
};

let doneTheStuff;
function whatever(gameid) {
    if (!doneTheStuff) {
        doneTheStuff = true;
        wordExists(gameid, "player1");
        wordExists(gameid, "player2");
        score(gameid, "player1");
        score(gameid, "player2");
    }
}

function populate(gameid) {
    firebase.database().ref("games").child(gameid).once("value", gameSnap => {
        game = gameSnap.val();
        $("#score1").html(game.players.player1.score);
        $("#words1").html(game.players.player1.words);
        $("#score2").html(game.players.player2.score);
        $("#words2").html(game.players.player2.words);
    });
}

let url = new URL(window.location.href);
let gameid = url.searchParams.get("gameid");
whatever(gameid);
populate(gameid);