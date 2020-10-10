const session = require("express-session")

function cartController(){
    return{
        cart(req,res){
            res.render('customers/cart')
        },
        //after getting the food deatils and post to this route
        update(req,res){
            //for first time crating new cart and adding basic object structure 
            if(!req.session.cart){
                req.session.cart={
                    items:{},
                    totalQty:0,
                    totalPrice:0
                }
            }
            let cart = req.session.cart

            //check if items does not exit in session
            //then create the new items and update the total price and total qty
            if(!cart.items[req.body._id]){
                cart.items[req.body._id] = {
                    item : req.body,
                    qty: 1
                },
                cart.totalQty = cart.totalQty + 1,
                cart.totalPrice = cart.totalPrice + req.body.price
            }else{
                //just update the qty if the same items are there
                cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1
                cart.totalQty = cart.totalQty + 1,
                cart.totalPrice = cart.totalPrice + req.body.price
            }
            return res.json({ totalQty: req.session.cart.totalQty})
        }
        
    }   
}

module.exports = cartController