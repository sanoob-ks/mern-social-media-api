const router = require('express').Router()
const bcrypt= require('bcrypt')
const User=require('../models/User')

//handling default browser req /favicon.ico 
//router.get('/favicon.ico', (req, res) => res.status(204));

//update user
router.put('/:id',async(req,res)=>{
    if(req.body.userId===req.params.id || req.body.isAdmin){
        if(req.body.password){
            try{
                const salt =await bcrypt.genSalt(10)
                req.body.password =await bcrypt.hash(req.body.password,salt)
            }catch(err){
                return res.status(500).json(err)
            }
        }
        try{
            const user = await User.findByIdAndUpdate(req.params.id,{$set: req.body})
            res.status(200).json("Acount has been updated")
        }catch(err){
            return res.status(500).json(err)
        }
    }else{
        res.status(403).json("you can only edit your details")
    }
})

//delete user
router.delete('/:id',async(req,res)=>{
    console.log('jaaa4');
    if(req.body.userId===req.params.id || req.body.isAdmin){
        try{
            console.log('jaaa4');
            const user = await User.findByIdAndDelete(req.params.id)
            console.log('jaaa4');
            res.status(200).json("Acount has been deleted")
        }catch(err){
            return res.status(500).json(err)
        }
    }else{
        res.status(403).json("you can only delete your details")
    }
})

//get a users
router.get("/user",async(req,res)=>{
    console.log("okkkkkkkkkkk");
    const userId=req.query.userId
    const username=req.query.username
    try{
        const user =userId 
        ? await User.findById(userId)
        :await User.findOne({username:username})
        const {password,updatedAt,...other}=user._doc
        res.status(200).json(other)
    }catch(err){
        res.status(500).json(err)
    }
})

//follow a user
router.put('/:id/follow',async(req,res)=>{
    if(req.body.userId!==req.params.id){
        try{
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push:{followers:req.body.userId}})
                await currentUser.updateOne({$push:{followings:req.params.id}})
            }else{
                res.status(403).json("Already following")
            }
            res.status(200).json("User has been followed")
        }catch(err){
            return res.status(500).json(err)
        }
    }else{
        res.status(403).json("you cant follow yourself")
    }
})

//unfollow a user
router.put('/:id/unfollow',async(req,res)=>{
    if(req.body.userId!==req.params.id){ 
        try{
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull:{followers:req.body.userId}})
                await currentUser.updateOne({$pull:{followings:req.params.id}})
            }else{
                res.status(403).json("You doesnt follow this person")
            }
            res.status(200).json("User has been unfollowed")
        }catch(err){
            return res.status(500).json(err)
        }
    }else{
        res.status(403).json("you cant unfollow yourself")
    }
})

module.exports = router