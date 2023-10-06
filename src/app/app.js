import fetch from 'node-fetch'
import { NextRequest , NextResponse  } from 'next/server';
import pkg from 'express';


const Express = pkg;
const app = Express(); 
app.use(Express.json());

app.patch(`/api/serverless-example/p`, async (req, res)  => {
  try {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PATCH, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
    const body  = req.body
    const url = `${process.env.NEXT_PUBLIC_DATA_API_URL}/api/update/recent`
    const encodedURL = encodeURI(url)
    const dataStream = await fetch(encodedURL, {method: 'PATCH', body: body})
    const dataJSON = await dataStream.json()
  }
  catch{
    res.status(400).json({ message: error.message })
  }
});

module.exports = app;