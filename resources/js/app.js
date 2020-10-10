import axios from 'axios'
import session from 'express-session'
import Noty from 'noty'

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