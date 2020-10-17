const User = require('../../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport')
const session = require("express-session")


function authController(){
    return{
        login(req,res){
            res.render('auth/login')
        },
        register(req,res){
            res.render('auth/register')
        },
        postLogin(req,res,next){
            passport.authenticate('local',(err, user, info)=>{
                if(err){
                    req.flash('error', info.message)
                    return next(err)
                }
                if(!user){
                    req.flash('error', info.message)
                    return res.redirect('/login')
                }
                req.logIn(user, (err)=>{
                    if(err){
                        req.flash('error', info.message)
                        return next(err)
                    }
                    
                    return res.redirect('/home')
                })
            })(req, res, next)
        },
        async postRegister(req,res){
            const { name, email, password} = req.body

            //check or validate all fields are there or not
            if(!name || !email || !password){
                req.flash('error','All fields should be required')
                req.flash('name',name)
                req.flash('email',email)
                return res.redirect('/register')
            }

            //if email exists in database
            User.exists({email: email}, (err,result)=>{
                if(result){
                    req.flash('error','Already taken')
                    req.flash('name',name)
                    req.flash('email',email)
                    return res.redirect('/register')
                }
            })
            //bcrypt password
            const hashPassword = await bcrypt.hash(password,10)

            //save new user
            const user = new User({
                name,
                email,
                password: hashPassword
            })
            user.save().then(()=>{
                return res.redirect('/home')
            }).catch(err =>{
                req.flash('error','Something gone wrong')
                return res.redirect('/register')
            })
        },
        logout(req, res){
            req.logout()
            return res.redirect('/login')
        }
    }
}

module.exports = authController