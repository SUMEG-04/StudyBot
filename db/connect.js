const mongoose=require('mongoose')

const DB=process.env.mongodbConnection
mongoose.connect(DB).then(()=>{
    console.log("connection successful")
}).catch((err)=>{console.log(err)})
