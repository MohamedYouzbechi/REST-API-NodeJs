const express = require('express');
const studentRoute = require('./routers/student.route');
const userRoute = require('./routers/user.route')
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}))

// Security configuration
app.use((req, res, next) => {
    
    //ici on definit les urls qui ont les droit à utiliser ce server (server API)
    res.setHeader("Access-Control-Allow-Origin" , "*");
    
    //les methode/types accepté en header de requete
    res.setHeader("Access-Control-Allow-Headers" , "Origin, Accept, Content-Type, X-Requested-with, Authorization");
    
    //les actions accepté en requete
    res.setHeader("Access-Control-Allow-Methods" , "GET, POST, DELETE, OPTIONS, PATCH, PUT");
    next();
  });

app.use('/', studentRoute);

app.use('/', userRoute);






app.listen(3000, console.log('Server run in port 3000'));