const session = require("express-session")
const Order = require('../../../models/order')
const user = require("../../../models/user")
const moment = require('moment')

function orderController(){
    return{
        orderStore(req,res){
            const { phone, address } = req.body
            //console.log(req.body)
            // check or validate all fields are there or not
            if(!phone || !address ){
                req.flash('error','All fields should be required')
                req.flash('phone',phone)
                req.flash('address',address)
                return res.redirect('/cart')
            }
            const order = new Order({
                customerId:req.user._id,
                items:req.session.cart.items,
                phone,
                address
            })
            order.save().then(()=>{
                req.flash('success','Thanks to place the order')
                delete req.session.cart
                return res.redirect('/customer-orders')
            }).catch(err =>{
                req.flash('error','Something gone wrong')
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
        }      
    } 
}

module.exports = orderController
