const InitGame = () => {
    document.querySelector(`#intro`).classList.remove(`flex`);
    document.querySelector(`#intro`).classList.add(`none`);
    document.querySelector(`#game`).classList.remove(`none`);
    document.querySelector(`#game`).classList.add(`flex`);

    playerName = document.querySelector(`#player-name-input`).value;
    const radioArrSize = document.querySelectorAll(".board-size-selectors");
    for (let i = 0; i < radioArrSize.length; i++) {
        if (radioArrSize[i].checked == true) {
            playerBoardSize = (radioArrSize[i].dataset.boardSelectedSize);
        }
    }
    playerTotalBattleShipsSize2 = parseInt(document.querySelectorAll(`.size-inputs`)[0].value);
    playerTotalBattleShipsSize3 = parseInt(document.querySelectorAll(`.size-inputs`)[1].value);
    playerTotalBattleShipsSize4 = parseInt(document.querySelectorAll(`.size-inputs`)[2].value);
    playerTotalBattleShipsSize5 = parseInt(document.querySelectorAll(`.size-inputs`)[3].value);
    playerBattleShipsCounter = playerTotalBattleShipsSize2 + playerTotalBattleShipsSize3 + playerTotalBattleShipsSize4 + playerTotalBattleShipsSize5;
    playerTotalBattleShips = (playerTotalBattleShipsSize2 * 2) +
        (playerTotalBattleShipsSize3 * 3) + (playerTotalBattleShipsSize4 * 4) +
        (playerTotalBattleShipsSize5 * 5);

    /* Set Stats Start */

    /* Set Timer Start */
    timerMinutes = document.querySelector(`#minutes`);
    timerSeconds = document.querySelector(`#seconds`);
    /* Set Timer End */

    document.querySelector(`#stats-name-val`).innerText = playerName;
    document.querySelector(`#stats-board-val`).innerText = `${playerBoardSize}x${playerBoardSize}`;
    document.querySelector(`#stats-turns-val`).innerText = playerTurnsCounter;
    document.querySelector(`#stats-battleships-2`).innerText = playerTotalBattleShipsSize2;
    document.querySelector(`#stats-battleships-3`).innerText = playerTotalBattleShipsSize3;
    document.querySelector(`#stats-battleships-4`).innerText = playerTotalBattleShipsSize4;
    document.querySelector(`#stats-battleships-5`).innerText = playerTotalBattleShipsSize5;

    /* Set Stats End */

    StartGame();
    UpdateLeaderboard();

    for (let i = 0; i < document.querySelectorAll(`.btn`).length; i++) {
        document.querySelectorAll(`.btn`)[i].addEventListener('mouseover', () => {
            document.querySelectorAll(`.btn`)[i].classList.add('hover');
        })
        document.querySelectorAll(`.btn`)[i].addEventListener('mouseout', () => {
            document.querySelectorAll(`.btn`)[i].classList.remove('hover');
        })
    }

    document.querySelectorAll(`.btn`).forEach(element => {
        element.classList.add(`btn-full`);
    });

    let buttons = document.querySelectorAll(`.btn`);
    let tempCount = -1;
    let buttonsSize = GetBoardSize();
    for (let i = 0; i < buttonsSize; i++) {
        for (let j = 0; j < buttonsSize; j++) {
            tempCount++;
            buttons[tempCount].addEventListener('click', () => {
                ButtonChecker(i, j)
            });
        }
    }

    intervalId = setInterval(SetTimer, 1000);
}

