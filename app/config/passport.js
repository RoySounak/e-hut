const LocalStrategy = require('passport-local').Strategy
const User = require ('../models/user')
const bcrypt = require('bcrypt')

function init(passport){
    passport.use(new LocalStrategy({ usernameField: 'email' },async (email, password, done)=>{
        //Login
        //check if the email exits in database
        const user = await User.findOne({email: email})

        if(!user){
            return done(null, false, { message: "No user with this email"})
        }
        bcrypt.compare(password, user.password).then(match =>{
            if(match){
                return done(null, user, {message: "Successfully Logged in"})
            }
            return done(null, false, {message: "Wrong user name or password"})
        }).catch(err =>{
            return done(null, false, { message: "Something went wrong"})
        })
    }))
    //to store the cusrrently logged in user deatils into session
    passport.serializeUser((user, done)=>{
        done(null, user._id)
    })

    passport.deserializeUser((id, done)=>{
        User.findById(id, (err, user)=>{
            done(err, user)
        })
    })
}

module.exports = init