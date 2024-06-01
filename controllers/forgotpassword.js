const User=require('../models/signup');

const Sib = require('sib-api-v3-sdk');

const UUID = require('uuid');

const bcrypt = require('bcrypt');

const dotenv = require('dotenv');

dotenv.config();

const path=require('path')

const forgotPasswordRequest = require('../models/forgotpassword');


exports.forgotpasswordForm = async (req, res) => {
    res.sendFile(path.join(__dirname,'..','views','forgotpassword.html'))
}


exports.forgotpassword = async (req, res, next) => {

    try {
        const email= req.body.email

        const user = await User.findOne({ where: { email: email } });

        if (user) {

            const id= UUID.v4();

            await forgotPasswordRequest.create({id,isActive:true,userId:user.id})
            .catch((e)=>{
                throw new Error(e)
            })
           
            const client = Sib.ApiClient.instance;
            const apiKey = client.authentications['api-key'];
            apiKey.apiKey = process.env.api_key

            const sender = {
                email: process.env.myemail,
                name: 'Admin'
            }

            const receivers = [{
                email: email
            }]

            let tranEmailApi = new Sib.TransactionalEmailsApi()

            tranEmailApi.sendTransacEmail({
                subject: "reset password email", sender,
                to: receivers,
                htmlContent: `<h1>click on the link below to reset the password</h1><br>
                <a href="http://localhost:${process.env.port}/password/resetpassword/${id}">Reset password</a>`
                   
            })
                .then((result) => {
                    console.log(result);
                    return res.status(202).json({
                        success: true,
                        message: "reset password link has been sent to your email",
                    });
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        else {
            throw new Error("User doesn't exist");
        }

    }

    catch (err) {
        res.status(404).json({err})
    }
}


exports.resetpassword= async(req,res,next) =>{

    const id =  req.params.id;
    const forgetpassword=await forgotPasswordRequest.findOne({where : { id:id}});
  

        if(forgetpassword){
            await forgotPasswordRequest.update({ isActive: false},{where:{id:forgetpassword.id}});
            res.status(200).send(`<html>  
                                   <head>
                                   <link rel="stylesheet" href="/css/login.css">
                                   </head>
                                   <body>
                                   <div class="header">
                                   <center><h1>Reset Password</h1> </center>
                                    </div>

                                   <div id="forgotpassword">
                                    <form action="/password/updatepassword/${id}" method="get" >
                                    <label for="newpassword">New Password :</label>
                                    <input name="newpassword" type="password" required></input>
                                        <br><br><br>
                                    <button>Reset Password</button>
                                        <div>
                                    </form>
                                    <script>
                                        async function formsubmitted(e){
                                            e.preventDefault();
                                            try{
                                                const res=await axios.get('/password/updatepassword/${id}');
                                                alert(res.data.message)
                                                window.location.href="/login.html"

                                            }
                                           catch(e){alert(e)}   
                                        }
                                    </script>
                                    <body>
                                </html>`
                                )
            res.end()

        }

}

exports.updatepassword= async(req,res,next) =>{

    try{
        const id= req.params.id;
       // const newpsw= req.query;
        const {newpassword} = req.query;
       

        const forgotpassworddata = await forgotPasswordRequest.findOne({where:{id:id}})
         const userdata = await User.findOne({where:{id:forgotpassworddata.userId}})
         if(userdata)
         {
            
            let saltRound=8;
            bcrypt.hash(newpassword,saltRound,async(err,hash)=>{
                if(err) { 
                    console.log(err)
                    throw new Error(err)
                }
               
                const updateuserdata= await User.update({password:hash},{where:{id:userdata.id}});
            
              // return res.status(201).json({message:'password has been updated',success:true})
               res.redirect('/login.html')
            
            })
         }
         else{
           return res.status(404).json({ error: 'No user Exists', success: false})    
         }

    }catch(e){console.log(e)}

}




