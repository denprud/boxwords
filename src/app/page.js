'use client';

import Image from 'next/image'
import styles from './page.module.css'
import Row from './components/Row'
import Board from './components/Board'
import Modal from './components/Modal'
import { useEffect, useState } from 'react'



export default function Home() {

  const [gameCompleted, setGameCompleted] = useState(false);
  const [wordset, setWordset] = useState([
    {word: Array(5).fill(""), index: 0},{word: Array(5).fill(""), index: 0},{word: Array(5).fill(""), index: 0},{word: Array(5).fill(""), index: 0}
  ])
  const [numberOfTries, setNumberOfTries] = useState(0);



//Empties the board and updates tries once the array game is completed
  useEffect(() => {
    setWordset([
      {word: Array(5).fill(""), index: 0},{word: Array(5).fill(""), index: 0},{word: Array(5).fill(""), index: 0},{word: Array(5).fill(""), index: 0}
    ])
    
    if (gameCompleted === true){      
      setNumberOfTries(()=>numberOfTries+1)
    }
  }, [gameCompleted]);



  
  


  return (
    <>
      <div className='interface'>
        <h1>Box Words</h1>
      </div>
      <div className="line">
        <hr />
      </div>
      <Board gameCompleted = {gameCompleted} setGameCompleted={setGameCompleted} wordset={wordset} setWordset={setWordset}  />
      {gameCompleted && <Modal setOpenModal={setGameCompleted} numberOfTries={numberOfTries}/>}
    </>
  )
}
