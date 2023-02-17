const express=require('express')
const dotenv=require('dotenv');
const mongoose=require('mongoose');
const  helmet= require('helmet');
const  morgan= require('morgan');
const userRoute=require('./routes/users')
const authRoute=require('./routes/auth')
const postRoute=require('./routes/posts')

const app=express()

//connecting database
mongoose.set('strictQuery', true);
dotenv.config()
mongoose.connect(process.env.MONGO_URL,()=>{
    console.log('Connected to mongoDB');
});

//middlewares
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))

//REST API
app.use("/post",postRoute) 
app.use("/",userRoute)
app.use("/auth",authRoute)


 
app.listen(3001,()=>{
    console.log('Server started running!');
})