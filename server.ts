import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

const app = express()

//middleware
app.use(cors())
app.use(express.json())
app.use((req,res,next) => {
    console.log(req.path, req.method)
    next()
})



//connect to DB
mongoose.connect(process.env.PORT), () => {

})

