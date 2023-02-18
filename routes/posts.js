const router=require('express').Router()
const { json } = require('express')
const Post=require('../models/Post')
const User=require('../models/User')

//create a post
router.post('/',async(req,res)=>{
    const newPost=new Post(req.body)
    try {
        const savedPost= await newPost.save()
        res.status(200).json(savedPost)
    } catch (err) {
        res.status(500).json(err) 
    }
})

//update a post
router.put('/:id',async(req,res)=>{
    try {
        const post=await Post.findById(req.params.id)
        if(post.userId===req.body.userId){
            await post.updateOne({$set:req.body})
            res.status(200).json("Post has been updated")
        }else{
        res.status(403).json("You can update only your post")
        }
    } catch (err) {
        res.status(500).json(err)
    }
})

//delete a post
router.delete('/:id',async(req,res)=>{
    try {
        const post=await Post.findById(req.params.id)
        if(post.userId===req.body.userId){
            await post.deleteOne()
            res.status(200).json("Post has been deleted")
        }else{
        res.status(403).json("You can delete only your post") 
        }
    } catch (err) {
        res.status(500).json(err)
    }
})

//like / dislike a post
router.put('/:id/like',async(req,res)=>{
    try {
        const post=await Post.findById(req.params.id)
        if(!post.like.includes(req.body.userId)){
            await post.updateOne({$push:{like:req.body.userId}})
            res.status(200).json("post has been liked")
        } else{
            await post.updateOne({$pull:{like:req.body.userId}})
            res.status(200).json("post has been disliked")
        }
    } catch (err) {
        res.status(500).json(err)
    }
})

//get timeline post
router.get('/timeline/:userId',async(req,res)=>{
    try {
        const currentUser=await User.findById(req.params.userId)
        const userPost= await Post.find({userId:currentUser._id})
        const friendPost=await Promise.all(
            currentUser.followings.map((friendId)=>{
                return Post.find({userId:friendId})
                /*return each post to friendPost array (Array inside an Array, 
                each inner array for each friend)*/
            })
        )
        res.status(200).json(userPost.concat(...friendPost))
    } catch (err) {
        console.log(err.message)
        res.status(500).json(err)
    }
})

//get user's all post
router.get('/profile/:username',async(req,res)=>{
    try {
        const user=await User.findOne({username:req.params.username})
        const userPosts= await Post.find({userId:user._id})
        res.status(200).json(userPosts)
    } catch (err) {
        console.log(err.message)
        res.status(500).json(err)
    }
})

//get a post
router.get('/:id',async(req,res)=>{
    try {
        const post=await Post.findById(req.params.id)
        res.status(200).json(post)
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router;