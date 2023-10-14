const express=require('express')
const bcrypt=require('bcrypt')
const jwt=require("jsonwebtoken")
const router=express.Router()
const authenticate=require('../middleware/authenticate')
const cookieParser = require('cookie-parser');
const { generateAIResponse } = require('../ai/ai_spcript');

router.use(cookieParser())
require("../../db/connect.js")
const User=require("../../db/modules/userSchema")

router.get("/",(req,res)=>{
    res.send("hello world from the server")
})

router.post('/register',async(req,res)=>{
   const {name,email,phone,clas,password,cpassword}=req.body
   if(!name || !email || !phone || !clas || !password || !cpassword){
    return res.status(423).json({error:'Pls filled the field properly'})
   }
   try{
    const userExist=await User.findOne({email})
    if(userExist){
            return res.status(423).json({error:"Email already exist"})
    }else if(password!=cpassword){
        return res.status(427).json({error:'password is not matching'})
    }
    else{
        const user=new User({name,email,phone,clas,password,cpassword})
        const result=await user.save()
        res.status(201).json({message:"user registered successfully"})
    }
    
   }catch(err){console.log(err)}
})

router.post('/signin',async(req,res)=>{
    try{
        const {email,password}=req.body
        if(!email || !password){
            return res.status(400).json({error:"Plz fill the data"})
        }
        const userLogin=await User.findOne({email})
        if(userLogin){
            const isMatch=await bcrypt.compare(password,userLogin.password)
            let token=await userLogin.generateAuthToken()

            res.cookie('jwtoken',token,{
                expires:new Date(Date.now()+25892000000),
                httpOnly:true
            })
        if(!isMatch){
            res.json({error:"Invalid credential"})

        }
        else{
            res.json({message:"user Signin Successfully"})

        }
        }
        else{
            res.json({error:"Invalid credential"})

        }
    }catch(err){
        console.log(err)
    }
})

router.get('/about',authenticate,(req,res)=>{
    res.send(req.rootUser)
})

router.get('/getdata',authenticate,(req,res)=>{
    res.send(req.rootUser)
})

router.post('/contact', authenticate, async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        if (!name || !email || !phone || !message) {
            console.log("error in contact form");
            return res.status(400).json({ error: "Please fill the contact form" });
        }

        const userContact = await User.findOne({ _id: req.userID });

        if (userContact) {
            const userMessage = await userContact.addMessage(name, email, phone, message);

            if (userMessage) {
                return res.status(200).json({ message: "User contacted successfully" });
            } else {
                console.log("Error in adding message to user");
                return res.status(500).json({ error: "Internal Server Error" });
            }
        } else {
            console.log("User not found");
            return res.status(404).json({ error: "User not found" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/logout',authenticate,(req,res)=>{
    res.clearCookie('jwtoken',{path:'/'})
    res.status(200).send("User logout")
})

router.post('/chat', authenticate, async (req, res) => {
    try {
        const { user, assistant } = req.body;
        if (!user || !assistant) {
            console.log('error in user message');
            return res.status(400).json({ error: 'Please enter your message' });}
        const userConnect = await User.findOne({ _id: req.userID });
        if (userConnect) {
            console.log(user)
            const aiResponse = await generateAIResponse(user);
            console.log(aiResponse)
            const userMessage = await userConnect.addQuerry(user, aiResponse)
            if (!aiResponse || !userMessage) {
                console.log('Error in adding message to user');
                return res.status(500).json({ error: 'Internal Server2 Error' });
                } 
            else {
                console.log(aiResponse);
                // Generate an AI response based on the user message
                return res.status(200).json({ message: 'User message received'})
            }} 
        else {console.log('User not found');
            return res.status(404).json({ error: 'User not found' });}
        } catch (error) {
            res.status(500).json({ error: 'Internal server1 error' });}
});
module.exports = router