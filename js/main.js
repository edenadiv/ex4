'use strict'
document.querySelector(`#intro`).classList.add('flex');
document.querySelector(`#intro`).focus();
document.querySelector(`#game`).classList.add('none');

let board = document.querySelector(`#game-board`);

let subArrBank = null;
let subsId = 1;
let sea;
let final;

let playerName;
let playerTurnsCounter = 0;
let playerBoardSize;
let playerBattleShipsCounter;
let playerTotalBattleShipsSize2;
let playerTotalBattleShipsSize3;
let playerTotalBattleShipsSize4;
let playerTotalBattleShipsSize5;
let playerTotalBattleShips;

let intervalId;
let timerMinutes;
let timerSeconds;
let timerTotalSeconds = 0;

const audioWin = new Audio('./files/audio/win.mp3');
const audioRight = new Audio('./files/audio/correct.mp3');
const audioWrong = new Audio('./files/audio/wrong.mp3');
const audioShip = new Audio('./files/audio/fullSub.mp3');

let winArr = [];
if (window.sessionStorage.getItem('score')) {
    winArr.push(JSON.parse(window.sessionStorage.getItem('score')))[0];
}

document.querySelector(`#player-submit-btn`).addEventListener(`click`, () => {
    if (ValidCheck() == true) {
    InitGame();
    document.querySelector(`#game`).focus();
    } else {
        alert(`Please fill all the fields to start the game. `);
    }
});

// document.querySelector(`#player-submit-btn`).addEventListener(`click`, () => {
//     if (ValidCheck() == false) {
//         alert(`Please fill all the fields to start the game. `);
//     }
// });