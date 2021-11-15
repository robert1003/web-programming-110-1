import { useState } from 'react';
import './App.css';
import { guess, startGame, restart } from './axios';

function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [number, setNumber] = useState('');
  const [status, setStatus] = useState('');

  const _startGame = async () => {
    const res = await startGame();
    if (res.status !== 200) {
      alert(res.msg);
      return;
    }
    setHasStarted(true);
  }
  const startMenu = (
    <div>
      <button onClick={_startGame}>start game</button>
    </div>
  );

  const handleGuess = async () => {
    const res = await guess(number);
    if (res.status === 503) {
      alert(res.msg);
      return;
    }

    if (res.status === 406) {
      alert(`Error: "${number}" is not a valid number (1 - 100)`);
    }
    else if (res.msg === 'Equal') setHasWon(true);
    else {
      setStatus(res.msg);
      alert(`${res.msg}`);
    }
  }
  const gameMode = (
    <>
      <p>Guess a number between 1 to 100</p>
      <input onChange={(e)=>{setNumber(e.target.value)}}></input>
      <button onClick={handleGuess} disabled={!number}>guess!</button>
      <p>{status}</p>
    </>
  );

  const _restart = async () => {
    const res = await restart();
    if (res.status !== 200) {
      alert(res.msg);
      return;
    }
    setHasWon(false);
    setStatus("");
  }
  const winningMode = (
    <>
      <p>you won! the number was {number}.</p>
      <button onClick={_restart}>restart</button>
    </>
  );

  const game = (
    <div>
      {hasWon ? winningMode : gameMode}
    </div>
  );

  return (
    <div className="App">
      {hasStarted ? game : startMenu}
    </div>
  );
}

export default App;
