import mongoose from "mongoose"

const dataSchema = new mongoose.Schema({
    date: {
        required: true,
        type: Date
    }
}, {strict: false})

const gameSchema = new mongoose.Schema({}, {strict: false})


export const Model = mongoose.model('Data', dataSchema)

export const GameModel = mongoose.model('Games', dataSchema, 'games')
