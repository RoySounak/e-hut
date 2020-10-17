require('dotenv').config()
const express = require('express')
const app = express()
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const mongoose = require('mongoose')
const {mongourl} = require('./app/config/keys')
const path = require('path')
const PORT = process.env.PORT || 3000
const session = require('express-session')
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo')(session)
const passport = require('passport')



//Database monog connection

mongoose.connect(mongourl,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify: true,
    useCreateIndex:true
})
const connection = mongoose.connection;

connection.once('Open',()=>{
    console.log("MongoDB is connected");
}).catch(err =>{
    console.log("MongoDB is Not connected",err);
});


//template engine
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/js/views'))
app.set('view engine','ejs')

//Mongo Session Store

let mongoStore = new MongoDbStore({
    mongooseConnection: connection,
    collection: 'sessions'
})
//session config

app.use(session({
    secret: process.env.COOKIES_SECRET,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: { maxAge: 1000*60*60*24 } //assign for 24 hours
  }))

//passport config
const passportInit = require('./app/config/passport')

passportInit(passport)

app.use(passport.initialize())

app.use(passport.session())


//flash messages
app.use(flash())

//enable json 
app.use(express.json())

//enable url encoder for auth
app.use(express.urlencoded({extended: false}))

//assests

app.use(express.static('public'))

//global middleware
app.use((req,res,next)=>{
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})

require('./routes/web')(app)


//port
app.listen(PORT, () =>{
    console.log(`Listining on ${PORT}`)
})