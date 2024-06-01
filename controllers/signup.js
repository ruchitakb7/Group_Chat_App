const User=require('../models/signup');
const bcrypt= require('bcrypt');
const path= require('path');


exports.signupage= (req,res,next)=>{

    res.sendFile(path.join(__dirname, '..','views','signup.html'))

}

exports.signupdetails= async (req,res,next) =>{
    

    const name= req.body.name;
    const email=req.body.email;
    const phoneno= req.body.phoneno;
    const password= req.body.password;
    try{

         const user = await User.findOne({where:{email:email}})
         if(user)
         {
           return res.status(208).json({message:"User alredy Exist"})
         }
         else
         {
            const saltrounds=8;
            bcrypt.hash(password, saltrounds, async (err, hash) => {
            console.log(err)

            const signupdetail= await User.create({name:name,email:email,phoneno:phoneno,password:hash})

            return res.json({message:"Profile has been created successfully"});
          })

         }
  
           
    }
    catch(e)
    {
        res.json({error:e})
    }
}


