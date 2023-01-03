# Functional Requirements

## Gameplay

6 tries to guess a five letter word. Typing in a letter will display the letter in the tile. Backspace will delete letters.
Enter will submit guess.
Guesses must be a real word, in word list.

Hard mode: present or correct letters must be present subsequent letters.

## Design

Tiles 5 letters x 6 rows
Virtual keyboard

## Interactions

When typing a letter:

- border of tile changes to light grey
- blinking in animation, including letter
- backspace removes letter and border changes back to dark grey

When submitting a guess:

- Tiles will flip up and background color will change based on guess
- Used letters will change color on keyboard

## States

Tiles:
data-state="absent" = grey, wrong letter
data-state="present" = yellow, correct letter, wrong position
data-state="correct": green, correct letter, correct position
