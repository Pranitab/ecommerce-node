const express = require('express');
const router = express.Router();
const UserData = require('./UserDataSchema');

//Store single user data on registretion
router.post('/storeUserData',async (req,res)=>{
    //console.log(req.body);
    const user = new UserData({
        name:req.body.name,
        _id:req.body._id,
        email:req.body.email,
        password:req.body.password,
        cartItems:req.body.cartItems
    })
    console.log(user,'user');
    try{
        const savedpost = await user.save();
        console.log('savedpost',savedpost);
        res.status(200).send({message:"User Registered Successfully"});
       // return; 
    }
    catch(err){
        //console.log("err",err);
        res.json({message:err});
    }
})

//get single userdata by passing emailId as ID
router.get('/:id', async (req,res)=>{
    console.log('id===>',req.params.id);
    try{
        const userdata = await UserData.findById(req.params.id);
        res.json(userdata);

    }
    catch(err){
        res.json({message:err})
    }
});

// check if user already registar 
router.post('/validateUser', async (req,res)=>{
    console.log(req.body);
    try{
    const validateUser = await UserData.findOne({email:req.body.email});

    if(validateUser)
    {
        console.log(validateUser)
        if(validateUser.password === req.body.password)
        {
            res.json(validateUser);
        }
        else{
            res.json({message:"Incorrect Password"})
        }
    }
    else{
        res.json({message:"User not found"});
    }
        
    }
    catch(err){
        res.json({message:err})
    }
});

//update cartItems 

router.patch('/updateCart/:id', async (req,res)=>{
    console.log('cartitems--->',req.body);
    try{
        const updatePost = await UserData.updateOne({'_id':req.params.id},{$set:{cartItems:req.body}})

        res.json(updatePost);
    }
    catch(err)
    {
        res.json({message:err});
    }
})

module.exports = router;
