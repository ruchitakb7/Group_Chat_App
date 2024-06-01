const User= require('../models/signup')
const Message= require('../models/message')
const Group=require('../models/groups')
const Usergrp=require('../models/usergrp')
const AWS= require('aws-sdk')
const UUID= require('uuid')
const muletr= require('multer')
const dotenv= require('dotenv')
dotenv.config()
const id=UUID.v4();

exports.uploadFile=async(req,res,next)=>{
  const groupId=req.params.id
  
   const userId=req.user.id;
    console.log('comesuploadfile');
    try {
       
        const filename="File"+userId+"/"+Date.now()+Math.random();
        console.log(filename);

        const fileUrl=await uploadToS3(req.file,filename);
        console.log(fileUrl)

        const user=await Message.create({
          msg:fileUrl,
          name:req.user.name,
          groupId,
          userId,
          type:'file'
        });
       
        console.log(user)

        const userFile={
            message:fileUrl,
            name:req.user.name,
            userId
        }

        res.status(201).json({userFile,success:true,msg:user})  
    }
     catch (error) {
        console.log(error);
        res.status(500).json({msg:'Error uploading file',error})
    }

}

async function uploadToS3(data, filename) {

   
      const BUCKET_NAME = 'expenseru';
      const IAM_USER_KEY = process.env.Access_key_ID;
      const IAM_USER_SECRET = process.env.Secret_access_key;

   
  
    const s3= new AWS.S3({
        accessKeyId:IAM_USER_KEY,
        secretAccessKey:IAM_USER_SECRET

    });

  
const file=data;

const key=`uploads/${id}-${file.originalname}`
console.log(key)

      const params = {
        Bucket:BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ACL: 'public-read',
      };

      console.log(params)
     
      return new Promise((resolve, reject) => {
        s3.upload(params, (err, data) => {
          if (err)
          {
            console.log('Error Uploading File', err);
            reject(err);
          } 
          else 
          {
            console.log('File Uploaded Successfully:', data.Location);
            resolve(data.Location);
          }
        });
      });
  }
  