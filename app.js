const express= require('express');
const app= express();
const http =require ("http");
const socketIO= require('socket.io')

const server = http.createServer(app);
const io= socketIO(server,{ cors : { origin : '*'}});

io.on("connection",(socket)=>{
    console.log('websocket connected');
    socket.on("message",(msg,groupId)=>{
        console.log('sendmsg')
        socket.broadcast.emit("message",msg,groupId) });
    socket.on("update",(userId)=>{ socket.broadcast.emit("update",userId)});
    socket.on("deletegrp",()=>{ socket.broadcast.emit("deletegrp",)});
  
})


const path=require('path');
const cors= require('cors')
const dotenv = require('dotenv');
dotenv.config()


const seq = require('./util/database.js');
const User= require('./models/signup.js');
const Message=require('./models/message.js');
const Usergrp= require('./models/usergrp.js')
const Group= require('./models/groups.js')
const Forgotpassword = require('./models/forgotpassword.js')


app.use(cors({origin:"*",}))
app.use(express.json());
app.use(express.static('public')) 
app.use(express.static(path.join(__dirname, "views"))) 


const signuprouterFile= require('./routes/signup.js');   
app.use(signuprouterFile);
const loginrouterFile= require('./routes/login.js')
app.use(loginrouterFile)
const messageRouterfile=require('./routes/message.js')
app.use(messageRouterfile)
const GroupRouterFile= require('./routes/group.js')
app.use(GroupRouterFile)


User.hasMany(Message)
Message.belongsTo(User)

User.belongsToMany(Group,{through:Usergrp})
Group.belongsToMany(User,{through:Usergrp})

Group.hasMany(Message)
Message.belongsTo(Group)

User.hasMany(Forgotpassword)
Forgotpassword.belongsTo(User)

seq.sync()
.then(res=>
   { 
    server.listen(process.env.port);  
})                               
.catch((e)=>{
   console.log(e)

})
