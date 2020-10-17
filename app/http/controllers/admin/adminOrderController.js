const session = require("express-session")
const Order = require("../../../models/order")


function adminOrderController(){
    return{
        adminOrder(req,res){
            Order.find({ status: {$ne : 'completed'} }, null, {sort: {'createdAt': -1}})
            .populate('customerId', '-password').exec((err,orders)=>{
                if(req.xhr){
                    return res.json(orders)
                }else{
                    res.render('admin/orders')
                }
            })
        }

    }
}

module.exports = adminOrderController