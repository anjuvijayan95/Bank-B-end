const express = require('express')

const cors=require('cors')

//create server app using express
const server=express()


//import dataservice
const dataService =require('./services/dataService')

//import jsonwebtoken
const jwt=require('jsonwebtoken')



//to get connection with frntend and bckend
//to connect frntend and backend url
server.use(cors({
    origin:['http://localhost:4200','http://localhost:59632']
}))


//to parse json data
server.use(express.json())

//set up port for server app
server.listen(3000,()=>{
    console.log('Server started at 3000');
})

//here we tell bank app's the backend resolve frontend request

//token varify middleware

const jwtMidWare = (req,res,next)=>{
    console.log('inside router specific middleware');
    //get token from req header
    const token=req.headers['access-token']
    console.log(token);
    //varify the token
    try{
    const data=jwt.verify(token,'gulumon')
    console.log(data);
    req.fromAcno=data.currentAcno
    console.log('Valid Token');
    next()
    }
    catch{
        console.log('invalid token');
        res.status(401).json({
            message:'Please Login'
        })
    }
}

//register api call 

server.post('/register',(req,res)=>{
    console.log('inside reg api:');
    console.log(req.body);
    dataService.register(req.body.uname,req.body.acno,req.body.pswd)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })

})



//login api call

server.post('/login',(req,res)=>{
    console.log('inside login api:');
    console.log(req.body);
    dataService.login(req.body.acno,req.body.pswd)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
    
    })


    //get balance api call
    server.get('/getBalance/:acno',jwtMidWare,(req,res)=>{
        console.log('inside getBalance api:');
        console.log(req.params.acno);
        dataService.getBalance(req.params.acno)
        .then((result)=>{
            res.status(result.statusCode).json(result)
        })
        
        })


        //credit api call
server.post('/credit',jwtMidWare,(req,res)=>{
    console.log('inside credit api:');
    console.log(req.body);
    dataService.credit(req.body.acno,req.body.amount)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
    
    })


    //fund transfer api call
server.post('/fundTransfer',jwtMidWare,(req,res)=>{
    console.log('inside fundTransfer api:');
    console.log(req.body);
    dataService.fundTransfer(req,req.body.toAcno,req.body.pswd,req.body.amount)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
    
    })

//transaction history
server.get('/history',jwtMidWare,(req,res)=>{
    console.log('inside index.js - history');
    dataService.trasactionHistory(req)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
})

//for deleting
server.delete('/deleteAcno/:acno',jwtMidWare,(req,res)=>{
    console.log('inside index.js - delete');
    console.log(req.params.acno);
    dataService.deleteMyAccount(req.params.acno)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
})
