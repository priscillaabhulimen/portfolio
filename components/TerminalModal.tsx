'use client';

import { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import { BattleshipGame } from '@/lib/battleshipEngine';

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TerminalModal({ isOpen, onClose }: TerminalModalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const gameRef = useRef<BattleshipGame | null>(null);
  const inputBufferRef = useRef<string>('');
  const gameStateRef = useRef<'menu' | 'playing' | 'post-game'>('menu');

  useEffect(() => {
    if (!isOpen || !terminalRef.current) return;

    // Initialize terminal
    const term = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Courier New, monospace',
      theme: {
        background: '#1a1a1a',
        foreground: '#00ff00',
        cursor: '#00ff00',
        black: '#000000',
        red: '#ff0000',
        green: '#00ff00',
        yellow: '#ffff00',
        blue: '#0000ff',
        magenta: '#ff00ff',
        cyan: '#00ffff',
        white: '#ffffff',
      },
      rows: 30,
      cols: 80,
      convertEol: true,
      scrollback: 1000,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;
    gameRef.current = new BattleshipGame();

    // Start the game
    startGame();

    // Handle terminal input
    term.onData((data) => {
      handleInput(data);
    });

    // Handle window resize
    const handleResize = () => {
      fitAddon.fit();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
    };
  }, [isOpen]);

  const write = (text: string) => {
    if (xtermRef.current) {
      xtermRef.current.write(text);
    }
  };

  const writeLine = (text: string) => {
    write(text + '\r\n');
  };

  const writeColoredLine = (text: string, color: 'red' | 'green' | 'yellow' | 'blue' | 'cyan') => {
    const colors = {
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      cyan: '\x1b[36m',
    };
    const reset = '\x1b[0m';
    writeLine(colors[color] + text + reset);
  };

  const startGame = () => {
    if (!gameRef.current) return;
    
    const intro = gameRef.current.getIntroMessage();
    const lines = intro.split('\n');
    
    lines.forEach(line => {
      writeLine(line);
    });
    
    write('\n> ');
    gameStateRef.current = 'menu';
  };

  const handleInput = (data: string) => {
    const term = xtermRef.current;
    const game = gameRef.current;
    if (!term || !game) return;

    // Handle special keys
    if (data === '\r') {
      // Enter key
      term.write('\r\n');
      processCommand(inputBufferRef.current);
      inputBufferRef.current = '';
      return;
    } else if (data === '\x7f') {
      // Backspace
      if (inputBufferRef.current.length > 0) {
        inputBufferRef.current = inputBufferRef.current.slice(0, -1);
        term.write('\b \b');
      }
      return;
    } else if (data === '\x03') {
      // Ctrl+C
      return;
    }

    // Add character to buffer and echo it
    if (data >= String.fromCharCode(0x20) && data <= String.fromCharCode(0x7e)) {
      inputBufferRef.current += data;
      term.write(data);
    }
  };

  const processCommand = (input: string) => {
    const game = gameRef.current;
    if (!game) return;

    const state = gameStateRef.current;
    const trimmedInput = input.trim().toLowerCase();

    if (state === 'menu') {
      if (trimmedInput === 'yes' || trimmedInput === 'y') {
        game.startGame();
        writeLine('\nGreat! Welcome to the team.');
        writeLine('You start immediately\n');
        setTimeout(() => {
          showGameBoard();
          gameStateRef.current = 'playing';
        }, 500);
      } else if (trimmedInput === 'no' || trimmedInput === 'n') {
        writeLine('\nHow utterly disappointing.\n');
        setTimeout(() => onClose(), 2000);
      } else {
        writeLine('Please answer "yes" or "no"');
        write('> ');
      }
    } else if (state === 'playing') {
      const coords = game.parseCoordinates(input);
      
      if (!coords) {
        writeLine("What are you aiming at? Because that is definitely not on this map.");
        writeLine("Select a new target coordinate (e.g A4):");
        write('> ');
        return;
      }

      const result = game.processShot(coords.row, coords.column);
      
      if (result.type === 'duplicate') {
        writeLine(result.message);
        write('> ');
        return;
      }

      if (result.type === 'miss') {
        writeColoredLine(result.message, 'red');
      } else if (result.type === 'hit') {
        writeColoredLine(result.message, 'green');
      } else if (result.type === 'armored') {
        writeColoredLine(result.message, 'yellow');
      }

      const gameState = game.getState();
      
      if (gameState.isGameOver) {
        showGameBoard(true);
        
        if (gameState.hasWon) {
          writeColoredLine('YOU HIT ALL THE TARGETS! WINNER!!!!!!', 'green');
        } else {
          writeColoredLine('YOU RAN OUT OF MISSILES!', 'red');
        }
        
        writeLine(game.getStats());
        writeLine('\nWould you like to play again?');
        writeLine('1. Yes');
        writeLine('2. No');
        write('\n<Yes or No> [1, 2]: ');
        gameStateRef.current = 'post-game';
      } else {
        showGameBoard();
      }
    } else if (state === 'post-game') {
      if (trimmedInput === '1' || trimmedInput === 'yes' || trimmedInput === 'y') {
        game.resetGame(true);
        writeLine('\n');
        startGame();
      } else if (trimmedInput === '2' || trimmedInput === 'no' || trimmedInput === 'n') {
        writeLine('\nWell, at least you tried.\n');
        setTimeout(() => onClose(), 2000);
      } else {
        writeLine('Please enter 1 (Yes) or 2 (No)');
        write('<Yes or No> [1, 2]: ');
      }
    }
  };

  const showGameBoard = (endGame = false) => {
    const game = gameRef.current;
    if (!game) return;

    const grid = game.buildGrid(endGame);
    const state = game.getState();

    // Split grid into lines and write each line separately
    const gridLines = grid.split('\n');
    writeLine('');
    gridLines.forEach(line => {
      if (line.trim()) {
        write(line + '\r\n');
      }
    });
    
    if (!endGame) {
      writeColoredLine(`X Targets Missed: ${state.firedMap.size - (state.allTargetsCount - state.targetsToWin)}`, 'red');
      writeColoredLine(`O Targets Hit:    ${state.allTargetsCount - state.targetsToWin}`, 'green');
      writeColoredLine(`- Targets Left:   ${state.targetsToWin}`, 'blue');
      writeColoredLine(`- Armored Targets: ${state.armoredTargetCount}`, 'yellow');
      writeLine('');
      writeLine('Select a new target coordinate (e.g A4):');
      write('> ');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
      <div className="relative w-full max-w-4xl h-[600px] bg-gray-900 rounded-lg shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-4 text-gray-300 text-sm font-mono">
              Battleship Terminal
            </span>
          </div>
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
        <div ref={terminalRef} className="w-full h-[calc(100%-48px)] p-2"></div>
      </div>
    </div>
  );
}
