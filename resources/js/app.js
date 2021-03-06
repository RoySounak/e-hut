import axios from 'axios'
import session from 'express-session'
import Noty from 'noty'
import {initAdmin} from './admin'
import moment from 'moment'

let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector('#cartCounter')

function updateCart(food){
    axios.post('/update-cart',food).then(res =>{
        cartCounter.innerText = res.data.totalQty
        new Noty({
            type:'success',
            timeout:1000,
            text: "Item added to cart"
        }).show();
    }).catch(err=>{
        new Noty({
            type:'error',
            timeout:1000,
            text: "Oopss!!! Something went wrong"
        }).show();
    })
}

addToCart.forEach((btn)=>{
    btn.addEventListener('click',(e)=>{
        let food =JSON.parse(btn.dataset.food) 
        updateCart(food)
    })
})




//Change Order Status for single page order
let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)
let time = document.createElement('small')

function updateStatus(order) {
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let stepCompleted = true;
    statuses.forEach((status) => {
       let dataProp = status.dataset.status
       if(stepCompleted) {
            status.classList.add('step-completed')
       }
       if(dataProp === order.status ) {
            stepCompleted = false
             time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
            if(status.nextElementSibling){
                status.nextElementSibling.classList.add('current')
            }
       }
    })

}

updateStatus(order);

//Socket 
let socket = io()


//Join 
if(order){
    socket.emit('join',`order_${order._id}`)
}
let adminAreaPath = window.location.pathname

if(adminAreaPath.includes('admin')){
    //admin
    initAdmin(socket)
    socket.emit('join', 'adminRoom')
} 

socket.on('orderUpdated',(data)=>{
    const updatedOrder = {...order}   //copy the order with using three dots 
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
    new Noty({
        type:'success',
        timeout:1000,
        text: "Order Updated"
    }).show();
})