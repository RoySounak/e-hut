const session = require("express-session")
const Order = require('../../../models/order')
const User = require("../../../models/user")
const moment = require('moment')

function orderController(){
    return{
        orderStore(req,res){
            const { phone, address, paymentType } = req.body
            console.log(req.body)
            // check or validate all fields are there or not
            if(!phone || !address ){
                req.flash('error','All fields should be required')
                req.flash('phone',phone)
                req.flash('address',address)
                req.flash('address',paymentType)
                return res.redirect('/cart')
            }
            const order = new Order({
                customerId:req.user._id,
                items:req.session.cart.items,
                phone,
                address,
                paymentType
            })
            order.save().then(result => {
                Order.populate(result, { path: 'customerId' }, (err, placedOrder) => {
                    req.flash('success', 'Order placed successfully')
                    delete req.session.cart
                    // Emit
                    const eventEmitter = req.app.get('eventEmitter')
                    eventEmitter.emit('orderPlaced', placedOrder) 
                    return res.redirect('/customer-orders')
                })
            }).catch(err => {
                req.flash('error', 'Something went wrong')
                return res.redirect('/cart')
            })
        },
        async orderPost(req,res){
            const orders = await Order.find({ customerId: req.user._id },
                null,
                { sort: {
                    'createdAt': -1
                } })
            return res.render('customers/orders',{orders:orders, moment:moment})
        },
        //single page
        async show(req,res){
            const order = await Order.findById(req.params.id)
            if(req.user._id.toString() === order.customerId.toString()){
                return res.render('customers/singleorder',{order}) 
            }else{
                return res.redirect('/')
            }
        }      
    } 
}

module.exports = orderController
