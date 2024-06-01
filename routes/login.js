const express= require('express');
const router= express.Router()

const logincontroller= require('../controllers/login')
const auth= require('../middleware/auth')

const forgotpasswordcontroller= require('../controllers/forgotpassword')

router.get('/login',logincontroller.loginform)

router.post('/userloginCheck',logincontroller.checkuser)

router.post('/forgotpassword/password',forgotpasswordcontroller.forgotpassword)

router.get('/password/resetpassword/:id',forgotpasswordcontroller.resetpassword);

router.get('/password/updatepassword/:id',forgotpasswordcontroller.updatepassword)

module.exports=router;