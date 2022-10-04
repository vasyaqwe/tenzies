import { useState } from 'react'
import './App.css'

export default function Die({ value, isHeld, holdDice }) {
    const dotEls = [...Array(value)].map((dot, i) => <div key={i} className="dot"></div>)

    return (
        <div onClick={holdDice} style={{ backgroundColor: isHeld ? '#59E391' : 'white' }} className={`die die${value}`}>
            {dotEls}
        </div>
    )
}
