const db = require('./db')
//register

//import jwt
const jwt=require('jsonwebtoken')


const register=(uname,acno,pswd)=>{
    console.log('Inside register function in dataService');
    //check acno is already in mongodb - db.user.findOne()
   return db.User.findOne({
        acno:acno
    }).then((result)=>{
        console.log(result);
        if(result){
            return {
                statusCode:403,
                message:'Account already exist...'
            }
        }else{
            //to add new user in node
            const newUser = new db.User({
                username:uname,
                acno:acno,
                password:pswd,
                balance:0,
                transaction:[]
            })
            //to save new user in mongodb
            newUser.save()
            return {
                statusCode:200,
                message:'Registration successfull !..'
            }
        }

    })
}

//login

const login=(acno,pswd)=>{
    console.log('inside login fun body');
    //check acno pswd in mongodb
    return db.User.findOne({
        acno,
        password:pswd
    }).then((result)=>{
            if(result){
                //generete token
                const token=jwt.sign({
                    currentAcno:acno
                },'gulumon')
                return{
                    statusCode:200,
                    message:'login successfull !..',
                    username:result.username,
                    currentAcno:acno,
                    token
                }
            }
            else{
                return{
                    statusCode:404,
                    message:'Invalid Account / Password'
                }
            }
    })
}

//getBalance fun
const getBalance=(acno)=>{
    return db.User.findOne({
        acno
    }).then((result)=>{
        if(result){
            return{
                statusCode:200,
                balance:result.balance
            }
        }
        else{
            return{
                statusCode:404,
                message:'Invalid Account'
            }
        }
    })
}

//credit

const credit = (acno,amt)=>{
    let amount=Number(amt)
    return db.User.findOne({
        acno
    }).then((result)=>{
        if(result){
            result.balance+=amount
            //to transaction array
            result.transaction.push({
            type:'CREDIT',
            fromAcno:acno,
            toAcno:acno,
            amount
        })
            //to update and save in mongodb
            result.save()
            return {
                statusCode:200,
                message:`${amount} successfully deposite`
            }
        }
        else{
            return{
                statusCode:404,
                message:'Invalid Account'
            }
        }
    })
}

const fundTransfer=(req,toAcno,pswd,amt)=>{
    let amount =Number(amt)
    let fromAcno=req.fromAcno
    console.log(typeof(fromAcno));
    console.log(pswd)
    return db.User.findOne({
    acno:fromAcno,
    password:pswd
    }).then((result)=>{
        console.log(result);
        if(fromAcno==toAcno){
            return{
                statusCode:401,
                message:'Cant transfer to own account'
            }
        }
        if(result){
            let fromAcnoBalance=result.balance
            if(fromAcnoBalance>=amount){
                result.balance=fromAcnoBalance-amount
                //about toAcno
                return db.User.findOne({
                    acno:toAcno
                }).then((creditData)=>{
                    if(creditData){
                        creditData.balance+=amount
                        //to transaction array
                        creditData.transaction.push({
                            type:'CREDIT',
                            fromAcno,
                            toAcno,
                            amount
                        })
                        creditData.save();
                        //to transaction array
                        result.transaction.push({
                            type:'DEBIT',
                            fromAcno,
                            toAcno,
                            amount
                        })
                        result.save();

                        return{
                            statusCode:200,
                            message:"Amount Transfer successfully"
                        }
                    }else{
                        return{
                            statusCode:401,
                        message:'Invalid Credit Account Number'
                        }
                        
                    }
                })
            }
            else{
                return{
                    statusCode:403,
                    message:'Insufficient Balance'
                }
            }

        }
        else{
            return{
                statusCode:404,
            message:'Invalid Account Number / Password'
            }
            
        }
    })
}


const trasactionHistory=(req)=>{
    let acno=req.fromAcno
    return db.User.findOne({
        acno
    }).then((result)=>{
        if(result){
            return{
                statusCode:200,
                transaction:result.transaction
            }
        }
        else{
            return{
            statusCode:401,
            message:'Invalid Account Number'
            }
            
        }
    })
}

const deleteMyAccount=(acno)=>{
    return db.User.deleteOne({
        acno
    })
    .then((result)=>{
        if(result){
            return{
                statusCode:200,
                message:"Account deleted successfully"
            }

        }else{
            return{
                statusCode:401,
                message:"Invalid Account"
            }
        }
    })
}

// export
module.exports={register,login,getBalance,credit,fundTransfer,trasactionHistory,deleteMyAccount}