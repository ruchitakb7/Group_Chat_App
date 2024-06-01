const chatbox= document.querySelector('.container')
const chatform= document.querySelector("#chatform")
const message= document.querySelector('#message')
const sendbtn= document.querySelector('#sendbtn')
const grouplist= document.querySelector('#grplist')
const groupchat = document.querySelector('#grouptitle')
const groupdetails= document.querySelector('#groupdetails')
sendbtn.addEventListener('click', sendMessage)
const logoutbtn= document.querySelector('#logoutbtn')
const loginbtn= document.querySelector('#loginbtn')
const msginput= document.querySelector('#msginput')

const socket = io.connect("http://localhost:3001");


window.addEventListener('DOMContentLoaded',refresh)

function refresh()
{
    getallGroup()

}
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  }


  
  socket.on("message", (msg,groupId) => { 

    if(groupId==localStorage.getItem('groupId') &&  msginput.style.display=='block')
    {
       console.log('client')
        printmsg(msg)
    }
    })
  
  socket.on('update',(userId)=>{  
    const token= parseJwt(localStorage.getItem('token'))
    if(userId==token.id)
    {
        document.getElementById('chat').style.display="none"
        getallGroup()
    }  
  }) 

  socket.on("deletegrp", () => { 
    document.getElementById('chat').style.display="none"
    localStorage.removeItem('groupId')
    getallGroup()
 });

  

async function sendMessage(e)
{
    e.preventDefault();
    const token= localStorage.getItem('token')
    const groupId = localStorage.getItem('groupId');

    try{
        if (document.getElementById('file').files[0]) {

            
            let file = document.getElementById('file').files[0];
            let formData = new FormData();
            formData.append("file", file)
            console.log(formData);
      
           const headers = {
              "Authorization": token,
             'Content-Type': 'multipart/form-data'     
           }
      
            const res = await axios.post(`/upload/${groupId}`, formData, {headers})
            console.log(res.data.userFile);
            document.getElementById('file').value=""
      
          printmsg(res.data.msg,token)
    
           socket.emit("message",res.data.msg,groupId); 
        }
    else{
           const msgdata={
                 msg:message.value,
                 groupId:localStorage.getItem('groupId')
                }
              const res= await axios.post('/addmessage',msgdata, {headers: { "Authorization": token }})
              message.value=""
           
              printmsg(res.data.msg,token)
              
              socket.emit("message",res.data.msg,groupId);
        }
    }
    catch(e)
    {
        alert('message could not send try again letter')
        console.log(e)
    }   
} 

function printmsg(res)
{
  
    console.log(res)
    const token= localStorage.getItem('token')
    const parsetoken= parseJwt(token)
       
        if(res.userId==parsetoken.id)
        {
            const para= document.createElement('p')
            if(res.type=='text')
            {
                para.innerHTML=`you : ${res.msg}`
            }
            else{
                para.innerHTML=`you:<a href="${res.msg}"> click to see download</a>`
            }
            
            chatbox.appendChild(para)
            para.style.color="red"
        }
        else{
            const para= document.createElement('p')
            if(res.type=="text")
            para.innerHTML=`${res.name} : ${res.msg}`
           else
           {
            
            para.innerHTML=`${res.name} :<a href="${res.msg}"> click to see download</a>`
           }
          
            chatbox.appendChild(para)
            para.style.color="purple"

        }
        

}


