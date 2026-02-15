'use client';

import { useEffect, useRef, useState } from 'react';

interface ThreeInARowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ThreeInARowModal({ isOpen, onClose }: ThreeInARowModalProps) {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    
    // Wait for React to render the div with the ref
    const initGame = async () => {
      // Small delay to ensure ref is attached
      await new Promise(resolve => setTimeout(resolve, 0));
      
      if (!gameContainerRef.current) {
        return;
      }
      
      setIsLoading(true);

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

      const gameActionSection = document.createElement('section');

    async function getRemoteData() {
      const url = 'https://prog2700.onrender.com/threeinarow/random';

      theGame.replaceChildren();

      try {
        
        // Race between fetch and timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          controller.abort();
        }, 15000);
        
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        resp = await response.json();

        setIsLoading(false);
        drawTable();
      } catch (error: any) {
        
        setIsLoading(false);
        
        const errorContainer = document.createElement('div');
        errorContainer.className = 'flex flex-col items-center gap-4 text-center';
        
        const errorMessage = document.createElement('h1');
        errorMessage.className = 'text-red-500 text-xl font-bold';
        
        if (error.name === 'AbortError') {
          errorMessage.innerText = 'Request timed out. The server is taking too long to respond.';
        } else {
          errorMessage.innerText = error.message || 'Failed to load game';
        }
        
        const retryButton = document.createElement('button');
        retryButton.className = 'mt-4 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-all duration-300';
        retryButton.innerText = 'Try Again';
        retryButton.addEventListener('click', () => {
          setIsLoading(true);
          getRemoteData();
        });
        
        errorContainer.appendChild(errorMessage);
        errorContainer.appendChild(retryButton);
        theGame.appendChild(errorContainer);
      }
    }

    function drawTable() {

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
      newTableCell.className = 'w-10 h-10 md:w-12 md:h-12 border border-white/20 cursor-pointer transition-all duration-200';

      const currentState = currentCell.currentState;
      
      // Set initial state
      if (currentState == 0) {
        newTableCell.classList.add('bg-[#FFE4B5]'); // unclicked (moccasin)
      }

      if (!currentCell.canToggle) {
        if (currentState == 1) {
          newTableCell.classList.add('bg-blue-500'); // filled
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

      if (!entry.canToggle) return;

      const classAttribute = element.getAttribute('class') || '';

      // Tri-state cycle: unclicked -> filled -> empty (no class) -> unclicked
      if (classAttribute.includes('bg-blue-500')) {
        // filled -> empty (no class)
        element.className = 'w-10 h-10 md:w-12 md:h-12 border border-white/20 cursor-pointer transition-all duration-200';
        addToAppropriateList(entry, 2, coordinates);
      } else if (classAttribute.includes('bg-[#FFE4B5]')) {
        // unclicked -> filled
        element.className = 'w-10 h-10 md:w-12 md:h-12 border border-white/20 cursor-pointer transition-all duration-200 bg-blue-500';
        addToAppropriateList(entry, 1, coordinates);
      } else {
        // empty -> unclicked
        element.className = 'w-10 h-10 md:w-12 md:h-12 border border-white/20 cursor-pointer transition-all duration-200 bg-[#FFE4B5]';
        addToAppropriateList(entry, 0, coordinates);
      }
    }

    function addToAppropriateList(cellEntry: any, state: number, coordinates: string) {
      const entry = { ...cellEntry, coordinates };

      const includedInCorrect = correctEntries.some(e => e.coordinates === coordinates);
      const includedInIncorrect = incorrectEntries.some(e => e.coordinates === coordinates);

      if (state == 0) {
        // Remove from both lists when empty
        correctEntries = correctEntries.filter(e => e.coordinates !== coordinates);
        incorrectEntries = incorrectEntries.filter(e => e.coordinates !== coordinates);
      } else if (entry.correctState == state) {
        // Correct state
        incorrectEntries = incorrectEntries.filter(e => e.coordinates !== coordinates);
        if (!includedInCorrect) correctEntries.push(entry);
      } else {
        // Incorrect state
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
      gameActionSection.className = 'flex flex-col items-center gap-4 mt-6';

      const timerText = document.createElement('h1');
      timerText.className = 'text-2xl font-bold text-white';
      timerText.id = 'timer-text';
      updateTimerDisplay();

      const statusText = document.createElement('h3');
      statusText.id = 'status-text';
      statusText.className = 'text-yellow-400 h-6';

      const buttonGroup = document.createElement('div');
      buttonGroup.className = 'flex flex-col gap-3 md:flex-row items-center';

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

      gameActionSection.appendChild(timerText);
      gameActionSection.appendChild(statusText);
      gameActionSection.appendChild(buttonGroup);
      theGame.appendChild(gameActionSection);

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
        const classes = cell.className;
        // Reset to appropriate state color
        if (classes.includes('bg-blue-500')) {
          (cell as HTMLElement).style.backgroundColor = ''; // blue from class
        } else if (classes.includes('bg-[#FFE4B5]')) {
          (cell as HTMLElement).style.backgroundColor = ''; // moccasin from class
        } else {
          (cell as HTMLElement).style.backgroundColor = ''; // empty/transparent
        }
      });

      if (checked) {
        incorrectEntries.forEach(entry => {
          const cell = document.querySelector(`#${entry.coordinates}`) as HTMLElement;
          if (cell) cell.style.backgroundColor = '#ef4444'; // red for incorrect
        });
      }
    }

    function endGamePlay(isTimeUp = false) {
      gameOver = true;
      clearInterval(timer);
      updateHintColors(false);


      gameActionSection.replaceChildren();
      gameActionSection.className = 'flex flex-col items-center gap-4 mt-6';

      const title = document.createElement('h1');
      title.className = 'text-3xl md:text-4xl font-bold';
      title.innerText = isTimeUp ? "Time's up. You Lose!!" : 'YOU WIN!';
      title.style.color = isTimeUp ? '#ef4444' : '#22c55e';

      const correctText = document.createElement('p');
      correctText.className = 'text-white text-lg';
      correctText.innerText = `Correct Boxes: ${correctEntries.length}`;

      const incorrectText = document.createElement('p');
      incorrectText.className = 'text-white text-lg';
      incorrectText.innerText = `Incorrect Boxes: ${correctToWin - correctEntries.length}`;

      const buttonGroup = document.createElement('div');
      buttonGroup.className = 'flex flex-col md:flex-row gap-3 mt-4';

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

      gameActionSection.appendChild(title);
      gameActionSection.appendChild(correctText);
      gameActionSection.appendChild(incorrectText);
      gameActionSection.appendChild(buttonGroup);

      theGame.appendChild(gameActionSection);
    }

    function clearValues() {
      gameOver = true;
      correctEntries = [];
      correctToWin = 0;
      incorrectEntries = [];
      timeLeft = 0;
      isChecked = false;
      isPaused = false;
      gameActionSection.replaceChildren();
      theGame.replaceChildren();
    }

    getRemoteData();

    return () => {
      if (timer) clearInterval(timer);
      theGame.replaceChildren();
    };
    };

    initGame();

    return () => {
      // Cleanup will be handled by initGame's return
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
        className='w-full h-[calc(90vh-48px)] p-4 md:p-8 overflow-y-auto flex flex-col items-center'
        >
          {isLoading ? (
            <div className="w-full h-[calc(90vh-48px)] flex flex-col items-center justify-center gap-6">
              <div className="relative w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 animate-loading-sweep" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-white text-lg animate-pulse">Loading game...</p>
                <p className="text-gray-400 text-sm">This may take 10-15 seconds</p>
              </div>
            </div>
          ) : (
          
            <div 
              className=""
            />
            
          )}
        </div>
      </div>
      <style jsx>{`
        @keyframes loading-sweep {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-loading-sweep {
          animation: loading-sweep 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}