const StartGame = (event) => {
    //event.preventDefault();
    final = GetFinalBlocks();

    let gridSize = GetBoardSize();

    sea = new Array(gridSize);
    for (let i = 0; i < gridSize; i++) {
        sea[i] = new Array(gridSize);
    }

    let serial = 0;
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            let x = {
                serialPosition: serial,
                isSubmarine: false, // if this block is part of submarine
                submarineId: null, // if is part of submarine, which id
                submarineSide: null, // vertical or horizontal
                submarineSize: null, // if submarine which size
                isPressed: false, // if the block is pressed
                
                ifSubmarineMiddle: null,
                ifSubmarineNoseSideUp: null, // 
                ifSubmarineNoseSideDown: null, // 
                ifSubmarineNoseSideLeft: null, //
                ifSubmarineNoseSideRight: null, //
                isSubmarineComplete: false //
            }

            serial += 1;
            sea[i][j] = x;
        }
    }

    RandomSubmarines();
    CreateGameGrid(sea);
}

const AudioMaker = (sound) => {
    AudioMuter();
    switch (sound) {
        case "right":
            audioRight.play();
            break;
        case "wrong":
            audioWrong.play();
            break;
        case "ship":
            audioShip.play();
            break;
        case "win":
            audioWin.play();
            break;
        case "start":
            audioRight.play();
            break;
    }
}

const AudioMuter = () => {
    if (audioRight.paused == false) {
        audioRight.pause();
        audioRight.load();
    }
    if (audioWrong.paused == false) {
        audioWrong.pause();
        audioWrong.load();
    }
    if (audioShip.paused == false) {
        audioShip.pause();
        audioShip.load();
    }
    if (audioWin.paused == false) {
        audioWin.pause();
        audioWin.load();
    }
}

const ButtonChecker = (x, y) => {
    let length = sea.length;
    let c;
    if (sea[x][y].isSubmarine == true) {
        if (sea[x][y].isPressed == false) {
            document.querySelectorAll('.btn')[sea[x][y].serialPosition].classList.add("rightPlace");
            AudioMaker("right");
            TurnsCountUp(x, y);
        }
        c = 0;
        sea[x][y].isPressed = true;
        for (let i = 0; i < length; i++) {
            for (let j = 0; j < length; j++) {
                if (sea[i][j].submarineId == sea[x][y].submarineId) {
                    if (sea[i][j].isPressed == true) {
                        c++;
                    }
                }
            }
        }
    } else {
        if (sea[x][y].isPressed == false) {
            document.querySelectorAll('.btn')[sea[x][y].serialPosition].classList.add("wrongPlace");
            AudioMaker("wrong");
        }
    }
    if (c == sea[x][y].submarineSize && c != undefined) {
        let tempSubSize = sea[x][y].submarineSize;
        let tempSubArr = new Array(tempSubSize);
        let isOneTime = false;
        let index = 0;
        for (let i = 0; i < length; i++) {
            for (let j = 0; j < length; j++) {
                if (sea[i][j].submarineId == sea[x][y].submarineId && sea[i][j].submarineId != null && sea[i][j].isSubmarineComplete == false) {
                    document.querySelectorAll('.btn')[sea[i][j].serialPosition].classList.add("submarine");
                    tempSubArr[index] = sea[i][j].isSubmarineComplete;
                    sea[i][j].isSubmarineComplete = true;
                    MakeBattleships();
                }
            }
        }
        for (let i = 0; i < tempSubSize; i++) {
            if (tempSubArr[i] == false)
                isOneTime = true;
        }
        if (isOneTime) {
            RefreshStatsBattleships(x, y);
            AudioMaker("ship");
        }
    }
    TurnsCountUp(x, y);
    EndGameCheck();
}

