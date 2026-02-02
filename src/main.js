// variables,
const movesEl = document.querySelector(".game-moves > p");
const timeEl = document.querySelector(".game-time > p");
const matchEl = document.querySelector(".game-match > p");

const gameBoardEl = document.querySelector(".game-board");
const gameModalEl = document.querySelector(".game-modal");

const resultMoves = document.querySelector(".result-moves");
const resultTime = document.querySelector(".result-time");

const startBtn = document.getElementById("game-start");
const playAgainBtn = document.getElementById("game-playAgain");
let fragmentEl = document.createDocumentFragment();

const images = [
    "/image/dog1.jpg",
    "/image/dog2.jpg",
    "/image/dog3.jpg",
    "/image/dog4.jpg",
    "/image/dog5.jpg",
    "/image/dog6.jpg",
    "/image/dog7.jpg",
    "/image/dog8.jpg",
];

let firstCard = null;
let secondCard = null;
let flipStatus = true;
let timeRunning = true;
let timerRunningId;

let moves = 0;
let matches = 0;
let seconds = 0;

const suffleCards = (card) => {
    card.sort(() => Math.random() - 0.5);
};

const gameBoard = () => {
    let cardImages = images.concat(images);

    suffleCards(cardImages);

    for (let i = 0; i < cardImages.length; i++) {
        let cardEl = document.createElement('div');
        cardEl.className = 'game-card';
        cardEl.innerHTML = `
            <div class="card-front"><ion-icon name="heart"></ion-icon></div>
          <div class="card-back"><img src="${cardImages[i]}" alt="dog-image1"></div>
        `;
        cardEl.dataset.image = cardImages[i];
        cardEl.addEventListener('click', (e) => flippingCard(e));
        fragmentEl.append(cardEl);
    }

    gameBoardEl.append(fragmentEl);

    firstCard = null;
    secondCard = null;
    flipStatus = true;
    timeRunning = true;

    moves = 0;
    matches = 0;
    seconds = 0;

    updateStats();
    clearInterval(timerRunningId);
};

gameBoard();

const flippingCard = (e) => {

    let cardParent = e.target;

    if (!flipStatus) return;

    if (cardParent.classList.contains("matched")) return;
    if (cardParent.classList.contains("flipped")) return;

    if (firstCard == null) {
        firstCard = cardParent;
    } else {
        secondCard = cardParent;
        flipStatus == false;
        moves++;

        updateStats();
    }
};

const checkMatch = () => {
    let match = firstCard.dataset.image == secondCard.dataset.image;

    if (match) {
        setTimeout(() => {
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            matches++;

            if (matches == 8) {
                endGame();
                resetStats();
            }

        }, 500);
    } else {
        setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
        }, 1000);
    }

    updateStats();
};

const updateStats = () => {
    movesEl.textContent = moves;
    matchEl.textContent = matches + "/8";

    let minEl = Math.floor(seconds / 60);
    let secEl = seconds % 60;

    if (min < 10) return "0" + minEl;
    if (secEl < 10) return "0" + secEl;

    timeEl.textContent = `${minEl} : ${secEl}`;
};

const resetStats = () => {
    firstCard = null;
    secondCard = null;
    flipStatus = true;
};

const endGame = () => {
    timerRunningId = clearInterval(() => {
        gameModalEl.style.display = "flex";
    });

    timeRunning = false;

    resultMoves.textContent = movesEl.textContent;
    resultTime.textContent = timeEl.textContent;

    resetStats();
};