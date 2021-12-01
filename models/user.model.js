const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
require('dotenv').config();

let schemaUser = mongoose.Schema({
    userName:String,
    email:String,
    password:String
})

// var url='mongodb://localhost:27017/university';
var url=process.env.URL

let User = mongoose.model('user', schemaUser)

exports.register=(userName,email,password)=>{
    // test email if exist (true go to login) (false add this user to users collection)
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
                return User.findOne({email:email})
        }).then((user)=>{
            if(user){
                mongoose.disconnect()
                reject('this email is exist')
            }else{
                bcrypt.hash(password,10).then((hPassword)=>{
                    let user=new User({
                        userName:userName,
                        email:email,
                        password:hPassword
                    })
                    user.save().then((user)=>{
                        mongoose.disconnect()
                        resolve(user)
                    }).catch((err)=>{
                        mongoose.disconnect()
                        reject(err)
                    })
                }).catch((err)=>{mongoose.disconnect();reject(err)})
            }    
        }).catch((err)=>{reject(err)})
    })
}

// var privateKey = 'this is my private key blablabla'
var privateKey=process.env.PRIVATE_KEY

exports.login=(email,password)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
           return User.findOne({email:email})
        }).then((user)=>{
            if(user){
                bcrypt.compare(password,user.password).then((verif)=>{
                    if(verif){
                        let token = jwt.sign({id:user._id, userName:user.userName}, privateKey, {expiresIn:'1h'})
                        mongoose.disconnect()
                        resolve(token)
                        // jwt.decode()
                    }else{
                        mongoose.disconnect()
                        reject('invalid password')
                    }
                }).catch((err)=>{reject(err)})
            }else{
                mongoose.disconnect()
                reject("we don't have this email in our database")
            }
        }).catch((err)=>{reject(err)})
    })
}