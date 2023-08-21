'use client';

import React, { useEffect, useRef } from 'react'
import Row from './Row'
import { useState } from 'react'
import useOutsideAlerter from '../hooks/useOutsideAlerter';
import PropTypes from "prop-types";




export default function Board(){
  
  const [wordset, setWordset] = useState([
    {word: Array(5).fill(""), index: 0},{word: Array(5).fill(""), index: 0},{word: Array(5).fill(""), index: 0},{word: Array(5).fill(""), index: 0}
  ])
  const wrapperRef = useRef(null);
  const [isSelecting, setIsSelecting] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);
  useOutsideAlerter(wrapperRef, isSelecting,()=>{
    setSelectedRow(null)
    setIsSelecting(!isSelecting);
  });


  useEffect(() => {
    window.addEventListener('keyup', handleKeyup)
    return () => window.removeEventListener('keyup', handleKeyup)
  }, [handleKeyup])

  function handleKeyup(key){
    if (selectedRow === null || isSelecting) return;

    var newWordSet = wordset.slice();
    

    if (/^[A-Za-z]$/.test(key.key)) {
      if (wordset[selectedRow].word.includes("")){
        //newWordSet[selectedRow].word = newWordSet[selectedRow].word + key.key
        
        newWordSet = fixBoard(newWordSet, "append", key)
        console.log(newWordSet)
        setWordset(newWordSet)
      }
    }

    else if (key.key === 'Backspace') {
      ///newWordSet[selectedRow].word = newWordSet[selectedRow].word.slice(0, -1)
      newWordSet = fixBoard(newWordSet, "delete", key)
      setWordset(newWordSet)
    }
  }

  function fixBoard(newWordSet, type, key){
    const index = newWordSet[selectedRow].index
    switch(selectedRow){
        case 0:
          if(newWordSet[selectedRow].index  === 0){
            if(type === "append"){
              newWordSet[selectedRow].word[index] =  key.key
              newWordSet[1].word[0] = key.key
              newWordSet[selectedRow].index = findEmpty(newWordSet[selectedRow])
              newWordSet[1].index = findEmpty(newWordSet[1])
              
            }
            if(type === "delete"){
              newWordSet[selectedRow].word[index] = ""
              newWordSet[1].word = Array(5).fill("")
              newWordSet[selectedRow].index = findEmpty(newWordSet[selectedRow])
              newWordSet[1].index = findEmpty(newWordSet[1])
            }
          }

          else if(newWordSet[selectedRow].index  === 4){
            if(type === "append"){
              newWordSet[selectedRow].word[index] = key.key
              newWordSet[2].word[0] = key.key
              newWordSet[selectedRow].index = findEmpty(newWordSet[selectedRow])
              newWordSet[2].index = findEmpty(newWordSet[2])
            }
            if(type === "delete"){
              newWordSet[selectedRow].word[index] = ""
              newWordSet[2].word = Array(5).fill("")
              newWordSet[selectedRow].index = findEmpty(newWordSet[selectedRow])
              newWordSet[2].index = findEmpty(newWordSet[2])
            }
          }

          else if(newWordSet[selectedRow].index <= 4 ){
            if(type === "delete"){
              newWordSet[selectedRow].word[index] = ""
              newWordSet[selectedRow].index = findEmpty(newWordSet[selectedRow])
            }
            else if (type==="append"){
              newWordSet[selectedRow].word[index] = key.key
              newWordSet[selectedRow].index = findEmpty(newWordSet[selectedRow])
            }
          }
          break;
        case 1:
          if(newWordSet[selectedRow].index  === 0){
            if(type === "append"){
              newWordSet[selectedRow].word[index] =  key.key
              newWordSet[0].word[0] = key.key
              newWordSet[selectedRow].index = 1
              
            }
            if(type === "delete"){
              newWordSet[selectedRow].word[index] = ""
              newWordSet[0].word = Array(5).fill("")
              newWordSet[selectedRow].index = 0
              newWordSet[1].index = 0
            }
          }

          else if(newWordSet[selectedRow].index  === 4){
            if(type === "append"){
              newWordSet[selectedRow].word[index] = key.key
              newWordSet[3].word[0] = key.key
            }
            if(type === "delete"){
              newWordSet[selectedRow].word[index] = ""
              newWordSet[3].word = Array(5).fill("")
              newWordSet[selectedRow].index = 3
              newWordSet[3].index = 0
            }
          }

          else if(newWordSet[selectedRow].index <= 4 ){
            if(type === "delete"){
              newWordSet[selectedRow].word[index] = ""
              newWordSet[selectedRow].index -= 1
            }
            else if (type==="append"){
              newWordSet[selectedRow].word[index] = key.key
              newWordSet[selectedRow].index += 1
            }
          }
          break;
        case 2:
          if(newWordSet[selectedRow].index  === 0){
            if(type === "append"){
              newWordSet[selectedRow].word[index] =  key.key
              newWordSet[0].word[4] = key.key
              newWordSet[selectedRow].index = 1
              
            }
            if(type === "delete"){
              newWordSet[selectedRow].word[index] = ""
              newWordSet[0].word[4] = ""
              newWordSet[selectedRow].index = 0
            }
          }

          else if(newWordSet[selectedRow].index  === 4){
            if(type === "append"){
              newWordSet[selectedRow].word[index] = key.key
              newWordSet[3].word[4] = key.key
            }
            if(type === "delete"){
              newWordSet[selectedRow].word[index] = ""
              newWordSet[3].word[index] = ""
              newWordSet[selectedRow].index = 3         
            }
          }

          else if(newWordSet[selectedRow].index <= 4 ){
            if(type === "delete"){
              newWordSet[selectedRow].word[index] = ""
              newWordSet[selectedRow].index -= 1
            }
            else if (type==="append"){
              newWordSet[selectedRow].word[index] = key.key
              newWordSet[selectedRow].index += 1
            }
          }
          break; 
        case 3:
          if(newWordSet[selectedRow].index  === 0){
            if(type === "append"){
              newWordSet[selectedRow].word[index] =  key.key
              newWordSet[1].word[4] = key.key
              newWordSet[selectedRow].index = 1
              
            }
            if(type === "delete"){
              newWordSet[selectedRow].word[index] = ""
              newWordSet[1].word[4] = ""
              newWordSet[selectedRow].index = 0
            }
          }

          else if(newWordSet[selectedRow].index  === 4){
            if(type === "append"){
              newWordSet[selectedRow].word[index] = key.key
              newWordSet[2].word[4] = key.key
            }
            if(type === "delete"){
              newWordSet[selectedRow].word[index] = ""
              newWordSet[2].word[index] = ""
              newWordSet[selectedRow].index = 3         
            }
          }

          else if(newWordSet[selectedRow].index <= 4 ){
            if(type === "delete"){
              newWordSet[selectedRow].word[index] = ""
              newWordSet[selectedRow].index -= 1
            }
            else if (type==="append"){
            newWordSet[selectedRow].word[index] = key.key
            newWordSet[selectedRow].index += 1
            }
          }
          break; 
    }
    return newWordSet;
  }

  function findEmpty(wordArray){
    foundIndex = wordArray.findIndex((element) => element === "")
    if (foundIndex === -1) return 4
    return foundIndex
  }

  function handleClick(num){
    console.log(num);
    setSelectedRow(num);
    if(selectedRow === null){
      setIsSelecting(!isSelecting);
    }
  }  

  return (
   
    <div className="board_module" ref={wrapperRef}>
          <Row baseClass={"row_module top"} onRowClick={()=>handleClick(0)} hoverStatus = {isSelecting}/>
          <Row baseClass={"row_module left"} onRowClick={()=>handleClick(1)} hoverStatus = {isSelecting}/>
          <Row baseClass={"row_module right"} onRowClick={()=>handleClick(2)} hoverStatus = {isSelecting}/>
          <Row baseClass={"row_module bottom"} onRowClick={()=>handleClick(3)} hoverStatus = {isSelecting}/>
    </div>
    
  )
}
