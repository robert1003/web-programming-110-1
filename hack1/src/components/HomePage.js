/****************************************************************************
  FileName      [ HomePage.js ]
  PackageName   [ src/components ]
  Author        [ Cheng-Hua Lu, Chin-Yi Cheng ]
  Synopsis      [ This file generates the Home page.  ]
  Copyright     [ 2021 10 ]
****************************************************************************/

import React, { useState } from 'react';
import './css/HomePage.css';

{/* -- TODO 2 -- */}
const HomePage = ({startGameOnClick, mineNumOnChange, boardSizeOnChange, mineNum, boardSize /* -- something more... -- */}) => {
    const [showPanel, setShowPanel] = useState(false);      // A boolean variable. If true, the controlPanel will show.
    const [error, setError] = useState(false);              // A boolean variable. If true, means that the numbers of mines and the board size are invalid to build a game.

    {/* Some functions may be added here! */}
    
    const checkVal = () => {
      const mineNum = document.getElementById('mine-num').value;
      const boardSize = document.getElementById('board-size').value;

      mineNumOnChange(mineNum);
      boardSizeOnChange(boardSize);
      
      if (mineNum > boardSize * boardSize) {
        setError(true);
        document.getElementById('mine-num-show').style.color = "#880000";
        document.getElementById('board-size-show').style.color = "#880000";
      }
      else {
        setError(false);
        document.getElementById('mine-num-show').style.color = "#0f0f4b";
        document.getElementById('board-size-show').style.color = "#0f0f4b";
      }

      document.getElementById('mine-num-show').textContent = mineNum;
      document.getElementById('board-size-show').textContent = boardSize;
    }

    return(
      <div className = 'HomeWrapper'>
          <p className = 'title'>MineSweeper</p>
          {/* -- TODO 1-1 -- */}
          <button className="btn" onClick={startGameOnClick}>Start Game</button>
          
          {/* -- TODO 6-2 -- */}
          {/* Useful Hint: <input type = 'range' min = '...' max = '...' defaultValue = '...'> */}
          {/* Useful Hint: Error color: '#880000', default text color: '#0f0f4b', invisible color: 'transparent' */}
          {/* Reminder: The defaultValue of 'mineNum' is 10, and the defaultValue of 'boardSize' is 8. */}
        
          <div className="controlContainer">
            <button className="btn" onClick={() => setShowPanel(x => !x)}>Difficulty Adjustment</button>
            {
              showPanel &&
              <div className="controlWrapper">
                {
                  error && 
                  <div id="mine-error" className="error" style={{ color: "#880000" }}>
                    ERROR: Mines number and board size are invalid!
                  </div>
                }
                <div className="controlPanel">
                  <div className="controlCol">
                    <p className="controlTitle">Mine Number</p>
                    <input id="mine-num" type="range" step="1" min="1" max="50" defaultValue="10" onChange={checkVal} />
                    <p id="mine-num-show" className="controlNum">10</p>
                  </div>
                  <div className="controlCol">
                    <p className="controlTitle">Board Size (nxn)</p>
                    <input id="board-size" type="range" step="1" min="1" max="20" defaultValue="8" onChange={checkVal} />
                    <p id="board-size-show" className="controlNum">8</p>
                  </div>
                </div>
              </div>
            }
          </div>    
      </div>
    );

}
export default HomePage;   
