import fetch from 'node-fetch'
import {NextResponse  } from 'next/server';

export async function GET(request) {
    const date = new Date(); 
    const string = date.getFullYear()+"-"+String(date.getMonth()+1).padStart(2,"0")+"-"+String(date.getDate()+1).padStart(2,"0")
    const url = `${process.env.NEXT_PUBLIC_DATA_API_URL}/api/postData`
    const encodedURL = encodeURI(url)
    const dataStream = await fetch(encodedURL, {method: 'POST', body: JSON.stringify({"date": date})})
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

