const express = require('express')
const router= express.Router()
const multer= require('multer')
const upload=multer();

const messagecontroller= require('../controllers/message')

const userservicecontroller= require('../s3services/userservice')

const auth= require('../middleware/auth')

router.post('/addmessage',auth.authenticate,messagecontroller.addMessage)

router.get('/allmessage/:id',messagecontroller.getmessage)

router.post('/upload/:id',auth.authenticate,upload.single('file'),userservicecontroller.uploadFile)

module.exports=router