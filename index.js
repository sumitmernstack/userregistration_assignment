require("dotenv").config();
const mongoose=require('mongoose');
const express=require('express');
const bodyParser=require("body-parser")
const cors =require('cors')
const cookieParser=require("cookie-parser")

const userRoutes= require('./router/user')

// mongodb
mongoose.
connect(process.env.DATABASE, {
useNewUrlParser: true,
useFindAndModify: false,
useCreateIndex:true,
useUnifiedTopology:true
}).then(()=>{
    console.log("database connected")
});
// express
const app=express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//Route
app.use("/api", userRoutes);

port=2000;
app.listen(port,()=> console.log('running on port no', `${port}`));