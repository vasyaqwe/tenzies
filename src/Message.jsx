import { useState } from 'react'
import './App.css'

export default function Message({ time, tenzies, rolls, seconds }) {
    const recordTime = JSON.parse(localStorage.getItem('time'))

    return (
        tenzies ? <p className='message'>
            With {rolls} {rolls === 1 ? '🎲roll' : '🎲rolls'}, you are victorious! <br />
            {time < recordTime && `🏆You beat your last record, winning in just ${seconds} seconds!`}
        </p> : <p className='message'>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
    )
}
