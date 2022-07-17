const express = require('express')
const PORT = process.env.PORT || 5000
const mongoose = require('mongoose')

const authRouter = require('./authRouter')


const app = express()


app.use(express.json())
app.use('/auth', authRouter)


const start = async () => {
    try {
        await mongoose.connect('mongodb+srv://simpleAuth:creatingsimpleauth@cluster0.g6hue.mongodb.net/simpleAuth?retryWrites=true&w=majority')
        app.listen(PORT, () => {
            console.log(`server started on port ${PORT}`)
        })
    } catch (error) {
        console.log(error);
    }
}

start()