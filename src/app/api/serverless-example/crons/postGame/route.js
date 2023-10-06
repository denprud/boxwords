import fetch from 'node-fetch'
import {NextResponse  } from 'next/server';

// program to generate random strings

// declare all characters
const characters ='aeiou';

function randomCharacter() { // min and max included 
  return characters.charAt(Math.floor(Math.random() * characters.length));
}

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  function createRandomGame(){
    let ret = {}
    for (let i = 0; i < 4; i++){
        const rndInt = randomIntFromInterval(1, 3)
        if(rndInt == 1){
            ret[i] = "none"
        }
        if(rndInt == 2){
            ret[i] = "palindrome"
        }
        if(rndInt == 3){
            ret[i] = { "name": "enforce", "count": randomIntFromInterval(1, 2), 'char': randomCharacter()}
        }
    }
    return ret
}

export async function GET(request) {
    const url = `${process.env.NEXT_PUBLIC_DATA_API_URL}/api/postGame`
    const encodedURL = encodeURI(url)
    const dataStream = await fetch(encodedURL, {method: 'POST', body: JSON.stringify(createRandomGame())})
    const dataJSON = await dataStream.json()
    return NextResponse.json(
        {
          body: request.body,
          path: request.nextUrl.pathname,
          query: request.nextUrl.search,
          cookies: request.cookies.getAll(),
        },
        {
          status: 200,
        },
      );
}