const mongoose=require('mongoose')

const postSchema=new mongoose.Schema({
    
},
{timestamps:true}
)

module.exports = mongoose.model("Post",postSchema)