const MakeBattleships = () => {
    tempArr = document.querySelectorAll('.btn');
    for (let i = 0; i < sea.length; i++) {
        for (let j = 0; j < sea.length; j++) {
            if (sea[i][j].isSubmarine == true && sea[i][j].isPressed && sea[i][j].isSubmarineComplete) {
                if (sea[i][j].ifSubmarineMiddle) {
                    tempArr[sea[i][j].serialPosition].classList.remove(`btn-full`);
                    tempArr[sea[i][j].serialPosition].classList.add(`btn-full-square`);
                } else if (sea[i][j].ifSubmarineNoseSideUp) {
                    tempArr[sea[i][j].serialPosition].classList.remove(`btn-full`);
                    tempArr[sea[i][j].serialPosition].classList.add(`btn-half-up`);
                } else if (sea[i][j].ifSubmarineNoseSideDown) {
                    tempArr[sea[i][j].serialPosition].classList.remove(`btn-full`);
                    tempArr[sea[i][j].serialPosition].classList.add(`btn-half-down`);
                } else if (sea[i][j].ifSubmarineNoseSideLeft) {
                    tempArr[sea[i][j].serialPosition].classList.remove(`btn-full`);
                    tempArr[sea[i][j].serialPosition].classList.add(`btn-half-left`);
                } else if (sea[i][j].ifSubmarineNoseSideRight) {
                    tempArr[sea[i][j].serialPosition].classList.remove(`btn-full`);
                    tempArr[sea[i][j].serialPosition].classList.add(`btn-half-right`);
                }
            }
        }
    }
}

const TurnsCountUp = (x, y) => {
    if (sea[x][y].isPressed == false) {
        playerTurnsCounter++;
        sea[x][y].isPressed = true;
        document.querySelector(`#stats-turns-val`).innerHTML = playerTurnsCounter;
    }
}

const RandomSubmarines = () => {
    const gridSize = GetBoardSize();

    while (GetAllBattleShipsSize() > 0) {
        let subSize = GetAllBattleShipsSize();
        isEnoughSpace = null;
        do {
            let x = Math.floor(Math.random() * (gridSize - 1));
            let y = Math.floor(Math.random() * (gridSize - 1));
            if (sea[x][y].isSubmarine != undefined) {
                if (sea[x][y].isSubmarine == false) {
                    randSub = RandOneSubmarine();
                    if (randSub == 0) {
                        return;
                    }
                    let vOrH = Math.floor(Math.random() * 2);
                    subSide = null;
                    if (vOrH == 0)
                        subSide = "horizontal";
                    else
                        subSide = "vertical";

                    if (vOrH == 0) { // horizontal
                        tempCount = 0;
                        for (let h = x; h < randSub + x; h++) {
                            if (!(h >= gridSize)) {
                                if (sea[h][y].isSubmarine == false)
                                    ++tempCount;
                            }
                        }
                        if (tempCount == randSub)
                            isEnoughSpace = true;
                        else
                            isEnoughSpace = false;
                    } else { // vertical
                        tempCount = 0;
                        for (let v = y; v < randSub + y; v++) {
                            if (!(v >= gridSize)) {
                                if (sea[x][v].isSubmarine == false)
                                    ++tempCount;
                            }
                        }
                        if (tempCount == randSub)
                            isEnoughSpace = true;
                        else
                            isEnoughSpace = false;
                    }

                    if (isEnoughSpace) {
                        if (subSide == "horizontal") {
                            let nose = 0;
                            for (let h = x; h < randSub + x; h++) {
                                sea[h][y].isSubmarine = true;
                                sea[h][y].submarineId = subsId;
                                sea[h][y].submarineSide = "vertical"
                                sea[h][y].submarineSize = randSub
                                sea[h][y].isPressed = false;
                                nose == 0 ? sea[h][y].ifSubmarineNoseSideUp = true : null;
                                nose == sea[h][y].submarineSize - 1 ? sea[h][y].ifSubmarineNoseSideDown = true : null;
                                if (nose != 0 && nose != sea[h][y].submarineSize - 1) {
                                    sea[h][y].ifSubmarineMiddle = true
                                }
                                nose++
                            }
                            subsId++;
                        } else {
                            let nose = 0;
                            for (let v = y; v < randSub + y; v++) {
                                sea[x][v].isSubmarine = true;
                                sea[x][v].submarineId = subsId;
                                sea[x][v].submarineSide = "horizontal"
                                sea[x][v].submarineSize = randSub
                                sea[x][v].isPressed = false;
                                nose == 0 ? sea[x][v].ifSubmarineNoseSideLeft = true : null;
                                nose == sea[x][v].submarineSize - 1 ? sea[x][v].ifSubmarineNoseSideRight = true : null;
                                if (nose != 0 && nose != sea[x][v].submarineSize - 1) {
                                    sea[x][v].ifSubmarineMiddle = true
                                }
                                nose++
                            }
                            subsId++;
                        }
                        SetBattleShipsSize(randSub);
                    }
                }
            } else
                isEnoughSpace = false;
        } while (!isEnoughSpace)
    }
}



