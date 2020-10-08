const express = require('express')
const app = express()
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const path = require('path')
const PORT = process.env.PORT || 3000

//assests

app.use(express.static('public'))
app.get('/home', (req,res)=>{
    res.render('home')
})

app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/js/views'))
app.set('view engine','ejs')

app.listen(PORT, () =>{
    console.log(`Listining on ${PORT}`)
})