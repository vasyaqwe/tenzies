import { useEffect, useState } from 'react'
import './App.css'
import Die from './Die'
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
    setIsStopWatchActive(true)
    setDice(oldDice => oldDice
      .map(die => die.id === id ? { ...die, isHeld: !die.isHeld } : die))
  }

  function handleClick() {
    if (tenzies) {
      localStorage.setItem('time', JSON.stringify(time))
      setTenzies(false)
      setDice(renderDice)
      setTime(0)
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
  const formattedTime = `${(Math.floor((time / 1000) % 60))}.${("0" + ((time / 10) % 100)).slice(-2)}`
  const recordTime = JSON.parse(localStorage.getItem('time'))

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      {tenzies ? <p className='instructions'>
        With {rolls} rolls, you are victorious! <br />
        {time < recordTime ? `You beat your last record, winning in just ${formattedTime} seconds!` :
          `It took you ${formattedTime} seconds to win!`}
      </p> : <p className='instructions'>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>}
      <div className="container">
        {diceEls}
      </div>
      <button onClick={handleClick}>{tenzies ? 'New game' : 'Roll'}</button>
    </main>
  )
}

export default App