const SubmarinesBankInit = () => {
    subArrBank = [
        [GetBattleShipsSize(2)],
        [GetBattleShipsSize(3)],
        [GetBattleShipsSize(4)],
        [GetBattleShipsSize(5)]
    ];
}

const RandOneSubmarine = () => {
    let randSub = null;
    let total = 0;
    for (let i = 0; i < 4; i++) {
        total += parseInt(document.querySelectorAll(`.size-inputs`)[i].value);
    }
    while (total != 0) {
        randSub = Math.floor(Math.random() * (5 - 2 + 1)) + 2;
        if (parseInt(document.querySelectorAll(`.size-inputs`)[randSub - 2].value) != 0) {
            return randSub;
        }
    }
    return 0;
}

const RemoveSubmarine = (submarine) => {
    let randSub = null;
    let subSize = GetAllBattleShipsSize();

    if (subSize != 0) {
        SetBattleShipsSize(randSub);
    }
}

const CreateGameGrid = (sea) => {
    const gridSize = GetBoardSize();
    let count = 0;
    let table = ` `;
    table += `<table>`;
    for (let i = 0; i < gridSize; i++) {
        table += `<tr>`;
        for (let j = 0; j < gridSize; j++) {
            count++;
            table += `<td><button type="button" class="btn" id="btn${count}"></button></td>`;
        }
        table += `</tr>`;
    }
    table += `</table>`;
    str = table;
    board.innerHTML = table;
}

// get the current player name.
const GetPlayerName = () => {
    return document.querySelector(`#player-name-input`).value;
}

// to know what is the selected board size (need to multiplie,
// if the function return 10, its meaning the selected size is 10*10.)
const GetBoardSize = () => {
    const radioArr = document.querySelectorAll(".board-size-selectors");
    for (let i = 0; i < radioArr.length; i++) {
        if (radioArr[i].checked == true) {
            return (parseInt(radioArr[i].dataset.boardSelectedSize));
        }
    }
}

// to know how many battle ships to create from each size
// (need to pass to the function the size of the battleShip.
// if we pass 2 and the function return 3, its meaning we need to make
// 3 battleShips of size 2.)
const GetBattleShipsSize = (battleShipSize) => {
    if (battleShipSize > 5 || battleShipSize < 2)
        return 0;
    return parseInt(document.querySelectorAll(`.size-inputs`)[battleShipSize - 2].value);
}

const GetAllBattleShipsSize = () => {
    const size2 = GetBattleShipsSize(2);
    const size3 = GetBattleShipsSize(3);
    const size4 = GetBattleShipsSize(4);
    const size5 = GetBattleShipsSize(5);
    const allSubSize = parseInt(parseInt(size2) + parseInt(size3) + parseInt(size4) + parseInt(size5));
    return allSubSize;
}

const SetBattleShipsSize = (battleShipSize) => {
    if (!(battleShipSize > 5 || battleShipSize < 2))
        document.querySelectorAll(`.size-inputs`)[battleShipSize - 2].value = parseInt(document.querySelectorAll(`.size-inputs`)[battleShipSize - 2].value) - 1;
}

