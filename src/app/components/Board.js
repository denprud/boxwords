'use client';

import React, { useEffect, useRef } from 'react'
import Row from './Row'
import Modal from './Modal';
import { useState } from 'react'
import useOutsideAlerter from '../hooks/useOutsideAlerter';
import useEnforceRules from '../hooks/useEnforceRule';
import PropTypes from "prop-types";
import {GAMES} from "./../../../data/games"
import { configDotenv } from 'dotenv';
import { set } from 'mongoose';
import { useQuery, useMutation } from "@apollo/client";
import gql from "graphql-tag";
import * as Realm from "realm-web";
import Amplify, { API } from 'aws-amplify';

//import {dict, userCount} from  "./../../../data/dictionary"







export default function Board({gameCompleted, setGameCompleted, wordset, setWordset}){
  
  // const [wordset, setWordset] = useState([
  //   {word: Array(5).fill(""), index: 0},{word: Array(5).fill(""), index: 0},{word: Array(5).fill(""), index: 0},{word: Array(5).fill(""), index: 0}
  // ])
  //configDotenv()
  const wrapperRef = useRef(null);
  //state to determine if we are deciding to click on a row
  const [isSelecting, setIsSelecting] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);
  const [rowOneValid, setRowOneValid] = useState(false);
  const [rowTwoValid, setRowTwoValid] = useState(false);
  const [rowThreeValid, setRowThreeValid] = useState(false);
  const [rowFourValid, setRowFourValid] = useState(false);
  const [rarity, setRarity] = useState(0);
  //const [gameCompleted, setGameCompleted] = useState(false);
  //const [validate, setValidate] = useState(false);
  const [wordsAdded, setWordsAdded] = useState({})
  const [rowRules, setRowRules] = useState({"rowOne": "none", "rowTwo": "none", "rowThree": "none", "rowFour": "none"})
  const [rowGame, setRowGame] = useState("")
  const app = new Realm.App({ id: process.env.NEXT_PUBLIC_APP_ID });
  const baseUrl = process.env.NEXT_PUBLIC_DATA_API_URL;
  
