import pkg from 'express';
import {Model, GameModel} from '../model/model.js'
import { recentID, currentPuzzle } from '../index.js';
const Express = pkg;


export const router = Express.Router();






//Post Method
router.post("/post", async (req, res) => {
    const data = new Model({
        date: req.body.date,
        
    })
    try{
        const dataToSave = await data.save();
        
        res.status(200).json(dataToSave)
        //res.send(data)
    }
    catch(error){
        res.status(400).json({message: error.message})
    }
});

//Get all Method
router.get('/getAll', async (req, res) => {
    try{
        const data = await Model.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
});

//Get by ID Method
router.get('/getOne/:id', async (req, res) => {
  try{
      const data = await Model.findById(req.params.id);
      res.json(data)
  }
  catch(error){
      res.status(500).json({message: error.message})
  }
})

//Get recent data
router.get('/getOne/recent/:id', async (req, res) => {
    try{
        const data = await Model.findById(recentID.id);
        res.json(data)
        
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
  })

  router.get('/getGame/:id', async (req, res) => {
    try{
        const data = await GameModel.findById(req.params.id);
        res.json(data[currentPuzzle.current])
        
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
  })

///Update by ID Method
router.patch('/update/:id', async (req, res) => {
  try {
      const id = req.params.id;
      let updatedData = req.body;
      console.log(updatedData)
      const options = { new: true };

      const result = await Model.findByIdAndUpdate(
          id, updatedData, options
      )

      res.send(result)
  }
  catch (error) {
      res.status(400).json({ message: error.message })
  }
})

///Update recent database
router.patch('/update/recent/:id', async (req, res) => {
    try {
        console.log(req.body)
        const id = recentID.id
        let updatedData = req.body;
        //console.log(updatedData)
        const options = { new: true };
  
        const result = await Model.findByIdAndUpdate(
            id, updatedData, options
        )
  
        res.send(result)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
  })

//Delete by ID Method
router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Model.findByIdAndDelete(id)
        res.send(`Document with ${data.name} has been deleted..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})