const EndGameCheck = () => {
    let endCount = 0;
    for (let i = 0; i < GetBoardSize(); i++) {
        for (let j = 0; j < GetBoardSize(); j++) {
            if (sea[i][j].isPressed == true && sea[i][j].isSubmarine == true)
                endCount++;
        }
    }

    if (endCount == playerTotalBattleShips) {
        clearInterval(intervalId);
        AudioMaker("win");
        Leaderboard();
        window.location.replace('http://se.shenkar.ac.il/students/2022-2023/web1/dev_14/exercises/ex4/edit.php')
        // alert(`${playerName} Won The Game In ${playerTurnsCounter} Truns!\n and The Time Was: ${seconds.innerHTML}:${minutes.innerHTML}. `);
        // location.reload()
    }
}

const GetFinalBlocks = () => {
    let answer = 0;
    for (let i = 2; i < 6; i++) {
        answer += ((GetBattleShipsSize(i) * GetBattleShipsSize(i)) * i);
    }
    return answer;
}

const RefreshStatsBattleships = (x, y) => {
    const size = sea[x][y].submarineSize;
    if (size > 1 && size < 6) {
        if (parseInt(document.querySelector(`#stats-battleships-${size}`).innerText) > 0) {
            let ans = parseInt(document.querySelector(`#stats-battleships-${size}`).innerHTML) - 1;
            document.querySelector(`#stats-battleships-${size}`).innerText = ans;
        }
    }
}

const ValidCheck = () => {
    if (document.querySelector(`#player-name-input`).value != null && document.querySelector(`#player-name-input`).value != undefined && document.querySelector(`#player-name-input`).value != null && document.querySelector(`#player-name-input`).value != '') {
        let radioArrSize = document.querySelectorAll(".board-size-selectors");
        let tempAns = false;
        for (let i = 0; i < radioArrSize.length; i++) {
            if (radioArrSize[i].checked == true) {
                tempAns = true;;
            }
        }
        if (tempAns == true) {
            let tempCnt = 0;
            for (let i = 0; i < 4; i++) {
                if (parseInt(document.querySelectorAll(`.size-inputs`)[0].value) > 0 && parseInt(document.querySelectorAll(`.size-inputs`)[0].value) < 6)
                    tempCnt++
            }
            if (tempCnt == 4)
                return true;
        }
    }
    return false;
}

/* Timer Start */

function SetTimer() {
    timerTotalSeconds++;
    timerMinutes.innerHTML = TimerPad(parseInt(timerTotalSeconds % 60));
    timerSeconds.innerHTML = TimerPad(parseInt(timerTotalSeconds / 60));
}

function TimerPad(value) {
    let valueStr = String(value);
    if (valueStr.length < 2)
        return "0" + valueStr;
    else return valueStr;
}

/* Timer End */
const Leaderboard = () => {
    LeaderboardToString();
    UpdateLeaderboard();
}

const LeaderboardToString = () => {
    winArr.push(`${playerName} ${playerTurnsCounter} ${seconds.innerHTML}:${minutes.innerHTML}.`);
    window.sessionStorage.setItem('score', JSON.stringify(winArr));
}

const UpdateLeaderboard = () => {
    for (let i = 0; i < 5; i++) {
        if (document.querySelector(`#leaderboard-place-${i+1}-val`).innerText = "placeholder")
            document.querySelector(`#leaderboard-place-${i+1}-val`).classList.add("whiteText");
    }
    if (window.sessionStorage.getItem('score')) {
        let all = window.sessionStorage.getItem('score');
        allLength = JSON.parse(window.sessionStorage.getItem('score')).length;
        let max = new Array(3);
        if (allLength > 5) {
            for (let i = 0; i < allLength; i++) {

            }
        } else {
            for (let i = 0; i < allLength; i++) {
                max[i] = all[i];
            }
            for (let i = 0; i < allLength; i++) {
                document.querySelector(`#leaderboard-place-${i+1}-val`).classList.remove("whiteText");
                document.querySelector(`#leaderboard-place-${i+1}-val`).innerText = JSON.parse(window.sessionStorage.getItem('score'))[i];
            }
        }
    }
}