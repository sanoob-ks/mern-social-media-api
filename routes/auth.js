const router = require('express').Router()
const User=require('../models/User')
const bcrypt=require('bcrypt')

//REGISTER
router.post('/register',async(req,res)=>{
    
    try{
        //creating hashed password
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(req.body.password,salt);

        //creating user
        const newUser =await new User({
            username:req.body.username,
            email:req.body.email,
            password:hashedPassword
    
        })

        //saving(cloud) user and sendig response
        const user=await newUser.save() 
        res.status(200).json(user)
    }
    catch(err){
        res.status(500).json(err)
    }
    
})

//LOGIN
router.post('/login',async(req,res)=>{
    try{
        //checking user exist
        const user=await User.findOne({email:req.body.email})
        !user && res.status(404).json("user not found")

        //checking password is currect
        const validPassword=await bcrypt.compare(req.body.password,user.password)
        !validPassword && res.status(400).json("password is wrong")

        //sending response
        res.status(200).json(user)
    }
    catch(err){
        res.status(500).json(err) 
    }
})

module.exports = router