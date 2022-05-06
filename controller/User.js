const Joi = require('@hapi/joi')
const User = require('../model/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')





exports.signUp = async (req,res) =>{
    const emailExist = await User.findOne({email: req.body.email})

    if(emailExist){
        res.status(400).send("Email already exists")
        return;
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password,salt)


    const user = new User({
        fname:req.body.fname,
        lname:req.body.lname,
        email:req.body.email,
        password: hashedPassword
    })

    try {

        const registrationSchema = Joi.object({
            fname: Joi.string().min(3).required(),
            lname: Joi.string().min(3).required(),
            email: Joi.string().min(3).required().email(),
            password: Joi.string().min(8).required()
        })

        const {error} = await registrationSchema.validateAsync(req.body)

        if(error){
            res.ststus(400).send(error.details[0].message)
            return;
        }else{
            const saveUser = await user.save()
            res.status(200).send("user created successfully")
        }


    } catch (error) {      // server error
        res.status(500).send(error)
    }

}


exports.logIn = async (req,res) => {
    // VERIFY WHETHER EMAIL EXISTS OR NOT
    const user = await User.findOne({email:req.body.email})
    if(!user) return res.status(400).send("Incorrect Email ID")

    // CHECKING IF USER PASSWORD MATCHES OR NOT
    const validatePassword = await bcrypt.compare(req.body.password, user.password)
    if(!validatePassword) return res.status(400).send("Incorrect Password")

    try{
        const loginSchema = Joi.object({
            email: Joi.string().min(3).required().email(),
            password: Joi.string().min(8).required()
        })

        const {error} = await loginSchema.validateAsync(req.body)

        if(error) return res.status(400).send(error.details[0].message)
        else{
            const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
            
            res.header("auth-token", token).send(token)
            res.send("Logged in successfully")
        }
    }catch(error){
        res.status(500).send(error)
    }
}


exports.getAllUsers = async (req,res) => {
    const allUsers = await User.find()
    try{
        res.status(200).send(allUsers)
    }catch(error){
        res.status(500).send(error)
    }
}