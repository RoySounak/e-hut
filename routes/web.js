const homeContoller = require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/customers/cartController')

function initRoutes(app){
    
    //home
    app.get('/home', homeContoller().index)
    
    //auth
    app.get('/login', authController().login)
    
    app.get('/register', authController().register)

    //customer/client/cart
    app.get('/cart', cartController().cart)

    app.post('/update-cart', cartController().update)
}

module.exports = initRoutes;