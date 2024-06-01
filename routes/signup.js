const express= require('express');
const router= express.Router()

const controllerpage= require('../controllers/signup');


router.get('/signup',controllerpage.signupage);

router.post('/signupuser',controllerpage.signupdetails);



module.exports=router;