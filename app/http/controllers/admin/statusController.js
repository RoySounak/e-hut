const Order = require('../../../models/order')

function statusController(){
    return{
        orderStatusUpdate(req,res){
            Order.updateOne({_id:req.body.orderId},{ status: req.body.status }, (err,data)=>{
                if(err){
                    req.flash('error','Something is going wrong')
                    return res.redirect('/admin-orders')
                }
                //emit event
                const eventEmitter = req.app.get('eventEmitter')
                eventEmitter.emit('orderUpdated',{ id: req.body.orderId, status:req.body.status }) 
                res.redirect('/admin-orders')
            })
        }
    }
}

module.exports = statusController