async function messagedata()
{
   grpId= localStorage.getItem('groupId')
    token= localStorage.getItem('token')
    if(token)
    {
        try{
            const response= await axios.get(`/allmessage/${grpId}`)
           console.log(response.data.grpname)
          // archive(response.data.msg)
            messagedisplay(response.data.msg,response.data.grpname)

        }
        catch(e)
        {
            console.log(e)
        }
    }
    else{
        alert('you must be log in first')
    }
}

 function messagedisplay(response,grpname)
{
    
    document.getElementById('chat').style.display="block"

   groupchat.innerHTML=`<h3>${grpname}</h3>`
    chatbox.innerHTML=``;
  
    const token= localStorage.getItem('token')
    const parsetoken= parseJwt(token)

     response.forEach(res => {

        let x=new Date(res.createdAt)
        let y= new Date()
     
       const h= Math.abs(x.getTime() - y.getTime()) / 3600000;
      // console.log(h)
       if(h.toFixed()<24)
       {
            console.log(res.msg)
       
       
        if(res.userId==parsetoken.id)
        {
            const para= document.createElement('p')
            if(res.type=='text')
            {
                para.innerHTML=`you : ${res.msg}`
            }
            else{
                para.innerHTML=`you:<a href="${res.msg}"> click to see download</a>`
            }
            
            chatbox.appendChild(para)
            para.style.color="red"
        }
        else{
            const para= document.createElement('p')
            if(res.type=="text")
            para.innerHTML=`${res.name} : ${res.msg}`
           else
           {
            
            para.innerHTML=`${res.name} :<a href="${res.msg}"> click to see download</a>`
           }
          
            chatbox.appendChild(para)
            para.style.color="purple"

        }
    }
     })
}
function creategrp()
{
    if(localStorage.getItem('token'))
    document.getElementById('grpform').style.display='block'
    else
    {
        alert('User not logged into the system')
        window.location.href="/login.html"
    }
    
}





async function grpcreated()
{

    const token=localStorage.getItem('token')
    const grpname= document.getElementById('grpname').value
    if(grpname)
    {
            
            try{
                const response= await axios.post('/creategrp',{grpname},{headers: { "Authorization": token }});
              //  console.log(response)
              document.getElementById('grpname').value=""
              document.getElementById('grpform').style.display='none'
                 getallGroup()
          
            }
            catch(e)
            {
                document.getElementById('grpname').value=""
                console.log(e)
                alert(e)
            }
    }
    else{
        alert('Fill Feild Correctly')
        
    } 

}
async function getallGroup()
{
    const token=localStorage.getItem('token')
    
    if(token)
    {
        
        
        loginbtn.style.display="none";
        logoutbtn.style.display="block"
        const parsetoken=parseJwt(token)
        document.getElementById('user').innerHTML=`${parsetoken.name}`

        try{
            const grpinfo= await axios.get('/getallgroup',{headers: { "Authorization": token }})
            console.log(grpinfo.data.admin)
            grpdisplay(grpinfo.data.usergroup,grpinfo.data.admin,parsetoken.id)
        }
        catch(e)
        {
            console.log(e)
        }
    }    
}
function logoutpage()
{
    localStorage.removeItem('token')
    localStorage.removeItem('groupId')
    localStorage.removeItem('groupname')
    
    window.location.href="/login.html"
}

function loginpage()
{
    window.location.href="/login.html"
}

 function grpdisplay(groups,admin,userid)
{
    
    grouplist.innerHTML=""
    groups.forEach(res =>{
    
        const para= document.createElement('p')
        
        para.innerHTML=`${res.grpname}`;
        const chatbtn= document.createElement('button')
        chatbtn.textContent='OpenChat'

        const archive= document.createElement('button')
        archive.textContent='Archive Chat'
        
        para.appendChild(chatbtn)
        para.appendChild(archive)
        grouplist.appendChild(para)

        chatbtn.addEventListener('click',()=>{                    //to see message
          //  document.querySelector('.footer').style.display='block'
            msginput.style.display='block'
            localStorage.setItem('groupId',res.groupId)
           
            messagedata()
                 
        })

        archive.addEventListener('click',()=>{                    //to see full chat message
            //  document.querySelector('.footer').style.display='block'
              msginput.style.display='none'
              localStorage.setItem('groupId',res.groupId) 
              archivechat()
                   
          })

         let x;
           admin.forEach(a=>{
             if(a.id==res.groupId)
             x=a.id
           })
           
        if(x)
        {
            const adduser= document.createElement('button')
            adduser.textContent='Add User'
            const deletegrp=document.createElement('button')
            deletegrp.textContent='Delete Group';
            const remove=document.createElement('button')
            remove.textContent='Remove Member';
            const admin=document.createElement('button')
            admin.textContent='Change Admin';
            
            para.appendChild(adduser)
            para.appendChild(deletegrp)
            para.appendChild(remove)
            para.appendChild(admin)

            adduser.addEventListener('click',()=>{
                const email=prompt('enter email id')
                addMember(email,res)
            })

            deletegrp.addEventListener('click',()=>{deleteGroup(res)})

            remove.addEventListener('click',()=>{
                const email=prompt('Enetr email id of Member')
                removeMember(email,res)})

            admin.addEventListener('click',()=>{
                const email=prompt('Enetr email id of Member')
                changeAdmin(email,res.groupId)
            })    
    
        } 

    })

}