//   Amplify.configure({
//     // Auth: {
//     // // REQUIRED - Amazon Cognito Identity Pool ID
//     //     identityPoolId: 'XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab',
//     // // REQUIRED - Amazon Cognito Region
//     //     region: 'XX-XXXX-X', 
//     // // OPTIONAL - Amazon Cognito User Pool ID
//     //     userPoolId: 'XX-XXXX-X_abcd1234', 
//     // // OPTIONAL - Amazon Cognito Web Client ID
//     //     userPoolWebClientId: 'XX-XXXX-X_abcd1234',
//     // },
//     API: {
//         endpoints: [ 
//             {
//                 name: "myLamdaFunction-API",
//                 endpoint: "https://lambda.us-east-1.amazonaws.com/2015-03-31/functions/yourFuncName/invocations",
//                 service: "https://jd0n34sx9g.execute-api.eu-central-1.amazonaws.com/default/myLamdaFunction",
//                 region: "eu-central-1"
//             }
//         ]
//     }
// })
 
  

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
  
  useOutsideAlerter(gameCompleted, wrapperRef, isSelecting,()=>{
    //resets the selection process
    resetStates()
  });


  useEffect(() => {
    window.addEventListener('keyup', handleKeyup)
    return () => window.removeEventListener('keyup', handleKeyup)
  }, [handleKeyup])

  useEffect(() => {
  //   const getCurrentGame = async () =>{
  //     let results = await fetch(`${baseUrl}/api/getGame`).then(resp => {
  //          return resp.json()
  //     }).then(data => {
  //       setRowRules(data)
  //       console.log(data)
  //     }).catch((err)=>{
  //         console.log(err.message);
  //     });
  //  }

   
   //getCurrentGame()
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

  useEffect(()=>{
   
    
    const addWordsToDB = async () =>{
      // let apiName = 'MyApiName'; // replace this with your api name.
      // let path = '/path'; //replace this with the path you have configured on your API
      // let myInit = {
      //   body: {}, // replace this with attributes you need
      //   headers: {} // OPTIONAL
      // }

      // API.post(apiName, path, myInit).then(response => {
      //     // Add your code here
      // });
      
      
      const accessToken = await getValidAccessToken();
      console.log(accessToken)
      
      //https://cors-anywhere.herokuapp.com/
      

      //Need a better solution
      let results = await fetch(`https://thingproxy.freeboard.io/fetch/${baseUrl}/api/update/recent`, {
          method: 'PATCH',
          mode: "cors",
          headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    "Access-Control-Allow-Origin" : '*',
                    
                    "content-type": "application/json",
                    'Accept': '*/*',
                    
        },
          body: JSON.stringify(wordsAdded)
      }).then(resp => {
           return resp.json()
      }).then(data => {
        console.log(JSON.stringify(wordsAdded))
        console.log("hi")
        //console.log(data)
      }).catch((err)=>{
          console.log(err.message);
          console.log(accessToken);
      });
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
              newWordSet[selectedRow].index = findEmpty(newWordSet[selectedRow].word)
              newWordSet[2].index = findEmpty(newWordSet[2].word)
            }
          }

          else if(newWordSet[selectedRow].index < 4 ){
            if(type === "delete"){
              if (newWordSet[selectedRow].index  === 1){
                  newWordSet[selectedRow].word[index-1] = ""
                  newWordSet[1].word = Array(5).fill("")
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
              newWordSet[selectedRow].index = findEmpty(newWordSet[selectedRow].word)
              newWordSet[3].index = findEmpty(newWordSet[3].word)
            }
          }

          else if(newWordSet[selectedRow].index < 4 ){
            if(type === "delete"){
              if (newWordSet[selectedRow].index  === 1){
                  newWordSet[selectedRow].word[index-1] = ""
                  newWordSet[0].word = Array(5).fill("")
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
  
  function HandleSubmit(){
      setRowOneValid(useEnforceRules(rowRules.rowOne, wordset[0].word, wordset))
      setRowTwoValid(useEnforceRules(rowRules.rowTwo, wordset[1].word, wordset))
      setRowThreeValid(useEnforceRules(rowRules.rowThree, wordset[2].word, wordset))
      setRowFourValid(useEnforceRules(rowRules.rowFour, wordset[3].word, wordset))
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
            console.log(data[0])
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
           console.log(newRarity)
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
          <Row baseClass={"row_module top"} onRowClick={()=>handleClick(0)} hoverStatus = {isSelecting} currentWord = {wordset[0]} selectedRow={selectedRow} setRowGame={setRowGame} rowRules={rowRules.rowOne}/>
          <Row baseClass={"row_module left"} onRowClick={()=>handleClick(1)} hoverStatus = {isSelecting} currentWord = {wordset[1]} selectedRow={selectedRow} setRowGame={setRowGame} rowRules={rowRules.rowOne}/>
          <Row baseClass={"row_module right"} onRowClick={()=>handleClick(2)} hoverStatus = {isSelecting} currentWord = {wordset[2]} selectedRow={selectedRow} setRowGame={setRowGame} rowRules={rowRules.rowOne}/>
          <Row baseClass={"row_module bottom"} onRowClick={()=>handleClick(3)} hoverStatus = {isSelecting} currentWord = {wordset[3]} selectedRow={selectedRow} setRowGame={setRowGame} rowRules={rowRules.rowOne}/>
          <div className='inner_box'>
            <div className="rarity">{rarity}</div>
            <button className="submit_button button" type="button" onClick={()=>HandleSubmit()} >Submit Puzzle!</button>
          </div>
          <div className='row_game_noti'>{`${rowGame}`}</div>
          
          
          {/* {gameCompleted && <Modal setOpenModal={setGameCompleted}/>} */}
    </div>
    
  )
}
