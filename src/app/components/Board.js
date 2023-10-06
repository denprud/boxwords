'use client';

import React, { useEffect, useRef } from 'react'
import Row from './Row'
import { useState } from 'react'
import useOutsideAlerter from '../hooks/useOutsideAlerter';
import useEnforceRules from '../hooks/useEnforceRule';
import * as Realm from "realm-web";
import Line from './Line';



//import {dict, userCount} from  "./../../../data/dictionary"







export default function Board({gameCompleted, setGameCompleted, wordset, setWordset, rarity, setRarity}){
  
  
  const wrapperRef = useRef(null);
  const submit = useRef(null);
  //state to determine if we are deciding to click on a row
  const [isSelecting, setIsSelecting] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);
  const [rowOneValid, setRowOneValid] = useState(false);
  const [rowTwoValid, setRowTwoValid] = useState(false);
  const [rowThreeValid, setRowThreeValid] = useState(false);
  const [rowFourValid, setRowFourValid] = useState(false);
  
  const [displayValidity, setDisplayValidity] = useState(false)
  const [wordsAdded, setWordsAdded] = useState({test:6})
  const [rowRules, setRowRules] = useState({0: "none", 1: "palindrome", 2: { "name": "enforce", "count": 1, 'char':'e'}, 3: "none"})
  const [rowGame, setRowGame] = useState("")
  const app = new Realm.App({ id: process.env.NEXT_PUBLIC_APP_ID });
  const baseUrl = process.env.NEXT_PUBLIC_DATA_API_URL;
  
  async function getValidAccessToken() {
    // Guarantee that there's a logged in user with a valid access token
    if (!app.currentUser) {
      // If no user is logged in, log in an anonymous user. The logged in user will have a valid
      // access token.
      await app.logIn(Realm.Credentials.anonymous());
    } else {
      // An already logged in user's access token might be stale. Tokens must be refreshed after 
      // 30 minutes. To guarantee that the token is valid, we refresh the user's access token.
      await app.currentUser.refreshAccessToken();
    }
    return app.currentUser.accessToken;
  }
  


  //console.log(baseUrl)
  
  useOutsideAlerter(gameCompleted, wrapperRef, isSelecting, setDisplayValidity,()=>{
    //resets the selection process
    resetStates()
  });


  useEffect(() => {
    window.addEventListener('keyup', handleKeyup)
    return () => window.removeEventListener('keyup', handleKeyup)
  }, [handleKeyup])

  useEffect(() => {
    const getCurrentGame = async () =>{
      let results = await fetch(`${baseUrl}/api/getGame`).then(resp => {
           return resp.json()
      }).then(data => {

        if(data.length != 0){
          setRowRules(data)
        }

        //console.log(data)
      }).catch((err)=>{
          console.log(err.message);
      });
   }

   
   getCurrentGame()
  }, [])


  useEffect(()=>{
    checkgame()
  },[rowOneValid, rowTwoValid, rowThreeValid, rowFourValid])


  //Sets the Validity of rows to false if the game begins or starts over (via Modal.js continue)
  useEffect(()=>{
    if(!gameCompleted){
      setRowOneValid(false)
      setRowTwoValid(false)
      setRowThreeValid(false)
      setRowFourValid(false)
    }
  },[gameCompleted])

  // //https://cors-anywhere.herokuapp.com/
      //https://thingproxy.freeboard.io/fetch/

      // console.log(JSON.stringify(wordsAdded))
      
      
     

  useEffect(()=>{
    const addWordsToDB = async () =>{
      const accessToken = await getValidAccessToken();
      
      let results = await fetch(`${baseUrl}/api/update/recent`, {
          method: 'PUT',
          headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Request-Headers": "*",
          },
          body: JSON.stringify(wordsAdded)
      }).then(resp => {
           return resp.json()
      }).then(data => {
        //console.log(JSON.stringify(wordsAdded))
      }).catch((err)=>{
          console.log(err.message);
          
      });

      // let results = await fetch(`/api/serverless-example/`,{ 
      //   headers: {
      //                   "content-type": "application/json",
      //                   "Accept": "application/json"
      //   },
      //   method: 'PATCH',
      //   mode: "cors",
      //   body: JSON.stringify({test:6})
      // }).then(resp => {
      //        return resp.json
      //   }).then(data => {
      //     console.log(data)
      //   });
      // console.log(process.env.VERCELURL)


   }
   addWordsToDB()
  },[wordsAdded])
  

  function resetStates(){
    setSelectedRow(null);
    setIsSelecting(!isSelecting);
    setRowGame("")
    
  }


  function handleKeyup(key){
    if (selectedRow === null || isSelecting) return;

    var newWordSet = wordset.slice();
    

    if (/^[A-Za-z]$/.test(key.key)) {
      if (wordset[selectedRow].word.includes("")){
        //newWordSet[selectedRow].word = newWordSet[selectedRow].word + key.key
        
        newWordSet = fixBoard(newWordSet, "append", key)
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
              newWordSet[selectedRow].index = findEmpty(newWordSet[selectedRow].word)
              newWordSet[1].index = findEmpty(newWordSet[1].word)
            }
          }

          else if(newWordSet[selectedRow].index  === 4){
            if(type === "append"){
              newWordSet[selectedRow].word[index] = key.key
              newWordSet[2].word[0] = key.key
              newWordSet[selectedRow].index = findEmpty(newWordSet[selectedRow].word)
              newWordSet[2].index = findEmpty(newWordSet[2].word)
            }
            if(type === "delete"){
              if (newWordSet[selectedRow].word.includes("")){
                newWordSet[selectedRow].word[newWordSet[selectedRow].index-1] = ""
                newWordSet[selectedRow].index = findEmpty(newWordSet[selectedRow].word)
                break;
              }
              newWordSet[selectedRow].word[index] = ""
              newWordSet[2].word = Array(5).fill("")
              newWordSet[2].word[4] = newWordSet[3].word[4]
              newWordSet[selectedRow].index = findEmpty(newWordSet[selectedRow].word)
              newWordSet[2].index = findEmpty(newWordSet[2].word)
            }
          }

          else if(newWordSet[selectedRow].index < 4 ){
            if(type === "delete"){
              if (newWordSet[selectedRow].index  === 1){
                  newWordSet[selectedRow].word[index-1] = ""
                  newWordSet[1].word = Array(5).fill("")
                  newWordSet[1].word[4] = newWordSet[3].word[0]
                  newWordSet[selectedRow].index = findEmpty(newWordSet[selectedRow].word)
                  newWordSet[1].index = findEmpty(newWordSet[1].word)
              }
              else{
              newWordSet[selectedRow].word[index-1] = ""
              newWordSet[selectedRow].index = findEmpty(newWordSet[selectedRow].word)
              }
            }
            else if (type==="append"){
              newWordSet[selectedRow].word[index] = key.key
              newWordSet[selectedRow].index = findEmpty(newWordSet[selectedRow].word)
            }
          }
          break;
        case 1:

          //IF the index is empty
          if(newWordSet[selectedRow].index  === 0){
            if(type === "append"){
              newWordSet[selectedRow].word[newWordSet[selectedRow].index] =  key.key
              newWordSet[0].word[0] = key.key
              newWordSet[selectedRow].index = findEmpty(newWordSet[selectedRow].word)
              newWordSet[0].index = findEmpty(newWordSet[0].word)
              
            }
            if(type === "delete"){
              newWordSet[selectedRow].word[newWordSet[selectedRow].index] = ""
              newWordSet[0].word = Array(5).fill("")
              newWordSet[selectedRow].index = findEmpty(newWordSet[selectedRow].word)
              newWordSet[0].index = findEmpty(newWordSet[0].word)
            }
          }

          else if(newWordSet[selectedRow].index  === 4){
            if(type === "append"){
              newWordSet[selectedRow].word[newWordSet[selectedRow].index] = key.key
              newWordSet[3].word[0] = key.key
              newWordSet[selectedRow].index = findEmpty(newWordSet[selectedRow].word)
              newWordSet[3].index = findEmpty(newWordSet[3].word)
            }
            if(type === "delete"){
              if (newWordSet[selectedRow].word.includes("")){
                newWordSet[selectedRow].word[newWordSet[selectedRow].index-1] = ""
                newWordSet[selectedRow].index = findEmpty(newWordSet[selectedRow].word)
                break;
              }
              newWordSet[selectedRow].word[newWordSet[selectedRow].index] = ""
              newWordSet[3].word = Array(5).fill("")
              newWordSet[3].word[4] = newWordSet[2].word[4]
              newWordSet[selectedRow].index = findEmpty(newWordSet[selectedRow].word)
              newWordSet[3].index = findEmpty(newWordSet[3].word)
            }
          }

          else if(newWordSet[selectedRow].index < 4 ){
            if(type === "delete"){
              if (newWordSet[selectedRow].index  === 1){
                  newWordSet[selectedRow].word[index-1] = ""
                  newWordSet[0].word = Array(5).fill("")
                  //Retain original ending
                  newWordSet[0].word[4] = newWordSet[2].word[0]
                  newWordSet[selectedRow].index = findEmpty(newWordSet[selectedRow].word)
                  newWordSet[0].index = findEmpty(newWordSet[1].word)
              }
              else{
              newWordSet[selectedRow].word[index-1] = ""
              newWordSet[selectedRow].index = findEmpty(newWordSet[selectedRow].word)
              }
            }
            else if (type==="append"){
              newWordSet[selectedRow].word[newWordSet[selectedRow].index] = key.key
              newWordSet[selectedRow].index = findEmpty(newWordSet[selectedRow].word)
            }
          }
          break;
        case 2:
          if(newWordSet[selectedRow].index  === 0){
            if(type === "append"){
              newWordSet[selectedRow].word[index] =  key.key
              newWordSet[0].word[4] = key.key
              newWordSet[selectedRow].index = findEmpty(newWordSet[selectedRow].word)
              newWordSet[0].index = findEmpty(newWordSet[0].word)
              
            }
          }

          else if(newWordSet[selectedRow].index  === 4){
            if(type === "append"){
              newWordSet[selectedRow].word[index] = key.key
              newWordSet[3].word[4] = key.key
              newWordSet[selectedRow].index = findEmpty(newWordSet[selectedRow].word)
              newWordSet[3].index = findEmpty(newWordSet[3].word)
            }
            if(type === "delete"){
              if (newWordSet[selectedRow].word.includes("")){
                newWordSet[selectedRow].word[newWordSet[selectedRow].index-1] = ""
                newWordSet[selectedRow].index = findEmpty(newWordSet[selectedRow].word)
                break;
              }
              newWordSet[selectedRow].word[index] = ""
              newWordSet[3].word[index] = ""
              newWordSet[selectedRow].index = findEmpty(newWordSet[selectedRow].word)
              newWordSet[3].index = findEmpty(newWordSet[3].word)         
            }
          }

          else if(newWordSet[selectedRow].index < 4 ){
            if(type === "delete"){
              if (newWordSet[selectedRow].index  === 1){
                newWordSet[selectedRow].word[index-1] = ""
                newWordSet[0].word[4] = ""
                newWordSet[selectedRow].index = findEmpty(newWordSet[selectedRow].word)
                newWordSet[0].index = findEmpty(newWordSet[0].word)
              }
              else{
              newWordSet[selectedRow].word[index-1] = ""
              newWordSet[selectedRow].index = findEmpty(newWordSet[selectedRow].word)
              }
            }
            else if (type==="append"){
              newWordSet[selectedRow].word[index] = key.key
              newWordSet[selectedRow].index = findEmpty(newWordSet[selectedRow].word)
            }
          }
          break; 
        case 3:
          if(newWordSet[selectedRow].index  === 0){
            if(type === "append"){
              newWordSet[selectedRow].word[index] =  key.key
              newWordSet[1].word[4] = key.key
              newWordSet[selectedRow].index = findEmpty(newWordSet[selectedRow].word)
              newWordSet[1].index = findEmpty(newWordSet[1].word)
              
            }
            if(type === "delete"){
              newWordSet[selectedRow].word[index] = ""
              newWordSet[1].word[4] = ""
              newWordSet[selectedRow].index = findEmpty(newWordSet[selectedRow].word)
              newWordSet[1].index = findEmpty(newWordSet[1].word)
            }
          }

          else if(newWordSet[selectedRow].index  === 4){
            if(type === "append"){
              newWordSet[selectedRow].word[index] = key.key
              newWordSet[2].word[4] = key.key
              newWordSet[selectedRow].index = findEmpty(newWordSet[selectedRow].word)
              newWordSet[2].index = findEmpty(newWordSet[2].word)
            }
            if(type === "delete"){
              if (newWordSet[selectedRow].word.includes("")){
                newWordSet[selectedRow].word[newWordSet[selectedRow].index-1] = ""
                newWordSet[selectedRow].index = findEmpty(newWordSet[selectedRow].word)
                break;
              }
              newWordSet[selectedRow].word[index] = ""
              newWordSet[2].word[index] = ""
              newWordSet[selectedRow].index = findEmpty(newWordSet[selectedRow].word)
              newWordSet[2].index = findEmpty(newWordSet[2].word)         
            }
          }

          else if(newWordSet[selectedRow].index < 4 ){
            if(type === "delete"){
              if (newWordSet[selectedRow].index  === 1){
                newWordSet[selectedRow].word[index-1] = ""
                newWordSet[1].word[4] = ""
                newWordSet[selectedRow].index = findEmpty(newWordSet[selectedRow].word)
                newWordSet[1].index = findEmpty(newWordSet[1].word)
              }
              else{
              newWordSet[selectedRow].word[index-1] = ""
              newWordSet[selectedRow].index = findEmpty(newWordSet[selectedRow].word)
              }
            }
            else if (type==="append"){
              newWordSet[selectedRow].word[index] = key.key
              newWordSet[selectedRow].index = findEmpty(newWordSet[selectedRow].word)
            }
          }
          break; 
    }
    return newWordSet;
  }

  function findEmpty(wordArray){
    const foundIndex = wordArray.indexOf("")
    if (foundIndex === -1) return 4;
    return foundIndex;
  }

  function handleClick(num){
    if(selectedRow === null){
     
      setIsSelecting(!isSelecting);
      
    }
    setSelectedRow(num);
  } 
  
  function handleSubmit(){
      setRowOneValid(useEnforceRules(rowRules[0], wordset[0].word, wordset))
      setRowTwoValid(useEnforceRules(rowRules[1], wordset[1].word, wordset))
      setRowThreeValid(useEnforceRules(rowRules[2], wordset[2].word, wordset))
      setRowFourValid(useEnforceRules(rowRules[3], wordset[3].word, wordset))
      setDisplayValidity(true)
      //resetStates()
      }
  

  function checkgame(){
    if (rowOneValid && rowTwoValid && rowThreeValid && rowFourValid ){
      resetStates()
      let newRarity = 0
      let newWordsAdded = {}
      let wordsExist;
      const getWords = async () =>{
        let results =  await fetch(`${baseUrl}/api/getOne/recent`).then(resp => {
            return resp.json()
          }).then( (data)=>{
            //console.log(data[0])
            wordsExist = data[0];
             wordset.forEach (element => {
              const string = arrayToString(element.word)
              //console.log(Object.values(wordsExist))
              if (wordsExist.hasOwnProperty(string)){
                
                newWordsAdded[string] =  wordsExist[string] + 1;
                newRarity += 1/(wordsExist[string] + 1)
              }
              else{
                //console.log("yes")
                newWordsAdded[string] = 1;
                newRarity += 1
              }
            });
           //console.log(newRarity)
           setRarity(newRarity)
           return newWordsAdded
        }).then((data) => setWordsAdded(data)).then(setGameCompleted(true)).then().catch((err)=>{
            console.log(err.message);
        });
        //console.log(results)
      }
      getWords()
      
      
      //var replacer = function(k, v) { if (v === undefined) { return null; } return v; };
      //console.log(wordsAdded)
      //wordsAdded = JSON.stringify(wordsAdded, replacer);
      //console.log(wordsAdded)
      
      
      
     

    }
    else{
      setGameCompleted(false)
    }
  }

  function arrayToString(arr){
    let stringOutput = '';
    for (const element of arr){
        stringOutput += element;
    }
    return stringOutput
}

  return (
   
    <div className="board_module" ref={wrapperRef}>
          <Row baseClass={"row_module top"} onRowClick={()=>handleClick(0)} hoverStatus = {isSelecting} currentWord = {wordset[0]} selectedRow={selectedRow} setRowGame={setRowGame} rowRules={rowRules[0]} rowValidity={rowOneValid} displayValidity={displayValidity} setDisplayValidity={setDisplayValidity}/>
          <Row baseClass={"row_module left"} onRowClick={()=>handleClick(1)} hoverStatus = {isSelecting} currentWord = {wordset[1]} selectedRow={selectedRow} setRowGame={setRowGame} rowRules={rowRules[1]} rowValidity={rowTwoValid} displayValidity={displayValidity} setDisplayValidity={setDisplayValidity}/>
          <Row baseClass={"row_module right"} onRowClick={()=>handleClick(2)} hoverStatus = {isSelecting} currentWord = {wordset[2]} selectedRow={selectedRow} setRowGame={setRowGame} rowRules={rowRules[2]} rowValidity={rowThreeValid} displayValidity={displayValidity} setDisplayValidity={setDisplayValidity}/>
          <Row baseClass={"row_module bottom"} onRowClick={()=>handleClick(3)} hoverStatus = {isSelecting} currentWord = {wordset[3]} selectedRow={selectedRow} setRowGame={setRowGame} rowRules={rowRules[3]} rowValidity={rowFourValid} displayValidity={displayValidity} setDisplayValidity={setDisplayValidity}/>
          <div className='outer_inner'>
            <div className='row_game_noti'>{`${typeof(rowGame) === 'string' ? rowGame : "Requires "+rowGame.count+" "+`\'${rowGame.char}\'`}`}</div>
            {displayValidity && 
            <>
              <Line baseClass={"top_line"} rowValidity={rowOneValid}/>
              <Line baseClass={"left_line"} rowValidity={rowTwoValid}/>
              <Line baseClass={"right_line"} rowValidity={rowThreeValid}/>
              <Line baseClass={"bottom_line"} rowValidity={rowFourValid}/>
            </>
            }
            <div className='inner_box'>
              <div className="rarity">{rarity % 1 === 0 ? rarity : (Math.round(rarity * 100) / 100).toFixed(2)}</div>
              <button className="submit_button button" type="button" onClick={()=>handleSubmit()} >Submit Puzzle!</button>
            </div>
          </div>
          
          
          
          
          
          {/* {gameCompleted && <Modal setOpenModal={setGameCompleted}/>} */}
    </div>
    
  )
}
