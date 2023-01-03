"use strict";
// virtual keyboard press

function winGame() {
	console.log("You win!");
	gameWon = true;
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
			}, e.elapsedTime);
		},
		{ once: true }
	);
}

function evaulateGuess() {
	if (letters.length !== 5) return;

	const row = document.querySelectorAll(`[data-row="${rowIndex}"]>.guess__tile`);

	for (let i = 0; i < 5; i++) {
		if (letters[i] === testWord[i]) {
			updateColors(row, i, "correct");
		} else if (testWord.includes(letters[i])) {
			updateColors(row, i, "present");
		} else {
			updateColors(row, i, "absent");
		}
	}

	if (letters === testWord) {
		winGame();
	}

	letters = "";
	rowIndex += 1;
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
let testWord = "leave";
let gameWon = false;

handleKeypresses();
