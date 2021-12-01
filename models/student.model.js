const mongoose = require('mongoose');
const joi =require('joi'); //for validation of inputs
require('dotenv').config(); // for use variables declare in .env file

const schemaValidation = joi.object({
    firstName:joi.string().alphanum().min(3).max(20).required(),
    lastName:joi.string().alphanum().min(3).max(20).required(),
    email:joi.string().email({minDomainSegments: 2, tlds: { allow: ['com', 'net', 'fr'] }}).required(),
    age:joi.number().required(),
    phone:joi.number().required()
})

let schemaStudent = mongoose.Schema({
    firstName:String,
    lastName:String,
    email:String,
    age:Number,
    phone:Number
})

var Student = mongoose.model('student', schemaStudent);
// var url='mongodb://localhost:27017/university';
var url=process.env.URL;

exports.testConnect = ()=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,{useNewUrlParser:true, useUnifiedTopology:true}).then(()=>{
            mongoose.disconnect();
            resolve('Connected !!')
        }).catch((err)=>{reject(err)})
    })
}

exports.postNewStudent = (fName, lName, email, age, phone)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,{useNewUrlParser:true, useUnifiedTopology:true}).then(()=>{

            let validation = schemaValidation.validate({firstName:fName,lastName:lName, email:email, age:age, phone:phone});
            if (validation.error) {
                mongoose.disconnect();
                reject(validation.error.details[0].message)
            }

            let student = new Student({
                firstName:fName,
                lastName:lName,
                email:email,
                age:age,
                phone:phone
            })

            student.save().then((doc)=>{mongoose.disconnect(); resolve(doc)})
                            .catch((err)=>{mongoose.disconnect(); reject(err)})
        }).catch((err)=>{reject(err)})
    })
}

exports.getAllStudents = ()=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,{useNewUrlParser:true, useUnifiedTopology:true}).then(()=>{
            return Student.find()
        }).then((docs)=>{
            mongoose.disconnect();
            resolve(docs)
        }).catch((err)=>{mongoose.disconnect(); reject(err)})
    })
}

exports.getStudentById = (id)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,{useNewUrlParser:true, useUnifiedTopology:true}).then(()=>{
            return Student.findById(id)
        }).then((doc)=>{
            mongoose.disconnect();
            resolve(doc)
        }).catch((err)=>{
            mongoose.disconnect();
            reject(err)})
    })
}

exports.deleteStudentById = (id)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,{useNewUrlParser:true, useUnifiedTopology:true}).then(()=>{
            return Student.deleteOne({_id:id})
        }).then((doc)=>{
            mongoose.disconnect();
            resolve(doc)
        }).catch((err)=>{
            mongoose.disconnect();
            reject(err)})
    })
}


exports.updateStudentById = (id, fName, lName, email, age, phone)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,{useNewUrlParser:true, useUnifiedTopology:true}).then(()=>{

            let validation = schemaValidation.validate({firstName:fName,lastName:lName, email:email, age:age, phone:phone})
            if (validation.error) {
                mongoose.disconnect();
                reject(validation.error.details[0].message)
            }

            return Student.updateOne({_id:id},{firstName:fName,lastName:lName, email:email, age:age, phone:phone})
        }).then((doc)=>{
            mongoose.disconnect();
            resolve(doc)
        }).catch((err)=>{
            mongoose.disconnect();
            reject(err)})
    })
}