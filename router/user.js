var express = require('express')
var router = express.Router()
const { check, validationResult } = require('express-validator')
const {signout,signup, signin,isSignedIn, getUserById, updateUser, isAuthenticated,isAdmin, searchuser, getAllUsers}=require("../controller/user")
//first name, last name, email, password, mobile no, address
router.post("/signup",
[
    check("firstname","name must be at least 3 char length").isLength({min:3}),
    check("lastname","last name must be 3 char").isLength({min:3}),
    check("email","email must be valid").isEmail(),
    check("password","must be 8 letter").isLength({min:5})
], 
signup);

router.post("/signin",
[
    check("email","email must be valid").isEmail(),
    check("password","must be 8 letter").isLength({min:5})
], 
signin);

//param
router.param("userId",getUserById);

//getallusers
router.get("/users", getAllUsers);

//update by id
router.put("/users/:userId", isSignedIn,isAuthenticated,updateUser);

//to check whether user is signinedin or not
router.get("/isSignedIn",isSignedIn, (req,res)=>{
   res.json(req.auth);
});

//serch api
router.get("/search/:text",searchuser)
router.get("/search",isSignedIn,isAuthenticated,isAdmin,searchuser)
module.exports=router;