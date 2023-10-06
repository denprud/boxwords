'use client'

import React, { useEffect, useRef } from 'react'
import { useState } from 'react';



export default function Row({baseClass, onRowClick, hoverStatus, currentWord, selectedRow, setRowGame, rowRules, rowValidity, displayValidity, setDisplayValidity}) {
  
  const [className, setClassName] = useState(baseClass);
  const [letter, setLetter] = useState(currentWord.word[currentWord.index])

  useEffect(()=>{
    if(displayValidity){
      if(rowValidity){
        setClassName(baseClass+" correct")
      }
      else{
        setClassName(baseClass+" incorrect")
      }
    
    }
    else{
      //console.log("lol")
      setClassName(baseClass)
    }
    
  }, [hoverStatus, selectedRow, baseClass, displayValidity])
 

    function Square({i}){
      switch(i){
        case 0:
          return <div className="square">{currentWord.word[0]}</div>;
          break;
        case 1:
          return <div className="square">{currentWord.word[1]}</div>;
          break;
        case 2:
          return <div className="square">{currentWord.word[2]}</div>;
          break;
        case 3:
          return <div className="square">{currentWord.word[3]}</div>;
          break;
        case 4:
          return <div className="square">{currentWord.word[4]}</div>;
          break;
        
      }
    }

  return (
    <>
        <div className={className}
        onMouseEnter={() => {
          setClassName(() => { return hoverStatus ? baseClass + " hover" : className});
          if(hoverStatus){
            setRowGame(rowRules)
          }    
        }}
        onMouseLeave={() => {
          setClassName(() => { return hoverStatus ? baseClass : className})
          if(hoverStatus){
            setRowGame("")
          }
        }}
        onClick={()=>{
          //console.log("ohhh")
          onRowClick()
          setClassName(baseClass + " selected")
          setRowGame(rowRules)
          setDisplayValidity(false)
          
          }}>
            <Square i={0}/>
            <Square i={1}/>
            <Square i={2}/>
            <Square i={3}/>
            <Square i={4}/>
        </div>
    </>
  )
}
