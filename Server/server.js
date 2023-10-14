const mongoose=require("mongoose")
const express=require("express")
const cors=require('cors')
const dotenv=require('dotenv')

dotenv.config({path:'./.env'})

require('../db/connect')

const User=require('../db/modules/userSchema')

const port=process.env.PORT || 3001;

const app=express()

app.use(express.json())

app.use(require('./router/auth'))

app.use(cors)


app.listen(port,()=>{
    console.log(`server is running at ${port}`)
})