import { addUsers,verifyUser } from "./firebase.js";

//Showing cards
document.addEventListener('DOMContentLoaded', () => {
    const flipCard = document.getElementById("flipCard");
    const hash = window.location.hash;

    if (hash === "#signup") {
        flipCard.style.transform = "rotateY(180deg)"; // Show Sign Up card
    } else {
        flipCard.style.transform = "rotateY(0deg)"; // Default to Login card
    }

    const flipToSignup = document.getElementById("flipToSignup");
    const flipToLogin = document.getElementById("flipToLogin");

    flipToSignup.addEventListener("click", (e) => {
        e.preventDefault();
        flipCard.style.transform = "rotateY(180deg)";
        history.pushState(null, "", "#signup");
    });

    flipToLogin.addEventListener("click", (e) => {
        e.preventDefault();
        flipCard.style.transform = "rotateY(0deg)";
        history.pushState(null, "", "#login");
    });
});


const step1 = document.getElementById("step1");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const roleInput = document.getElementById("role");
const nextBtn = document.getElementById("nextBtn");


//signup next page for password input
const step2 = document.getElementById("step2");
const authorityDropdown = document.getElementById("authorityDropdown");
const authorityInput = document.getElementById("authority");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const signUpBtn = document.getElementById("signUpBtn");
const backbtn = document.getElementById('back-btn');
nextBtn.addEventListener("click", (e) => {
    e.preventDefault();

    if (!nameInput.value || !emailInput.value || !roleInput.value) {
        alert("Please fill in all required fields.");
        return;
    }

    step1.style.display = "none";
    step2.style.display = "block";
    if (roleInput.value === "Authority") {
        authorityDropdown.style.display = "block";
    } else {
        authorityDropdown.style.display = "none";
    }
});

//checking the required details
signUpBtn.addEventListener("click", async(e) => {
    e.preventDefault();

    if (roleInput.value === "Authority" && !authorityInput.value) {
        alert("Please select an authority type.");
        return;
    }
    if (!passwordInput.value || passwordInput.value !== confirmPasswordInput.value) {
        alert("Passwords do not match.");
        return;
    }
    //add users to database
    const newUser = {
        email: emailInput.value,
        name: nameInput.value,
        password: passwordInput.value,
        role: roleInput.value,
        authority: roleInput.value === "Authority" ? authorityInput.value : null
    };
    try {
        await addUsers(newUser);
        alert("Signup successful! Form data submitted.");
    }
    catch (error) {
        console.error("Error adding user: ", error);
        alert("Signup failed. Please try again.");
    }
    alert("Signup successful! Form data submitted.");
});


//logging the user
const login_email = document.getElementById('f-email');
const login_password = document.getElementById('f-password');

document.querySelector('.flip-card-front .login-btn').addEventListener('click', async (e) => {
    e.preventDefault();
    const loginUser = {
        email: login_email.value,
        password: login_password.value
    };
    const loggedUser = await verifyUser(loginUser);
    if (loggedUser) {
        alert("Login successful! Redirecting...");
        sessionStorage.setItem('loggeduserdata', JSON.stringify(loggedUser));
        if (loggedUser.role === 'Student' || loggedUser.role === 'Faculty') {
            window.location.href = './user.html';
        }
        else if(loggedUser.role === 'Admin'){
            window.location.href = './resolver.html';
        }
        else if (loggedUser.role === 'Authority') {
            window.location.href = './authorityPage.html';
        }
    } else {
        alert('Invalid Email or Password. Try Again!');
    }
});


//back button on signup block
backbtn.addEventListener('click', () => {
    step1.style.display = "block";
    step2.style.display = "none";
})


