const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const Data = require('./Data/Data');
const cors = require("cors");
const userRoute = require('./UserData/UserData');
const path =  require('path');
require('dotenv/config');
//TODO: add a stipe key
const stripe = require('stripe')(process.env.STRIPE_SECURITY_KEY);
const { v4: uuidv4 } = require('uuid');

app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors());

app.get('/Products',(req,res)=>{
    //console.log(Data);
        res.send(Data);
})

app.post('/payment',(req,res)=>{
    const {product, token} = req.body;
    console.log('PRODUCT',req.body);
    //console.log('PRICE',product.price);
    const idempotencykey = uuidv4();
    return stripe.customers.create({
      email: token.email,
      source: token.id
    }).then(customer=>{
       stripe.charges.create({
         amount:product.price*100,
         currency:'usd',
         customer:customer.id,
         receipt_email:token.email,
         description: `purchase of ${product.name}`,
         shipping:{
           name:token.card.name,
           address:{
             country:token.card.adress_country
           }
         }
       },{idempotencykey})
    })
    .then(result=>res.status(200).json(result))
    .catch(err=>console.log(err))
})
app.use('/',userRoute);
mongoose.connect(process.env.MONGODB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true},()=>{
    console.log('connected to DB!!!');
});

mongoose.connection.on('connected', function () {
    console.log('Mongoose connected');
});

mongoose.connection.on('error', function (err) {
  console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose disconnected');
});
//serve static assets if in production
if(process.env.NODE_ENV==='production')
{
  //set static folder
  app.use(express.static('ecommerce-node/build'));
  app.get('*',(req,res)=>{
      res.sendFile(path.resolve(__dirname,'ecommerce-node','build','index.html'))
  })
}

const port = process.env.PORT || 5000;
app.listen(port,()=>{console.log('server start at '+port)});
