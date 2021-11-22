/****************************************************************************
  FileName      [ Dashnoard.js ]
  PackageName   [ src/components ]
  Author        [ Cheng-Hua Lu, Chin-Yi Cheng ]
  Synopsis      [ This file generates the Dashboard. ]
  Copyright     [ 2021 10 ]
****************************************************************************/

import React, { useEffect, useState } from 'react';
import "./css/Dashboard.css"
let timeIntervalId;

export default function Dashboard({remainFlagNum, gameOver}){
    let [time, setTime] = useState(0);
    let [sTime, setSTime] = useState(0);

    {/* -- TODO 7 -- */}
    {/* Useful Hint: Try to understand the difference between time and sTime. */}

    useEffect(() => {
        let interval = null;
        if (!gameOver) {
            setSTime(time);
            interval = setInterval(() => {
                setTime(x => x + 1);
            }, 1000);
        } else if (gameOver && time !== 0) {
            setSTime(time);
            setTime(0);
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [gameOver, time]);

    useEffect(() => {
      
    }, []);


    return (
        <div className = "dashBoard" >
            <div id = 'dashBoard_col1' >
                <div className = 'dashBoard_col'>
                    <p className = 'icon'>🚩</p>
                    {remainFlagNum}
                </div>
            </div>
            <div id = 'dashBoard_col2' >
                <div className = 'dashBoard_col'>
                    <p className = 'icon'>⏰</p>
                    {gameOver ? sTime : time}
                </div>
            </div>
        </div>
    );
}
