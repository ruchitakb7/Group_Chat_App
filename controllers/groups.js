const User= require('../models/signup')
const Message= require('../models/message')
const Group=require('../models/groups')
const Usergrp=require('../models/usergrp')


exports.creategrp=async(req,res,next)=>{
    const grpname= req.body.grpname

    try{
        const group= await Group.create({grpname:grpname,createdby:req.user.id})
        await Usergrp.create({username:req.user.name,userId:req.user.id,groupId:group.id,grpname:grpname})
        res.status(200).json({group})
    }
    catch(e)
    {
        console.log(e)
        res.json({e})
    }
}
 

exports.getallgrp=async(req,res,next) =>{
   // const userid= req.params.id
    try{
        const group = await Usergrp.findAll({where:{userId:req.user.id}})
        const admin= await Group.findAll({where:{createdby:req.user.id}})

        res.json({usergroup:group,admin:admin})
    }
    catch(e)
    {
        console.log(e)
        res.json({e})
    }
}


exports.addMember=async(req,res,next)=>{
    const {email,grpname,grpid}=req.body
    try{
        const user= await User.findOne({where:{email:email}})
        if(user)
        {
            const response= await Usergrp.create({username:user.name,grpname:grpname,groupId:grpid,userId:user.id})
         // console.log(response)
           res.json({response})
        }
        else{
            throw new Error('user not exist')
        }
      

    }catch(e)
    {
        console.log(e)
        res.status(404).json({e})
    }
}

exports.deleteGrp= async(req,res,next)=>{
    const groupId=req.params.id
    try{
        const x=  Group.destroy({where:{id:groupId}})
        const y=  Usergrp.destroy({where:{groupId:groupId}})
        const z=  Message.destroy({where:{groupId:groupId}})

        await Promise.all([x,y,z])        
        res.json({success:true})               
    }
    catch(e)
    {
        console.log(e)
        res.json('something went wrong')
    }
}

exports.removeMember= async(req,res,next)=>{
   const email=req.body.email;
   
   const groupId = req.body.groupId
    try{

        const user= await User.findOne({where:{email:email}})
        
        if(user)
        {
            const response= await Usergrp.destroy({where:{userId:user.id,groupId:groupId}})
            res.json({success:true,user:user})
        }
        else{
            throw new error('User not found')
        }

    }
    catch(e)
    {
        console.log(e)
        res.json(e)
    }
}

exports.changeAdmin=async(req,res,next)=>{
    const email= req.body.email
    const groupId= req.body.groupId

    try{

        const user = await User.findOne({where:{email:email}})
        if(!user)
        return res.json({msg:"No user Registered with that email"});
        
            const member= await Usergrp.findOne({where:{userId:user.id,groupId:groupId}})
            if(!member)
            return res.json({msg:"No user Member of this group with entered email id"});
            
                const admin= await Group.update({createdby:user.id},{where:{id:groupId}})
                return res.json({msg:"Admin changed",user:user})
            
           
    }
    catch(e)
    {
        console.log(e)
        res.json({e})

    }
}


exports.getallMembers= async(req,res,next)=>{
    const grpid= req.params.id
    try{
        const member= await Usergrp.findAll({where:{groupId:grpid}})
        const admin= await Group.findOne({where:{id:grpid}})
        res.json({memberlist:member,admin:admin.createdby})
    }
    catch(e)
    {
        console.log(e)
        res.json(e)
    }
} 