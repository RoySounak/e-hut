const homeContoller = require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/customers/cartController')
const orderController = require('../app/http/controllers/customers/orderController')
const adminOrderController = require('../app/http/controllers/admin/adminOrderController')
const statusController = require('../app/http/controllers/admin/statusController')

//middleware
const guest = require('../app/http/middleware/guest')
const auth = require('../app/http/middleware/auth')
const admin = require('../app/http/middleware/admin')

function initRoutes(app){
    
    //home
    app.get('/home', homeContoller().index)
    
    //auth
    app.get('/login', guest, authController().login)    //login page

    app.post('/login', authController().postLogin) //post login route
    
    app.get('/register',guest, authController().register) //register page

    app.post('/register',authController().postRegister) //post register route

    app.post('/logout',authController().logout) //logout

    //customer/cart
    app.get('/cart',auth, cartController().cart)

    app.post('/update-cart',auth, cartController().update)

    //order routes(for customers)
    app.post('/orders', auth, orderController().orderStore)

    app.get('/customer-orders',auth, orderController().orderPost)

    //order routes(for admin)

    app.get('/admin-orders',admin, adminOrderController().adminOrder)


    //order status from admin
    app.post('/admin-orders-status',admin, statusController().orderStatusUpdate)

    //single page staus delivery order
    app.get('/customer-orders-:id', auth, orderController().show)
}

module.exports = initRoutes;