import fetch from 'node-fetch'
import { NextRequest , NextResponse  } from 'next/server';



 
let wordsAdded = {"hello" : 10}


export async function PATCH(request) {
//   const body  = request.body
//   const url = `${process.env.NEXT_PUBLIC_DATA_API_URL}/api/update/recent`
//   const encodedURL = encodeURI(url)
//   const dataStream = await fetch(encodedURL, {method: 'PATCH', body: body})
//   const dataJSON = await dataStream.json()
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

export function GET(request) {
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

  export function POST(request) {
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

  export function PUT(request) {
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

  export function HEAD(request) {
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

 
// export const results = await fetch(`${process.env.NEXT_PUBLIC_DATA_API_URL}/api/update/recent`, {
//     method: 'PATCH',
//     mode: "cors",
//     headers: {
//               "Access-Control-Allow-Origin" : '*',
//               "content-type": "application/json",
//               'Accept': '*/*',
//   },
//     body: JSON.stringify(wordsAdded)
// }).then(resp => {
//      return resp.json()
// }).then(data => {
//   console.log(JSON.stringify(wordsAdded))
//   console.log("hi")
//   //console.log(data)
// }).catch((err)=>{
//     console.log(err.message);
// });


  