const User= require("../modal/User");
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
const { check, validationResult } = require('express-validator');


//signup(register)
exports.signup=(req, res)=>{
    const errors= validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).json({   
			 error: errors.array()[0].msg
        })
    }
    const user= new User(req.body)
    user.save((err,user)=>{
        if(err){
            return res.status(400).json({
                err:"not able to save user in db"
            });
        }
        res.json({user,  message:"data saved succesfully"  
          
        } );
    });
};


//signin(login)
exports.signin=(req, res)=>{ 
    const {email,password }=req.body;
    const errors= validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).json({
		   	 error: errors.array()[0].msg
        })
    }
    //first checking the email is present or not then after,
    // if present then we are able to fetch it user id too.
    User.findOne({email}, (err,user)=>{
        if(err || !user){
             return  res.status(400).json({
                error:"user mail dosent exist"
            })
        }
        //checking authentication from user models
        //if the given password is wrong then showing error message
        if(!user.autheticate(password)){
             return   res.status(401).json({
                error:"email and password do not match"
            })
        }
        // hear my secret key is mernStack,
        //put this token into cookies
        
        const  token = jwt.sign({ _id:user._id }, process.env.SECRET)

        //creating cookiers here, put the above token into user cookies
        //cookies are just like key vale pair so "token",token
        res.cookie("token",token,{expire:new Date() + 9999});
        //sending responce to frontend
        //pulling out values from user
        const {_id,firstname, email}=user;
        return res.json({token, user:{_id,firstname, email}});
    });
};

//param
exports.getUserById=(req,res,next,id) => {
    User.findById(id).exec((err,user) => {
        if(err || !user){
            return res.status(400).json({
                error:"no such user found"
            })
        }
        req.profile=user;
        next();
    });
};
//getallusers

exports.getAllUsers=(req,res)=>{
    User.find().exec((err,users)=>{
       if(err || !users){
           return res.status(400).json({
               error:"no user found"
           }) 
       }
        return res.json(users);
   })
}
//updateuser

exports.updateUser=(req,res)=>{
    User.findByIdAndUpdate(
        {_id:req.profile._id},
        {$set:req.body},
        {new:true, useFindAndModify:false},
        (err,user)=>{
            if(err){
                return res.status(400).json({
                    error:"you are not allowed to update"
                })
            }
            user.salt=undefined;
            user.encry_password=undefined;
            res.json(user);
        })
}

//search
exports.searchuser=(req,res)=>{
  const searchFiled=req.query.firstname;
    User.find({firstname:{$regex:searchFiled,$options:'$i'}})
    .then((result)=>{
        res.status(200).json(result)
    })
}
/*exports.searchuser=(req,res)=>{
    const text=req.body.text;
    console.log(text);
    var regex=new RegExp(req.params.text,"i");
    User.find({text:regex})
    .then((result)=>{
        res.status(200).json(result)
    })
    
}*/

//protected route 
exports.isSignedIn= expressJwt({
    secret: process.env.SECRET,
    userProperty:"auth",
    algorithms: ['HS256']
});


exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED....."
    });
  }
  next();
};


//isadmin
exports.isAdmin=(req,res,next)=>{
    if(req.profile.role===0){
        return res.status(403).json({
            error:"you are not admin , Access denied" 
        });
    }
    next();
}


