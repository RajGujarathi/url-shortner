var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const config = require('config');
const secratekey=config.get('secratekey')
const User=require('../models/user')

const errorhanderler = (err) => {
    console.log(err.message, err.code)
    let error = { email: '', password: '' };

    // invalide eamil
    if (err.message.includes('Must be a valid email address')) {
        error.email = 'that email Address is not registred'
    }
    //invalid password
    if (err.message.includes('Please enter Password')) {
        error.password = 'That password is incorrect'
    }
    if (err.message.includes('Please enter your name')) {
        error.password = "Plese enter user name"
    }

    if (err.message.includes('Invalid Email')) {
        error.email = 'that email Address is not registred'
    }
    //invalid password
    if (err.message.includes('Incorrect Password')) {
        error.password = 'That password is incorrect'
    }

    //validation error

    if (err.message.includes('user validation failed')) {
        Object.values(err.error).forEach(({ properties }) => {
            error[properties.path] = properties.message
        })
    }

    //duplicate email error
    if (err.message.includes('SequelizeUniqueConstraintError')) {
        error.email = 'This is already in use'
        return error;
    }
    return error;
}

const maxage = 3 * 24 * 60 * 60;
console.log(config.secratekey)
const createtoken = (id,userName) => {
    return jwt.sign({ id,userName }, secratekey, { expiresIn: maxage })
}


module.exports.register= async (req, res) => {
    //const { username,email, password } = req.body;
    try {
        const user = await User.create({ userName:req.body.username,email: req.body.email, password: req.body.password })
        const token = createtoken(user._id,user.userName)
        console.log(token)
        //res.cookie('jwt', token, { httpOnly: true, maxage })
        //res.render('index')
        res.status(201).json({ user: user._id, token: token })
    }
    catch (err) {
        const error = errorhanderler(err)
        console.log(err)
        //   //     console.log(error)
        res.status(400).json({ error })
   }
}

module.exports.login_post = async (req, res) => {
    try {let userName=req.body.userName
        let password=req.body.password
        console.log(userName+' '+password)
        const user=await User.findOne({ where:{ userName } });
        
        if(user){
            const auth=await bcrypt.compare(password,user.password)
            console.log(auth)
            if(auth){
                const token = createtoken(user._id,user.userName)
                res.status(200).json({ user:user ,token:token})
             }
            else{
          throw Error('Incorrect Password')
          }
         } 
        
    
    else{
        throw Error('Invalid Email')
      }
    }
    catch (err) {
        console.log(err)
        const error = errorhanderler(err)
        console.log(error)
        res.status(400).json({ error })
    }
}