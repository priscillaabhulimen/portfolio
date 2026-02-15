'use client';

import { useEffect, useRef } from 'react';

interface ThreeInARowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ThreeInARowModal({ isOpen, onClose }: ThreeInARowModalProps) {
  const gameContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !gameContainerRef.current) return;

    // Game variables
    let timer: NodeJS.Timeout;
    let gameOver = true;
    let isChecked = false;
    let isPaused = false;
    let correctEntries: any[] = [];
    let correctToWin = 0;
    let incorrectEntries: any[] = [];
    let timeLeft = 0;
    let resp: any;

    const theGame = gameContainerRef.current;

    async function getRemoteData() {
      const url = 'https://prog2700.onrender.com/threeinarow/random';

      try {
        resp = await (await fetch(url)).json();
        drawTable();
      } catch (error: any) {
        console.log(error.message);
        const errorMessage = document.createElement('h1');
        errorMessage.innerText = error.message;
        errorMessage.className = 'text-red-500 text-center';
        theGame.appendChild(errorMessage);
      }
    }

    function drawTable() {
      theGame.innerHTML = '';

      const table = document.createElement('table');
      table.className = 'border-collapse mx-auto';
      const tableBody = document.createElement('tbody');
      tableBody.setAttribute('id', 'game-body');
      const rows = resp.rows;

      for (let row = 0; row < rows.length; row++) {
        const currentRow = rows[row];
        timeLeft = Math.ceil(2.93 * Math.pow(rows.length, 1.94));
        const newRow = document.createElement('tr');
        for (let cell = 0; cell < currentRow.length; cell++) {
          newRow.appendChild(processCell(currentRow[cell], `r${row}c${cell}`));
        }
        tableBody.appendChild(newRow);
      }

      table.appendChild(tableBody);
      theGame.appendChild(table);

      const startButton = document.createElement('button');
      startButton.className = 'mt-6 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-all duration-300 hover:scale-105';
      startButton.innerText = 'Start';
      startButton.addEventListener('click', () => startGame(startButton));
      theGame.appendChild(startButton);
    }

    function processCell(currentCell: any, coordinates: string) {
      const newTableCell = document.createElement('td');
      newTableCell.setAttribute('id', coordinates);
      newTableCell.className = 'w-8 h-8 border border-white/20 cursor-pointer transition-all duration-200';

      const currentState = currentCell.currentState;
      if (currentState == 0) {
        newTableCell.classList.add('bg-gray-700');
      }

      if (!currentCell.canToggle) {
        if (currentState == 1) {
          newTableCell.classList.add('bg-green-500');
          newTableCell.classList.remove('cursor-pointer');
        }
      } else {
        correctToWin += 1;
        newTableCell.addEventListener('click', function () {
          handleCellClick(this, currentCell, coordinates);
        });
      }

      return newTableCell;
    }

    function handleCellClick(element: HTMLElement, entry: any, coordinates: string) {
      if (gameOver || isPaused) return;

      const hasFilled = element.classList.contains('bg-green-500');
      const hasUnclicked = element.classList.contains('bg-gray-700');

      if (entry.canToggle) {
        if (hasFilled) {
          element.classList.remove('bg-green-500');
          element.classList.add('bg-gray-700');
          addToAppropriateList(entry, 2, coordinates);
        } else if (hasUnclicked) {
          element.classList.remove('bg-gray-700');
          element.classList.add('bg-green-500');
          addToAppropriateList(entry, 1, coordinates);
        } else {
          element.classList.add('bg-gray-700');
          addToAppropriateList(entry, 0, coordinates);
        }
      }
    }

    function addToAppropriateList(cellEntry: any, state: number, coordinates: string) {
      const entry = { ...cellEntry, coordinates };

      const includedInCorrect = correctEntries.some(e => e.coordinates === coordinates);
      const includedInIncorrect = incorrectEntries.some(e => e.coordinates === coordinates);

      if (state == 0) {
        correctEntries = correctEntries.filter(e => e.coordinates !== coordinates);
        incorrectEntries = incorrectEntries.filter(e => e.coordinates !== coordinates);
      } else if (entry.correctState == state) {
        incorrectEntries = incorrectEntries.filter(e => e.coordinates !== coordinates);
        if (!includedInCorrect) correctEntries.push(entry);
      } else {
        correctEntries = correctEntries.filter(e => e.coordinates !== coordinates);
        if (!includedInIncorrect) incorrectEntries.push(entry);
      }

      updateHintColors(isChecked);

      if (correctToWin <= correctEntries.length) {
        endGamePlay();
      }
    }

    function startGame(button: HTMLElement) {
      gameOver = false;
      theGame.removeChild(button);
      createInGameState();
      setGameTimer();
    }

    function createInGameState() {
      const inGameSection = document.createElement('div');
      inGameSection.className = 'flex flex-col items-center gap-4 mt-6';

      const timerText = document.createElement('h1');
      timerText.className = 'text-2xl font-bold text-white';
      timerText.id = 'timer-text';
      updateTimerDisplay();

      const statusText = document.createElement('h3');
      statusText.id = 'status-text';
      statusText.className = 'text-yellow-400 h-6';

      const buttonGroup = document.createElement('div');
      buttonGroup.className = 'flex gap-3';

      const pauseButton = document.createElement('button');
      pauseButton.className = 'px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg transition-all duration-300';
      pauseButton.innerText = 'Pause';
      pauseButton.addEventListener('click', handlePauseClick);

      const checkButton = document.createElement('button');
      checkButton.className = 'px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-all duration-300';
      checkButton.innerText = 'Check Status';
      checkButton.addEventListener('click', showStatusText);

      const hintLabel = document.createElement('label');
      hintLabel.className = 'flex items-center gap-2 text-white cursor-pointer';
      const hintCheckbox = document.createElement('input');
      hintCheckbox.type = 'checkbox';
      hintCheckbox.id = 'hint-toggle';
      hintCheckbox.className = 'w-4 h-4';
      hintCheckbox.addEventListener('change', handleCheckHints);
      hintLabel.appendChild(hintCheckbox);
      hintLabel.appendChild(document.createTextNode('Hints'));

      buttonGroup.appendChild(pauseButton);
      buttonGroup.appendChild(checkButton);
      buttonGroup.appendChild(hintLabel);

      inGameSection.appendChild(timerText);
      inGameSection.appendChild(statusText);
      inGameSection.appendChild(buttonGroup);
      theGame.appendChild(inGameSection);

      function updateTimerDisplay() {
        const timeString = `${Math.floor(timeLeft / 60).toString().padStart(2, '0')}:${(timeLeft % 60).toString().padStart(2, '0')}`;
        timerText.innerText = `Time Left: ${timeString}`;
      }

      function handlePauseClick() {
        isPaused = !isPaused;
        pauseButton.innerText = isPaused ? 'Resume' : 'Pause';
        const hintBox = document.querySelector('#hint-toggle') as HTMLInputElement;
        if (hintBox) hintBox.disabled = isPaused;

        if (isPaused) {
          clearInterval(timer);
          document.querySelectorAll('td').forEach(el => {
            (el as HTMLElement).style.backgroundColor = '#d2691e';
          });
        } else {
          setGameTimer();
          document.querySelectorAll('td').forEach(el => {
            (el as HTMLElement).style.backgroundColor = '';
          });
        }
      }

      function handleCheckHints(e: Event) {
        const checked = (e.target as HTMLInputElement).checked;
        isChecked = checked;
        updateHintColors(checked);

        setTimeout(() => {
          const checkbox = document.querySelector('#hint-toggle') as HTMLInputElement;
          if (checkbox) {
            checkbox.checked = false;
            isChecked = false;
            updateHintColors(false);
          }
        }, 3000);
      }

      function showStatusText() {
        statusText.innerText = incorrectEntries.length === 0 ? 'So far so good' : 'Looks like something is off';
        setTimeout(() => {
          statusText.innerText = '';
        }, 3000);
      }
    }

    function setGameTimer() {
      if (timer) clearInterval(timer);
      if (gameOver || isPaused) return;

      timer = setInterval(() => {
        timeLeft -= 1;
        const timerEl = document.getElementById('timer-text');
        if (timerEl) {
          const timeString = `${Math.floor(timeLeft / 60).toString().padStart(2, '0')}:${(timeLeft % 60).toString().padStart(2, '0')}`;
          timerEl.innerText = `Time Left: ${timeString}`;
        }

        if (timeLeft <= 0) {
          timeLeft = 0;
          endGamePlay(true);
        }
      }, 1000);
    }

    function updateHintColors(checked: boolean) {
      if (isPaused) return;

      document.querySelectorAll('td').forEach(cell => {
        (cell as HTMLElement).style.backgroundColor = '';
      });

      if (checked) {
        incorrectEntries.forEach(entry => {
          const cell = document.querySelector(`#${entry.coordinates}`) as HTMLElement;
          if (cell) cell.style.backgroundColor = '#ef4444';
        });
      }
    }

    function endGamePlay(isTimeUp = false) {
      gameOver = true;
      clearInterval(timer);
      updateHintColors(false);

      theGame.innerHTML = '';

      const endSection = document.createElement('div');
      endSection.className = 'flex flex-col items-center gap-4 mt-6';

      const title = document.createElement('h1');
      title.className = 'text-3xl font-bold';
      title.innerText = isTimeUp ? "Time's up. You Lose!!" : 'YOU WIN!';
      title.style.color = isTimeUp ? '#ef4444' : '#22c55e';

      const correctText = document.createElement('p');
      correctText.className = 'text-white';
      correctText.innerText = `Correct Boxes: ${correctEntries.length}`;

      const incorrectText = document.createElement('p');
      incorrectText.className = 'text-white';
      incorrectText.innerText = `Incorrect Boxes: ${correctToWin - correctEntries.length}`;

      const buttonGroup = document.createElement('div');
      buttonGroup.className = 'flex gap-3 mt-4';

      const restartButton = document.createElement('button');
      restartButton.className = 'px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-all duration-300';
      restartButton.innerText = 'Play Again';
      restartButton.addEventListener('click', () => {
        clearValues();
        drawTable();
      });

      const newGameButton = document.createElement('button');
      newGameButton.className = 'px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-all duration-300';
      newGameButton.innerText = 'New Game';
      newGameButton.addEventListener('click', () => {
        clearValues();
        getRemoteData();
      });

      buttonGroup.appendChild(restartButton);
      buttonGroup.appendChild(newGameButton);

      endSection.appendChild(title);
      endSection.appendChild(correctText);
      endSection.appendChild(incorrectText);
      endSection.appendChild(buttonGroup);

      theGame.appendChild(endSection);
    }

    function clearValues() {
      theGame.innerHTML = '';
      gameOver = true;
      correctEntries = [];
      correctToWin = 0;
      incorrectEntries = [];
      timeLeft = 0;
      isChecked = false;
      isPaused = false;
    }

    getRemoteData();

    return () => {
      if (timer) clearInterval(timer);
      theGame.innerHTML = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-gray-900 rounded-lg shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
          <span className="text-gray-300 text-sm font-mono">
            Three-In-A-Row Game
          </span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div 
          ref={gameContainerRef}
          className="w-full h-[calc(90vh-48px)] p-8 overflow-y-auto flex flex-col items-center"
        />
      </div>
    </div>
  );
}
