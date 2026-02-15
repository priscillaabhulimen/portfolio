// Battleship game engine adapted for web terminal
import { mapData } from './mapData';

export interface GameState {
  missilesLeft: number;
  targetsToWin: number;
  gameIndex: number;
  allTargetsCount: number;
  armoredTargetCount: number;
  mapRows: number[][];
  firedMap: Map<string, FiredEntry>;
  isGameOver: boolean;
  hasWon: boolean;
  gameStarted: boolean;
}

interface FiredEntry {
  type: 'miss' | 'hit' | 'armored';
  before: number;
  after: number;
}

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export class BattleshipGame {
  private state: GameState;
  private width: number;
  private height: number;

  constructor() {
    this.state = this.initializeGame();
    const dimensions = this.getMapDimension();
    this.width = dimensions.width;
    this.height = dimensions.height;
  }

  private initializeGame(): GameState {
    const gameIndex = Math.floor(Math.random() * mapData.length);
    const mapValue = mapData[gameIndex].grid;
    const missilesLeft = mapData[gameIndex].missile_allowance;

    return {
      missilesLeft,
      targetsToWin: 0,
      gameIndex,
      allTargetsCount: 0,
      armoredTargetCount: 0,
      mapRows: mapValue,
      firedMap: new Map(),
      isGameOver: false,
      hasWon: false,
      gameStarted: false,
    };
  }

  private getMapDimension() {
    let colLength = 0;
    let targetsToWin = 0;
    let allTargetsCount = 0;
    let armoredTargetCount = 0;

    for (let row = 0; row < this.state.mapRows.length; row++) {
      const cells = this.state.mapRows[row];
      for (let col = 0; col < cells.length; col++) {
        const val = cells[col];
        if (!isNaN(val) && val > 0) {
          targetsToWin += 1;
          allTargetsCount += 1;

          if (val > 1) {
            armoredTargetCount += 1;
          }
        }
      }
      let l = cells.length;
      if (l > colLength) {
        colLength = l;
      }
    }

    this.state.targetsToWin = targetsToWin;
    this.state.allTargetsCount = allTargetsCount;
    this.state.armoredTargetCount = armoredTargetCount;

    return {
      width: colLength + 2,
      height: this.state.mapRows.length + 2,
    };
  }

  private getCurrentTargetValue(row: number, column: number): number {
    const n = this.state.mapRows[row - 1][column - 1];
    return isNaN(n) ? 0 : n;
  }

  private isFiredCoordinate(row: number, column: number): boolean {
    return this.state.firedMap.has(`${row},${column}`);
  }

  public buildGrid(endGame = false): string {
    let board = '';
    for (let row = 0; row < this.height; row++) {
      for (let column = 0; column < this.width; column++) {
        let entry = '';

        if (column === this.width - 1) {
          entry = '  ';
        } else if (row === this.height - 1) {
          entry = '   ';
        } else if (row === 0) {
          if (column === 0) {
            entry = '   ';
          } else {
            entry = ` ${LETTERS[column - 1]} `;
          }
        } else {
          if (column === 0) {
            entry = row.toString().padEnd(3, ' ');
          } else {
            entry = this.fillInFireArea(row, column, endGame);
          }
        }

        board += entry;
      }
      board += '\n';
    }
    return board;
  }

  private fillInFireArea(row: number, column: number, endGame = false): string {
    let key = `${row},${column}`;
    const unprocessedValue = this.getCurrentTargetValue(row, column);

    if (!this.isFiredCoordinate(row, column)) {
      if (unprocessedValue > 0 && endGame) {
        return ' - ';
      }
      return '   ';
    }

    let firedEntry = this.state.firedMap.get(key);
    if (!firedEntry) {
      return ' X ';
    }

    if (firedEntry.type === 'miss') {
      return ' X ';
    } else if (firedEntry.type === 'hit') {
      return ' O ';
    } else if (firedEntry.type === 'armored') {
      return ' - ';
    } else {
      return ' X ';
    }
  }

  public parseCoordinates(input: string): { row: number; column: number } | null {
    const maxLetterIndex = this.width - 2;
    const maxNumber = this.height - 2;

    const match = input.trim().match(/^([A-Za-z]+)(\d+)$/);

    if (!match) {
      return null;
    }

    const [, letterPart, numberPart] = match;
    const letter = letterPart.toUpperCase();
    const number = parseInt(numberPart);

    const colIndex = LETTERS.indexOf(letter);
    const isInvalidLetter = colIndex < 0 || colIndex > maxLetterIndex - 1;
    const isInvalidNumber = number < 1 || number > maxNumber;

    if (isInvalidLetter || isInvalidNumber) {
      return null;
    }

    return { row: number, column: colIndex + 1 };
  }

  private isDuplicateShot(row: number, column: number): boolean {
    let isFired = this.isFiredCoordinate(row, column);
    let key = `${row},${column}`;

    if (isFired) {
      const currentShot = this.state.firedMap.get(key);
      if (currentShot && currentShot.type === 'armored') {
        isFired = false;
      }
    }

    return isFired;
  }

  public processShot(row: number, column: number): {
    success: boolean;
    message: string;
    type: 'miss' | 'hit' | 'armored' | 'duplicate' | 'invalid';
  } {
    if (this.isDuplicateShot(row, column)) {
      return {
        success: false,
        message: "Let's not waste military resources. Try firing somewhere else.",
        type: 'duplicate',
      };
    }

    let currentTargetShot = this.getCurrentTargetValue(row, column);
    const key = `${row},${column}`;

    this.state.missilesLeft -= 1;

    if (currentTargetShot > 0) {
      const result = this.getHitType(row, column, currentTargetShot);
      this.state.firedMap.set(key, {
        type: result.type,
        before: currentTargetShot,
        after: this.getCurrentTargetValue(row, column),
      });
      
      if (this.state.targetsToWin === 0) {
        this.state.isGameOver = true;
        this.state.hasWon = true;
      } else if (this.state.missilesLeft === 0) {
        this.state.isGameOver = true;
        this.state.hasWon = false;
      }
      
      return result;
    } else {
      this.state.firedMap.set(key, { type: 'miss', before: 0, after: 0 });
      
      if (this.state.missilesLeft === 0) {
        this.state.isGameOver = true;
        this.state.hasWon = false;
      }
      
      return {
        success: true,
        message: '\nMISS!!!',
        type: 'miss',
      };
    }
  }

  private getHitType(
    row: number,
    column: number,
    currentTargetShot: number
  ): { success: boolean; message: string; type: 'hit' | 'armored' } {
    let type: 'hit' | 'armored' = 'hit';
    let message = '';

    if (currentTargetShot === 1) {
      message = '\nHIT!!!\n';
      this.state.targetsToWin -= 1;
    } else {
      type = 'armored';
      if (!this.isFiredCoordinate(row, column)) {
        message = '\nARMORED TARGET HIT!\n';
      } else {
        message = '\nANOTHER HIT!\n';
      }
      message += `You need ${currentTargetShot - 1} more shot${
        currentTargetShot - 1 === 1 ? '' : 's'
      } to sink this target\n`;
    }

    this.state.mapRows[row - 1][column - 1] = currentTargetShot - 1;

    return { success: true, message, type };
  }

  public getState(): GameState {
    return { ...this.state };
  }

  public getIntroMessage(): string {
    return `*************************************************************
                BATTLESHIP  *  JAVASCRIPT
*************************************************************
Congratulations! General Lee has selected YOU to man our new,
state of the art missile launching system.

Our sources tell us that there are ${this.state.targetsToWin} enemy targets
approaching. We have ${this.state.missilesLeft} left in our inventory.

Your job, should you wish to accept it, is to sink ALL
enemy targets before we run out of missiles.

Will you accept this mission? (yes/no)`;
  }

  public startGame() {
    this.state.gameStarted = true;
  }

  public getStats(): string {
    const targetsHit = this.state.allTargetsCount - this.state.targetsToWin;
    const missedShots = this.state.firedMap.size - targetsHit;

    return `
Targets Hit:     ${targetsHit}
Targets Missed:  ${missedShots}
Targets Left:    ${this.state.targetsToWin}
Armored Targets: ${this.state.armoredTargetCount}
`;
  }

  public resetGame(newMission = false) {
    if (newMission) {
      this.state = this.initializeGame();
    } else {
      const gameIndex = this.state.gameIndex;
      const mapValue = mapData[gameIndex].grid;
      const missilesLeft = mapData[gameIndex].missile_allowance;
      
      this.state = {
        missilesLeft,
        targetsToWin: 0,
        gameIndex,
        allTargetsCount: 0,
        armoredTargetCount: 0,
        mapRows: JSON.parse(JSON.stringify(mapValue)),
        firedMap: new Map(),
        isGameOver: false,
        hasWon: false,
        gameStarted: false,
      };
    }
    
    const dimensions = this.getMapDimension();
    this.width = dimensions.width;
    this.height = dimensions.height;
  }
}
