var mongoose = require("mongoose");
const crypto = require("crypto");
//const uuidv1 = require("uuid/v1");
const { v4: uuidv4 } = require('uuid');
//first name, last name, email, password, mobile no, address
var userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true
    },
    lastname: {
      type: String,
      maxlength: 32,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },
    encry_password: {
      type: String,
      required: true
    },
    salt: String,
   address: {
      type: String,
      maxlength: 200,
      trim: true
    },
  mobile: {
        type: Number,
      }
    ,role: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

userSchema.virtual("password")
  .set(function(password) {
    this._password = password;
    this.salt = uuidv4(); 
    this.encry_password = this.securePassword(password);
  })
  .get(function() {
    return this._password;
  });


    //has 2 function autheticate and securePassword 
  userSchema.methods = {
    autheticate: function(plainpassword) {
      return this.securePassword(plainpassword) === this.encry_password;
    },

    securePassword: function(plainpassword) {
      if (!plainpassword) return "";
      try {
        return crypto
          .createHmac("sha256", this.salt)
          .update(plainpassword)
          .digest("hex");
      } catch (err) {
        return "";
      }
    }
};

module.exports = mongoose.model("User", userSchema);
