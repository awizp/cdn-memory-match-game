document.addEventListener('DOMContentLoaded', () => {

    // variables,
    const movesEl = document.getElementById("game-moves");
    const timeEl = document.getElementById("game-time");
    const matchEl = document.getElementById("game-match");

    const gameBoardEl = document.querySelector(".game-board");
    const gameModalEl = document.querySelector(".game-modal");

    const resultMoves = document.querySelector(".result-moves");
    const resultTime = document.querySelector(".result-time");

    const startBtn = document.getElementById("game-start");
    const playAgainBtn = document.getElementById("game-playAgain");

    let fragmentEl = document.createDocumentFragment();

    const images = [
        "dog1.jpg",
        "dog2.jpg",
        "dog3.jpg",
        "dog4.jpg",
        "dog5.jpg",
        "dog6.jpg",
        "dog7.jpg",
        "dog8.jpg",
    ];

    // game states for elements,
    let firstCard = null;
    let secondCard = null;
    let flipStatus = true;
    let timeRunning = false;
    let timerInterval;

    // game stat values,
    let moves = 0;
    let matches = 0;
    let seconds = 0;

    // suffle the cards before append,
    const shuffleCards = (card) => {
        for (let i = card.length - 1; i > 0; i--) {
            let randomNum = Math.floor(Math.random() * (i + 1));

            [card[i], card[randomNum]] = [card[randomNum], card[i]];
        }
    };

    // update the stats on every time,
    const updateStats = () => {
        movesEl.textContent = moves;
        matchEl.textContent = matches + "/8";

        let minEl = Math.floor(seconds / 60);
        let secEl = seconds % 60;

        if (minEl < 10) minEl = "0" + minEl;
        if (secEl < 10) secEl = "0" + secEl;

        timeEl.textContent = `${minEl} : ${secEl}`;
    };

    // starting the timer,
    const startTimer = () => {
        timeRunning = true;
        timerInterval = setInterval(() => {
            seconds++;
            updateStats();
        }, 1000);
    };

    // resetting the cards value,
    const resetCards = () => {
        firstCard = null;
        secondCard = null;
        flipStatus = true;
    };

    // debounce method,
    const debounce = (func, delay = 500) => {
        let timeoutFunc;

        return () => {
            clearTimeout(timeoutFunc);
            timeoutFunc = setTimeout(() => {
                func();
            }, delay);
        };
    };

    // ending the game
    const endGame = () => {
        clearInterval(timerInterval);

        resultMoves.textContent = movesEl.textContent;
        resultTime.textContent = timeEl.textContent;
        gameModalEl.style.display = 'flex';
        moves = seconds = matches = 0;
        timeRunning = false;
    };

    // check the two cards if matches,
    const checkMatch = () => {
        let match = firstCard.dataset.image == secondCard.dataset.image;

        if (match) {
            setTimeout(() => {
                firstCard.classList.add("matched");
                secondCard.classList.add("matched");
                matches++;

                updateStats();
                resetCards();

                if (matches == 8) {
                    endGame();
                }

            }, 500);
        } else {
            setTimeout(() => {
                firstCard.classList.remove("flipped");
                secondCard.classList.remove("flipped");
                resetCards();
            }, 1250);
        }

        updateStats();
    };

    // card flipping after game board,
    const flippingCard = (e) => {

        let cardParent = e.target;

        if (!flipStatus) return;

        if (cardParent.classList.contains("matched")) return;
        if (cardParent.classList.contains("flipped")) return;

        cardParent.classList.add('flipped');

        if (firstCard == null) {
            firstCard = cardParent;
        } else {
            secondCard = cardParent;
            flipStatus == false;
            moves++;

            updateStats();
            checkMatch();
        }
    };

    // creating game board,
    const gameBoard = () => {
        let cardImages = images.concat(images);
        gameBoardEl.innerHTML = "";

        shuffleCards(cardImages);

        for (let i = 0; i < cardImages.length; i++) {
            let cardEl = document.createElement('div');
            cardEl.className = 'game-card';
            cardEl.innerHTML = `
                <div class="card-front pointer-events-none">
                    <i class="fa-solid fa-spider pointer-events-none"></i>
                </div>
                <div class="card-back pointer-events-none">
                    <img src="/image/${cardImages[i]}" alt="dog-image${i}"/>
                </div>
        `;
            cardEl.dataset.image = cardImages[i];
            cardEl.addEventListener('click', (e) => debounce(flippingCard(e)));
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
    };

    const startGame = () => {
        if (!timeRunning) {
            startTimer();
        }

        gameModalEl.style.display = 'none';
        gameBoard();
        startBtn.style.display = 'none';
    };

    startBtn.addEventListener('click', debounce(startGame));
    playAgainBtn.addEventListener('click', debounce(startGame));
});
