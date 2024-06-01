
const signupForm = document.querySelector('#signupForm');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const phonenoInput = document.querySelector('#phoneno');
const passwordInput = document.querySelector('#password');
const erroediv= document.querySelector('#errordiv');
const p=document.querySelector('#p')

signupForm.addEventListener('submit', onSubmit);

async function onSubmit(e) {
  e.preventDefault();

  const userDetails = {
    name: nameInput.value,
    email: emailInput.value,
    phoneno:phonenoInput.value,
    password: passwordInput.value
  }; 
  userDetails.name = userDetails.name[0].toUpperCase() + userDetails.name.slice(1);

  try {
        const user= await axios.post('/signupuser',userDetails);
        if(user.status==208)
        {
            console.log(user.data.message)
            p.innerHTML=user.data.message;
        }
        else
        {
            console.log(user)
            alert(user.data.message)
            window.location.href="/login.html"
        }
       
        clearInputs();   
    }
 
  catch (err) {
    console.log('Error creating user:', err);
    
  }
}

function clearInputs() {
  nameInput.value = '';
  emailInput.value = '';
  phonenoInput.value = '';
  passwordInput.value = '';
}