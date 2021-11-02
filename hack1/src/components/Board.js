/****************************************************************************
  FileName      [ Board.js ]
  PackageName   [ src/components ]
  Author        [ Cheng-Hua Lu, Chin-Yi Cheng ]
  Synopsis      [ This file generates the Board. ]
  Copyright     [ 2021 10 ]
****************************************************************************/

import React, { useEffect, useState } from 'react';
import Cell from './Cell';
import Modal from './Modal';
import Dashboard from './Dashboard';
import createBoard from '../util/createBoard';
import { revealed } from '../util/reveal';
import './css/Board.css'


const Board = ({ boardSize, mineNum, backToHome }) => {
    const [board, setBoard] = useState([]);                     // An 2-dimentional array. It is used to store the board.
    const [nonMineCount, setNonMineCount] = useState(0);        // An integer variable to store the number of cells whose value are not '💣'.
    const [mineLocations, setMineLocations] = useState([]);     // An array to store all the coordinate of '💣'.
    const [gameOver, setGameOver] = useState(false);            // A boolean variable. If true, means you lose the game (Game over).
    const [remainFlagNum, setRemainFlagNum] = useState(0);      // An integer variable to store the number of remain flags.
    const [win, setWin] = useState(false);                      // A boolean variable. If true, means that you win the game.

    useEffect(() => {
        // Calling the function
        freshBoard();
    }, []);

    // Creating a board
    const freshBoard = () => {
        {/* -- TODO 3-1 -- */}
        {/* Useful Hint: createBoard(...) */}
        setNonMineCount(0);
        setGameOver(false);
        setWin(false);
        const obj = createBoard(boardSize, mineNum);
        setBoard(obj.board);
        setMineLocations(obj.mineLocations);
        setRemainFlagNum(obj.mineLocations.length);
    }

    const restartGame = () => {
        {/* -- TODO 5-2 -- */}
        {/* Useful Hint: freshBoard() */}
        freshBoard();
    }

    // On Right Click / Flag Cell
    const updateFlag = (e, x, y) => {
        // To not have a dropdown on right click
        e.preventDefault();
        // Deep copy of a state
        {/* -- TODO 3-2 -- */}
        {/* Useful Hint: A cell is going to be flagged. 'x' and 'y' are the xy-coordinate of the cell. */}
        {/* Reminder: If the cell is already flagged, you should unflagged it. Also remember to update the board and the remainFlagNum. */}
        {/* Reminder: The cell can be flagged only when it is not revealed. */}
        if (board[x][y].revealed || remainFlagNum === 0) return;
        if (board[x][y].flagged) {
            board[x][y].flagged = false;
            setRemainFlagNum(t => t + 1);
        }
        else {
            board[x][y].flagged = true;
            setRemainFlagNum(t => t - 1);
        }
        setBoard(board);
    };

    const revealCell = (x, y) => {
        {/* -- TODO 4-1 -- */}
        {/* Reveal the cell */}
        {/* Useful Hint: The function in reveal.js may be useful. 
            You should consider if the cell you want to reveal is a location of mines or not. */}
        {/* Reminder: Also remember to handle the condition that after 
            you reveal this cell then you win the game. */}
        if (board[x][y].revealed || board[x][y].flagged) return;
        if (gameOver || win) return;
        let cnt = 0;

        if (board[x][y].value === '💣') {
            board[x][y].revealed = true;
            setGameOver(true);
            mineLocations.map(obj => { board[obj[0]][obj[1]].revealed = true; });
            console.log("GAME OVER GAME OVER GAME OVER");
        }

        if (board[x][y].value !== 0) {
            board[x][y].revealed = true;
            cnt += 1;
        }

        if (board[x][y].value === 0) {
            let queue = [];
            queue.push([x, y]);
            board[x][y].revealed = true;
            cnt += 1;
            while (queue.length > 0) {
                let cur = queue.pop();
                let x = cur[0], y = cur[1];
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        if (i == 0 && j == 0) continue;
                        let X = x + i, Y = y + j;
                        if (X < 0 || X >= boardSize || Y < 0 || Y >= boardSize) continue;

                        if (board[X][Y].revealed || board[X][Y].flagged) continue;
                        if (board[X][Y].value === '💣') continue;

                        board[X][Y].revealed = true;
                        cnt += 1;
                        if (board[X][Y].value === 0) {
                            queue.push([X, Y]);
                        }
                    }
                }
            }
        }

        if (nonMineCount + cnt === boardSize*boardSize - mineNum) {
            setWin(true);
            console.log("WIN WIN WIN");
        }

        setBoard(board);
        setNonMineCount(x => x + cnt);
    };

    return(
        <div className = 'boardPage' >
            <div className = 'boardWrapper' >
                {/* -- TODO 3-1 -- */}
                {/* Useful Hint: The board is composed of BOARDSIZE*BOARDSIZE of Cell (2-dimention). 
                    So, nested 'map' is needed to implement the board.  */}
                {/* Reminder: Remember to use the component <Cell> and <Dashboard>. 
                    See Cell.js and Dashboard.js for detailed information. */}
                <div className="boardContainer">
                    <Dashboard remainFlagNum={remainFlagNum} gameOver={gameOver} />
                    {
                        board.map((x, idx) => {
                            return <div id={`row${idx}`} style={{display:"flex"}}>
                                {
                                    x.map((y, idy) => {
                                    return <Cell id={`{idx}-{idy}`} rowIdx={idx} colIdx={idy} detail={y} 
                                        updateFlag={updateFlag} revealCell={revealCell} />;
                                    })
                                }
                            </div>;
                        })
                    }
                </div>
                {(win || gameOver) && <Modal restartGame={restartGame} backToHome={backToHome} win={win}  />}
            </div>
        </div>
    ); 

    

}

export default Board