"use strict";

// virtual keyboard press

function showResetButton() {
	const keyboard = document.querySelectorAll(".keyboard__row").forEach((key) => {
		key.classList.add("transparent-50");
	});
	const resetButton = document.querySelector(".keyboard__reset");

	resetButton.classList.remove("hidden");

	resetButton.addEventListener("click", (e) => {
		location.reload();
	});
}

function loseGame() {
	gameLost = true;

	const messageBox = document.querySelector(".game__message");

	messageBox.textContent = testWord.toUpperCase();
	messageBox.classList.remove("hidden");

	showResetButton();
}

function winGame() {
	gameWon = true;
	const timeToDisplay = 2000;

	const row = document.querySelectorAll(`[data-row="${rowIndex}"]>.guess__tile`);

	row.forEach((tile) => {
		tile.classList.add("guess__tile-bouncing");
		tile.style.backgroundColor = "var(--bg-correct";
		tile.style.border = "none";
	});

	switch (rowIndex) {
		case 0:
			showMessage("Genius", timeToDisplay);
			break;
		case 1:
			showMessage("Magnificent", timeToDisplay);
			break;
		case 2:
			showMessage("Impressive", timeToDisplay);
			break;
		case 3:
			showMessage("Splendid", timeToDisplay);
			break;
		case 4:
			showMessage("Great", timeToDisplay);
			break;
		case 5:
			showMessage("Phew", timeToDisplay);
			break;
	}

	showResetButton();
}

function evaluateWinLoss() {
	if (letters === testWord) {
		winGame();
	} else if (letters !== testWord) {
		letters = "";
		rowIndex += 1;
	}
	if (rowIndex > 5) {
		loseGame();
	}
}

function updateColors(row, index, evaluation) {
	row[index].classList.add(`guess__tile-${evaluation}`);
	row[index].setAttribute("data-key", evaluation);

	const keyboardKey = document.querySelector(`[data-key="${letters[index]}"]`);

	row[index].addEventListener(
		"animationend",
		(e) => {
			setTimeout(() => {
				keyboardKey.classList.add(`keyboard__key-${evaluation}`);

				if (index === testWord.length - 1) {
					evaluateWinLoss();
				}
			}, e.elapsedTime);
		},
		{ once: true }
	);
}

function showMessage(message, time) {
	const messageBox = document.querySelector(".game__message");

	messageBox.textContent = message;
	messageBox.classList.remove("hidden");

	setTimeout(() => {
		messageBox.classList.add("hidden");
	}, time);
}

function rejectGuess() {
	const row = document.querySelector(`[data-row="${rowIndex}"]`);

	showMessage("not in word list", 1500);

	row.classList.add("guess-jiggling");
	row.addEventListener(
		"animationend",
		() => {
			row.classList.remove("guess-jiggling");
		},
		{ once: true }
	);
}

function evaulateGuess() {
	if (letters.length !== 5) return;
	if (!wordlist.includes(letters)) {
		rejectGuess();
		return;
	}

	const row = document.querySelectorAll(`[data-row="${rowIndex}"]>.guess__tile`);

	for (let i = 0; i < 5; i++) {
		let evaluation = "";

		if (letters[i] === testWord[i]) {
			evaluation = "correct";
		} else if (testWord.includes(letters[i])) {
			evaluation = "present";
		} else {
			evaluation = "absent";
		}
		updateColors(row, i, evaluation);
	}
}

function removeLetter() {
	if (letters.length === 0) return;

	letters = letters.slice(0, -1);

	const row = document.querySelectorAll(`[data-row="${rowIndex}"]>.guess__tile`);
	const tile = row[letters.length];

	tile.textContent = "";
	tile.classList.remove("guess__tile-letter");
}

function addLetter(letter) {
	if (letters.length >= 5) return;

	letters += letter;

	const row = document.querySelectorAll(`[data-row="${rowIndex}"]>.guess__tile`);
	const tile = row[letters.length - 1];

	tile.textContent = letter;
	tile.classList.add("guess__tile-letter");
}

function directKeypress(key) {
	if (gameWon) return;
	if (gameLost) return;

	if (key === "enter") {
		evaulateGuess();
	} else if (key === "backspace") {
		removeLetter();
	} else {
		addLetter(key);
	}
}

function handleKeypresses() {
	document.querySelectorAll(".keyboard__key").forEach((key) => {
		key.addEventListener("click", (e) => {
			directKeypress(e.currentTarget.getAttribute("data-key"));
		});
	});

	window.addEventListener("keydown", (e) => {
		const key = e.key.toLowerCase();

		if (
			key === "enter" ||
			key === "backspace" ||
			(key.charCodeAt(0) >= 97 && key.charCodeAt(0) <= 122)
		) {
			directKeypress(key);
		}
	});
}

let letters = "";
let rowIndex = 0;
let testWord = "";
let gameWon = false;
let gameLost = false;

fetch("../assets/json/answerlist.json")
	.then((response) => response.json())
	.then((json) => {
		testWord = json[Math.floor(Math.random() * json.length)];
	});

let wordlist;
fetch("../assets/json/wordlist.json")
	.then((response) => response.json())
	.then((json) => {
		wordlist = json;
	});

handleKeypresses();
