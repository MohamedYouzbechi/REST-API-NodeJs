const route = require('express').Router();
const studentModel = require('../models/student.model');
const jwt = require('jsonwebtoken');
require('dotenv').config();


route.get('/', (req, res, next)=>{
    studentModel.testConnect().then((msg)=>{res.send(msg)}).catch((err)=>{res.send(err)})
})

// var privateKey = 'this is my private key blablabla'
var privateKey = process.env.PRIVATE_KEY

verifyToken=(req,res,next)=>{
    let token = req.headers.authorization
    if (!token) {
        res.status(400).json({msg:'Acces rejected !!'})
    }

    try {
        jwt.verify(token,privateKey)
        next()
    } catch (e) {
        res.status(400).json({msg:e})
    }
}

// var secretKey = 'winopapa';
// var clientKey ='123456789';
var secretKey =process.env.SECRET_KEY
var clientKey =process.env.CLIENT_KEY

verifiySecretClient = (req, res, next)=>{
    let sk = req.params.sk;
    let ck = req.params.ck;

    if (sk==secretKey && ck == clientKey) { //in DB every client has her secretKey and clientKey 
        next()
    }else{
        res.status(400).json({error:"you can't access to this rout because you don't sent me client key and secret key"})
    }
}

route.post('/addStudent/:sk/:ck', verifiySecretClient, verifyToken, (req, res, next)=>{
    studentModel.postNewStudent(req.body.firstName, req.body.lastName, req.body.email, req.body.age, req.body.phone)
    .then((doc)=>{res.send(doc)})
    .catch((err)=>res.send({error:err}))
})

route.get('/students/:sk/:ck', verifiySecretClient, verifyToken, (req, res, next)=>{
    let token = req.headers.authorization
    let user = jwt.decode(token, {complete:true})
    studentModel.getAllStudents()
    .then((docs)=>{res.status(200).json({students:docs, user:user})})
    .catch((err)=>res.status(400).json(err))
})

route.get('/student/:id/:sk/:ck', verifiySecretClient, verifyToken, (req, res, next)=>{
    studentModel.getStudentById(req.params.id)
    .then((doc)=>{res.status(200).json(doc)})
    .catch((err)=>res.status(400).json(err))
})

route.delete('/student/:id/:sk/:ck', verifiySecretClient, verifyToken, (req, res, next)=>{
    studentModel.deleteStudentById(req.params.id)
    .then((doc)=>{res.status(200).json(doc)})
    .catch((err)=>res.status(400).json(err))
})

route.patch('/student/:id/:sk/:ck', verifiySecretClient, verifyToken, (req, res, next)=>{
    studentModel.updateStudentById(req.params.id, req.body.firstName, req.body.lastName, req.body.email, req.body.age, req.body.phone)
    .then((doc)=>{res.status(200).json(doc)})
    .catch((err)=>res.status(400).json(err))
})

module.exports=route;