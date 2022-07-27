import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'

export interface IUserDetails{
    _id: string;
    firstname: string;
    lastname: string;
    image: string;
}

export interface IUser{
    _id: string;
    email: string;
    password: string;
    permissions: string;
    userDetails: IUserDetails;
}

const userDetailsSchema = new mongoose.Schema({
    _id: {type: mongoose.Types.ObjectId, required: true},
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    image: {type: String, required: true}
})

const userSchema = new mongoose.Schema({
    _id: {type: mongoose.Types.ObjectId, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    permissions: {type: String, required: true},
    userDetails: {type: userDetailsSchema, required: true}
})

userSchema.statics.signup = async function (email, password, firstname, lastname){
    //validation
    if(!email || !password || !firstname || !lastname){
        throw Error('All fields must be filled')
    }
    if(!validator.isEmail(email)){
        throw Error('Email is not valid')
    }
    if(!validator.isStrongPassword(password)){
        throw Error('Password must be at least 8 characters with at least one uppercase, lowercase, number and symbol')
    }
    //check if email is unique
    const exists = await this.exists({email: email})
    if(exists){
        throw Error('Email already in use')
    } 

    //hash password
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password,salt)

    const user = this.create({
        _id: new mongoose.Types.ObjectId(),
        email: email,
        password: hash,
        permissions: 'user',
        userDetails: {
            firstname: firstname,
            lastname: lastname,
            image: "./assets/defaultImage"
        }
    })

    return user
}

userSchema.statics.login = async function (email,password) {
    //Validation
    if(!email || !password){
        throw Error('All fields must be filled')
    }

    const user = await this.findOne({email: email})
    if(!user){
        throw Error('Email or Password are incorrect')
    }
    const match = await bcrypt.compare(password, user.password)
    if(!match){
        throw Error('Email or Password are incorrect')
    }

    return user
}

export const User = mongoose.model<IUser>("user",userSchema)