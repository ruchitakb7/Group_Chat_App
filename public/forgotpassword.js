const forgotpasswordForm = document.querySelector("#forgotpasswordForm")
const email = document.querySelector('#email');

forgotpasswordForm.addEventListener('submit',forgotpassword)


async function forgotpassword(e)
{
    e.preventDefault();
    const user={
        email:email.value
    }
   
    try{
        const getemail=await axios.post('/forgotpassword/password',user);
        if(getemail)
        {
            alert("link has been sent on your email id")
        }
        email.value="";

    }
    catch(e)
    {
        alert('User Does not Exist')
        console.log(e)
    }
    email.value="";
}