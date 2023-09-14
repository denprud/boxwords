'use client';

import Image from 'next/image'
import styles from './page.module.css'
import Row from './components/Row'
import Board from './components/Board'
import Modal from './components/Modal'
import Tutorial from './components/Tutorial';
import { useEffect, useState } from 'react'
import * as Realm from "realm-web";
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";



export default function Home() {

  const [gameCompleted, setGameCompleted] = useState(false);
  const [wordset, setWordset] = useState([
    {word: Array(5).fill(""), index: 0},{word: Array(5).fill(""), index: 0},{word: Array(5).fill(""), index: 0},{word: Array(5).fill(""), index: 0}
  ])
  const [numberOfTries, setNumberOfTries] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false)
  const graphqlUri = process.env.NEXT_PUBLIC_DATA_GRAPHQL_URL
  // const app = new Realm.App({ id: process.env.NEXT_PUBLIC_APP_ID });

  // async function getValidAccessToken() {
  //   // Guarantee that there's a logged in user with a valid access token
  //   if (!app.currentUser) {
  //     // If no user is logged in, log in an anonymous user. The logged in user will have a valid
  //     // access token.
  //     await app.logIn(Realm.Credentials.anonymous());
  //   } else {
  //     // An already logged in user's access token might be stale. Tokens must be refreshed after 
  //     // 30 minutes. To guarantee that the token is valid, we refresh the user's access token.
  //     await app.currentUser.refreshAccessToken();
  //   }
  //   return app.currentUser.accessToken;
  // }
  
  // const client = new ApolloClient({
  //   link: new HttpLink({
  //     uri: graphqlUri,
  //     // We define a custom fetch handler for the Apollo client that lets us authenticate GraphQL requests.
  //     // The function intercepts every Apollo HTTP request and adds an Authorization header with a valid
  //     // access token before sending the request.
  //     fetch: async (uri, options) => {
  //       const accessToken = await getValidAccessToken();
  //       options.headers.Authorization = `Bearer ${accessToken}`;
  //       return fetch(uri, options);
  //     },
  //   }),
  //   cache: new InMemoryCache(),
  // });
  


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
        <div className="line">
          <hr/>
        </div>
      </div>
      <Board gameCompleted = {gameCompleted} setGameCompleted={setGameCompleted} wordset={wordset} setWordset={setWordset}  />
      {gameCompleted && <Modal setOpenModal={setGameCompleted} numberOfTries={numberOfTries}/>}
      {showTutorial && <Tutorial setShowTutorial={setShowTutorial}/>}
      <button className="button" onClick={() =>{setShowTutorial(true)}}>Rules</button>
    </>
  )
}
