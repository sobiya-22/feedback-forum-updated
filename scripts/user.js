import { authenticate } from "./utils/auth-check.js";
import { addComplaint } from "./firebase.js";
import { uploadImageToCloudinary } from './utils/cloudinary.js';
import { generateRandomNumber } from "./utils/generateComplaintID.js";
import { eachUserComplaints } from './firebase.js';
import { getComplaintDetails } from "./firebase.js";
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


//view complaints js
//my complaints 
document.querySelector('#my-complaints').addEventListener('click', async () => {
    
    const rows = document.querySelector(".complaint-list .main-table .body");
    const complaintHeading = document.querySelector('.complaint-heading-top .complaint-heading');
    complaintHeading.innerHTML = 'My Complaints';
    document.querySelector('.complaint-form').style.display = 'none';
    document.querySelector('.complaint-box').style.display = 'block';
    
    let retrievedComplaints = await eachUserComplaints(data.email);
    let newrows = '';
    retrievedComplaints.forEach((doc) => {
        const each = doc.data();
        let newRow = ` <tr> 
            <td>${each.complaintID}</td>  
            <td>${each.date}</td> 
            <td>${each.category}</td> 
            <td>${each.title}</td> 
            <td>${each.status}</td>
            <td><button class="view-details">View</button></td>
            </tr>`;
        newrows += newRow;
    });
    rows.innerHTML += newrows;
});
//for opening the form again
document.querySelector('#add-complaint').addEventListener('click', () => {
    document.querySelector('.complaint-box').style.display = 'none';
    document.querySelector('.complaint-form').style.display = 'block';
    
});

//for resolved complaints
document.querySelector('#resolved-complaints').addEventListener('click', async () => {
    const complaintHeading = document.querySelector('.complaint-heading-top .complaint-heading');
    const rows = document.querySelector(".complaint-list .main-table .body");
    complaintHeading.innerHTML = 'Resolved Complaints';
    let retrievedComplaints = await eachUserComplaints(data.email);
    let newrows = '';
    rows.innerHTML = '';
    retrievedComplaints.forEach((doc) => {
        const each = doc.data();
        if (each.status === 'Resolved') {
            let newRow = ` <tr> 
            <td>${each.complaintID}</td>  
            <td>${each.date}</td> 
            <td>${each.category}</td> 
            <td>${each.title}</td> 
            <td>${each.status}</td> 
            <td><button class="view-details">View</button></td>
            </tr>`;
        newrows += newRow;
        }
        
    });
    rows.innerHTML = newrows;
});


const popup = document.getElementById('popup');
const popupDetails = document.getElementById('popup-details');
const closeBtn = document.getElementById('close-btn');

// Attaching the event listener to the table body
document.querySelector(".complaint-list .main-table .body").addEventListener("click", async (event) => {
    if (event.target.classList.contains("view-details")) {
        const row = event.target.closest("tr");

        const cid = row.cells[0].innerText;
        const complaintInfo = await getComplaintDetails(cid);
         

        const imageButton = complaintInfo.imageURL
            ? `<button id='open-popup' class='image-view'>View Image</button>`
            : `<button id='open-popup' class='image-view' disabled>No Image</button>`;

        popupDetails.innerHTML = `
            <strong>Complaint ID: </strong> ${cid}<br>
            <strong>Email: </strong> ${complaintInfo.userEmail}<br>
            <strong>Category: </strong> ${complaintInfo.category}<br>
            <strong>Title: </strong> ${complaintInfo.title}<br>
            <strong>Description: </strong>${complaintInfo.description}<br>
            <strong>Date: </strong>${complaintInfo.date}<br>
            <strong>Attachments: </strong> ${imageButton}<br>
            <strong>Status: </strong><span class="status-change">${complaintInfo.status}</span><br>
        `;

        popup.style.display = "flex";

        // Handling Image Popup
        const IMGpopup = document.getElementById("image-popup");
        const popupImage = IMGpopup.querySelector("img");
        const closePopupButton = document.getElementById("close-popup");
        const openPopupButton = document.getElementById("open-popup");

        if (complaintInfo.imageURL) {
            openPopupButton.addEventListener("click", () => {
                popupImage.src = complaintInfo.imageURL;
                IMGpopup.style.display = "flex";
            });

            closePopupButton.addEventListener("click", () => {
                IMGpopup.style.display = "none";
                popupImage.src = "";
            });

            IMGpopup.addEventListener("click", (e) => {
                if (e.target === IMGpopup) {
                    IMGpopup.style.display = "none";
                    popupImage.src = "";
                }
            });
        }
    }
});


// Close the popup when the close button 
// is clicked or when clicked outside the popup
closeBtn.addEventListener('click', () => {
    popup.style.display = 'none';
});

popup.addEventListener('click', (e) => {
    if (e.target === popup) {
        popup.style.display = 'none';
    }
});


//active button of complaints color change 
document.addEventListener("DOMContentLoaded", () => {
    const complaintButtons = document.querySelectorAll(".complaint");

    complaintButtons.forEach(button => {
        button.addEventListener("click", function (e) {
            e.preventDefault();

            // Remove 'active' class from all buttons
            complaintButtons.forEach(btn => btn.classList.remove("active"));

            // Add 'active' class to the clicked button
            this.classList.add("active");
        });
    });
});
