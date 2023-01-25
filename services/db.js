const mongoose=require('mongoose')
mongoose.set('strictQuery', false);

mongoose.connect('mongodb://localhost:27017/bank',()=>{
    console.log('mongodb connect successully');
})

//model for users
const User = mongoose.model('User',{
    username:String,
    acno:Number,
    password:String,
    balance:Number,
    transaction:[]
})

//Export this model
module.exports={
    User
}