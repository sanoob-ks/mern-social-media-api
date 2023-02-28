const express=require('express')
const dotenv=require('dotenv');
const mongoose=require('mongoose');
const  helmet= require('helmet');
const  morgan= require('morgan');
const userRoute=require('./routes/users')
const authRoute=require('./routes/auth')
const postRoute=require('./routes/posts')
const conversationRoute=require('./routes/conversations')
const messageRoute=require('./routes/messages')
const path=require('path')
const multer  = require('multer')

const app=express()

//connecting database
mongoose.set('strictQuery', true);
dotenv.config()
mongoose.connect(process.env.MONGO_URL,()=>{
    console.log('Connected to mongoDB');
});

app.use(express.static(path.join(__dirname, 'public')))

//middlewares
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images/') 
    },
    filename: function (req, file, cb) {
      cb(null, req.body.name)
    }
  })

const upload = multer({ storage: storage })
app.post('/upload', upload.single('file'), function (req, res) {
    console.log("upload api");
    try {
        res.status(200).json("File uploaded successfully")
    } catch (err) {
        console.log(err);    
    }
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
  })


//REST API
app.use("/conversation",conversationRoute) 
app.use("/message",messageRoute) 
app.use("/post",postRoute) 
app.use("/auth",authRoute) 
app.use("/",userRoute)

 
app.listen(3001,()=>{
    console.log('Server started running!');
}) 