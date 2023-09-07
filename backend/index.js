import cpkg from 'cors'

// const corsOptions ={
//    origin:'*', 
//    credentials:true,            //access-control-allow-credentials:true
//    optionSuccessStatus:200,
// }


import bodyParser from 'body-parser';
import pkg from 'express';
import { scheduleJob } from 'node-schedule';
import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';
import {router} from './routes/routes.js'

configDotenv()
const Express = pkg;
const cors  = cpkg;
const mongoString = process.env.MONGODB_URI;
const baseUrl = process.env.DATA_API_URL;
export let recentID = {id: "64f1212b80d1ea9c098eaf09"};
export let currentPuzzle = {current: 1};



mongoose.connect(mongoString,  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'mm',
  });
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})
const app = Express(); 




app.use(Express.json());




app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PATCH, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
    next();
  })

app.listen(baseUrl, () => {
    console.log(`Server Started at ${baseUrl}`)
})


app.use('/api', router)





//   app.use(cors({
//     origin: 'http://localhost:3000'
//   }));


// const lol = {
//     name : "halls",
//     age: 14
// }
// const loljson = JSON.stringify(lol)
// console.log(loljson)

// id = 0

const createDict = async () =>{
    let results = await fetch(`${baseUrl}/api/post`, {
        method: 'POST',
        headers: {
            "content-type": "application/json"
          },
        body: JSON.stringify({
            date: Date()
        }),
    }).then(resp => {
        return resp.json()
        //console.log(resp.body)
    }).then((data)=>{
        //console.log(data._id)
        recentID.id = data._id
        console.log(recentID)
        
    }).catch((err)=>{
        console.log(err.message);
    });
}

scheduleJob('0 0 * * *', () => {
    createDict()
    currentPuzzle += 1;
}) // run everyday at midnight
//createDict()
//module.exports = recentID;
  