async function addMember(email,grp)
{
    const info={
        email:email,
        grpname:grp.grpname,
        grpid:grp.groupId
    }
    try{
        const group= await axios.post('/addmember',info)
        socket.emit('update',group.data.response.userId)
        
    }
    catch(e)
    {
        alert(e)
    
    }
}

async function deleteGroup(res)
{
    try{

        const response= await axios.delete(`/deletegrp/${res.groupId}`)
        document.getElementById('chat').style.display="none"
        localStorage.removeItem('groupId')
        getallGroup()
        
       socket.emit('deletegrp')

    }
    catch(e)
    {
        alert(e)
    }    

}

async function removeMember(email,res)
{

    const data={
        email:email,
        groupId:res.groupId
    }
    try{

        const response= await axios.post('/group/removemember',data)
     
      //  window.location.href='/chat.html'

        socket.emit('update',response.data.user.id)

    }
    catch(e)
    {
        alert(e)
    }
}

async function changeAdmin(email,groupId)
{
    const data={
        email:email,
        groupId:groupId
    }
    try{
         
        const res= await axios.post('/group/changeadmin',data)
        alert(res.data.msg)
       getallGroup()
       socket.emit('update', res.data.user.id)
    }
    catch(e)
    {
       alert(e)
    }
   

}
async function archivechat()
{
   grpId= localStorage.getItem('groupId')
    token= localStorage.getItem('token')
    if(token)
    {
        try{
            const response= await axios.get(`/allmessage/${grpId}`)
           console.log(response.data.grpname)
         
            archive(response.data.msg,response.data.grpname)

        }
        catch(e)
        {
            console.log(e)
        }
    }
    else{
        alert('you must be log in first')
    }
}

function archive(response,grpname)
{
    
    document.getElementById('chat').style.display="block"

    groupchat.innerHTML=`<h3>${grpname}</h3>`
    chatbox.innerHTML=``;
    const token= localStorage.getItem('token')
    const parsetoken= parseJwt(token)

     response.forEach(res => {

        if(res.userId==parsetoken.id)
        {
            const para= document.createElement('p')
            if(res.type=='text')
            {
                para.innerHTML=`you : ${res.msg}`
            }
            else{
                para.innerHTML=`you:<a href="${res.msg}"> click to see download</a>`
            }
            
            chatbox.appendChild(para)
            para.style.color="red"
        }
        else{
            const para= document.createElement('p')
            if(res.type=="text")
            para.innerHTML=`${res.name} : ${res.msg}`
           else
           {
            
            para.innerHTML=`${res.name} :<a href="${res.msg}"> click to see download</a>`
           }
          
            chatbox.appendChild(para)
            para.style.color="purple"

        }
    
     })
   
}

async function getallMember()
{
   const id= localStorage.getItem('groupId')
   
    try{

        const membrs= await axios.get(`/group/getallmember/${id}`)

        console.log(membrs.data)
        
        groupmember(membrs.data.memberlist ,membrs.data.admin)
        
    }
    catch(e)
    {
        console.log(e)
    }
   
}

function groupmember(member,admin)
{
    console.log(member)
    document.getElementById('modal').innerHTML=""
    
    
    member.forEach(user =>{
        const li= document.createElement('li')
        li.innerHTML=`${user.username}`
        document.getElementById('modal').appendChild(li)
    })
    document.getElementById('modal').innerHTML=``

}



