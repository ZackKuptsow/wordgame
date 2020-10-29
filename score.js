display.innerHTML = document.getElementById("waiting").innerHTML;

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
db.on("value", gameSnap => {
    game = gameSnap.val();

    display.innerHTML = document.getElementById("scored").innerHTML;

    $("#score1").html(game.players.player1.game.score);
    $("#words1").html(game.players.player1.game.words.join(', '));
    $("#score2").html(game.players.player2.game.score);
    $("#words2").html(game.players.player2.game.words.join(', '));
});