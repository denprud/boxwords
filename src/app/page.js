'use client';

import Image from 'next/image'
import styles from './page.module.css'
import Row from './components/Row'
import Board from './components/Board'
import Modal from './components/Modal'
import Tutorial from './components/Tutorial';
import { useEffect, useState } from 'react'




export default function Home() {

  const [gameCompleted, setGameCompleted] = useState(false);
  const [wordset, setWordset] = useState([
    {word: Array(5).fill(""), index: 0},{word: Array(5).fill(""), index: 0},{word: Array(5).fill(""), index: 0},{word: Array(5).fill(""), index: 0}
  ])
  const [numberOfTries, setNumberOfTries] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false)
  const [rarity, setRarity] = useState(0);
  const [maxRarity, setMaxRarity] = useState(0);
  
//Empties the board and updates tries once the array game is completed
  useEffect(() => {
    setWordset([
      {word: Array(5).fill(""), index: 0},{word: Array(5).fill(""), index: 0},{word: Array(5).fill(""), index: 0},{word: Array(5).fill(""), index: 0}
    ])
    
    if (gameCompleted === true){      
      setNumberOfTries(()=>numberOfTries+1)
    }
  }, [gameCompleted]);

//Sets the maxRarity
  useEffect(() => {
      if (maxRarity < rarity){
        setMaxRarity(rarity)
      }
  }, [rarity]);



  
  


  return (
    <>
      <div className='interface'>
        <h1>Box Words</h1>
        <div >
          <hr/>
        </div>
      </div>
      <Board gameCompleted = {gameCompleted} setGameCompleted={setGameCompleted} wordset={wordset} setWordset={setWordset} rarity={rarity} setRarity={setRarity} />
      {gameCompleted && <Modal setOpenModal={setGameCompleted} numberOfTries={numberOfTries} rarity={rarity} maxRarity={maxRarity}/>}
      {showTutorial && <Tutorial setShowTutorial={setShowTutorial}/>}
      <button className="button" onClick={() =>{setShowTutorial(true)}}>Rules</button>
    </>
  )
}
