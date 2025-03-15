import { authenticate } from "./utils/auth-check.js";
import { addComplaint } from "./firebase.js";
import { uploadImageToCloudinary } from './utils/cloudinary.js';
import { generateRandomNumber } from "./utils/generateComplaintID.js";
// Verifying the user
authenticate();

// Get details of the user logged in
const data = JSON.parse(sessionStorage.getItem('loggeduserdata'));

if (data) {
    document.querySelector('.user-details .side-elements').innerHTML =
        `
            <i class="fi fi-rs-circle-user"></i>
            <p> ${data.email}</p>
        
        `;
    document.querySelector('.user-details .user-role').innerHTML +=
        `
            <p>${data.role}</p>`;
} else {
    console.error("No user data found in session storage.");
    alert("User data not found. Please log in again.");
}


//Logout button
const logoutbutton = document.querySelector('.logout');
logoutbutton.addEventListener(('click') , ()=> {
    sessionStorage.removeItem('loggeduserdata');
    window.location.reload();
});


//adding complaint to the database
const compSubmit = document.querySelector('.js-submit');
compSubmit.addEventListener('click', async() => {
const compCategoryInput = document.querySelector('.js-type').value;
const compTitleInput = document.querySelector('.js-title-complaint').value;
const compDescInput = document.querySelector('.js-complaint').value;
const compImgInput = document.querySelector('#imageUpload');
const compAnonymousInput = document.querySelector('.js-anonymity').checked;
const userEmail = data.email;
const complaintID = generateRandomNumber();
//date when the complaint is registered 
let now = new Date();
// Format the date
let formattedDate = now.toLocaleDateString('en-GB', {
  day: 'numeric',
  month: 'numeric',
  year: 'numeric'
});
const compDate = formattedDate;
//image uploding to the cloudinary storage adn getting the url to add to firebase
let ImgURL=null;
if (compImgInput.files.length > 0) {
    ImgURL = await uploadImageToCloudinary(compImgInput.files[0]);
}
    let complaintData = {
    complaintID: complaintID,
    category: compCategoryInput,
    title: compTitleInput,
    description: compDescInput,
    attachmentURL: ImgURL,
    anonymous: compAnonymousInput,
    userEmail: userEmail,
    date: compDate,
    status: 'Not Resolved'
};
    if (!compCategoryInput || !compTitleInput || !compDescInput) {
        alert('Please fill in all required fields: Complaint Type, Title, and Complaint.');
        return;
    }
    addComplaint(complaintData);
    console.log('Complaint submitted! Complaint ID: '+complaintID);
});

//a popup when complaint is submitted!
const submitBtn = document.querySelector('.js-submit');
submitBtn.addEventListener('click', () => {
    // alert('complaint submitted!');
    document.getElementById('js-popup').style.display = 'flex';
    
});

const greatBtn = document.querySelector('.close-submit-popup');
greatBtn.addEventListener('click', () => {
    document.getElementById('js-popup').style.display = 'none';
});
