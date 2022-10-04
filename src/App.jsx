import { useEffect, useState } from 'react'
import './App.css'
import Die from './Die'
import Message from './Message'
import Confetti from 'react-confetti'

function App() {
  const [tenzies, setTenzies] = useState(false)
  const [rolls, setRolls] = useState(0)
  const [dice, setDice] = useState(renderDice)

  const [isStopWatchActive, setIsStopWatchActive] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval = null;

    if (isStopWatchActive) {
      interval = setInterval(() => {
        setTime((time) => time + 10);
      }, 10);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isStopWatchActive]);

  function renderDice() {
    return [...Array(10)].map((num, i) => (
      {
        value: Math.ceil(Math.random() * 6),
        isHeld: false,
        id: i + 1
      }
    ))
  }

  function holdDice(id) {
    if (!tenzies) {
      setIsStopWatchActive(true)
      setDice(oldDice => oldDice
        .map(die => die.id === id ? { ...die, isHeld: !die.isHeld } : die))
    }
  }

  function handleClick() {
    const recordSeconds = localStorage.getItem('time');
    if (tenzies) {
      if (recordSeconds) {
        time < recordSeconds && localStorage.setItem('time', JSON.stringify(time))
      } else {
        localStorage.setItem('time', JSON.stringify(time))
      }
      setTenzies(false)
      setDice(renderDice)
      setTime(0)
      setRolls(0)
    } else {
      setRolls(prevRolls => prevRolls + 1)
      setDice((oldDice) => oldDice
        .map(die => !die.isHeld ? { ...die, value: Math.ceil(Math.random() * 6) } : die))
    }
  }
  useEffect(() => {
    if (dice.every(die => die.isHeld && die.value === dice[0].value)) {
      setTenzies(true)
      setIsStopWatchActive(false)
    }
  }, [dice])
  const diceEls = dice.map(die =>
    <Die key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  )
  const seconds = `${(Math.floor((time / 1000) % 60))}.${("0" + ((time / 10) % 100)).slice(-2)}`

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <Message time={time} tenzies={tenzies} rolls={rolls} seconds={seconds} />
      <div className="container">
        {diceEls}
      </div>
      <button onClick={handleClick}>{tenzies ? 'New game' : 'Roll'}</button>
      <span className='time'>🕒{seconds}</span>
    </main>
  )
}

export default App
