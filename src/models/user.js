const mongoose = require("mongoose")
const validator = require('validator')
const bcrypt =require("bcryptjs")
const jwt = require("jsonwebtoken")
const Task = require("./task")

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true

    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true,
        validator(value){
            if(validator.isEmail(value)){
                throw new Error("Email is not valid")
            }

        }

    },
    age:{
        type: Number,
        default:0,
        validate(value){
            if (value < 0){
                throw new Error('Age must be a positive no.')
            }


        }

    },
    tokens:[{
        token:{
            type:String,
            required:true
        }

    }],
    password:{
        type:String,
        required:true,
        minlength:7,
        trim:true,
        validate(value){
            if (validator.contains(value.toLowerCase(),"password")){
                throw new Error(" password shouldnot contain'password'")
            }
        }

    },avatar:
    {
        type:Buffer
    }

    
    
},{
    timestamps:true

})

userSchema.virtual("tasks",{
    ref:'Task',
    localField:"_id",
    foreignField:"owner"

})


userSchema.methods.generateAuthTokens = async function (){
    const user = this
    const token = jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
    
}

userSchema.methods.toJSON =  function(){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.statics.findByCredentials = async (email,password) =>{
    const user = await User.findOne({email})
    if(!user){
        throw new Error("Unable to login")
    }

    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error("Unable to login")
    }

    return user
}




//Hash the plain text password
userSchema.pre('save',async function(next){
    const User =this

    if(User.isModified("password")){
        User.password= await bcrypt.hash(User.password,8)
    }

    

    next()

})

//Delete user task besfore user is removed
userSchema.pre("remove",async function (next){
    const user = this
    await Task.deleteMany({owner: user._id})
    next()

})
 
const User = mongoose.model("User",userSchema)

module.exports = User