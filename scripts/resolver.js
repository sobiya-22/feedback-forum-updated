import { authenticate } from "./utils/auth-check.js";
import { readAllComplaints } from "./firebase.js";
import { getComplaintDetails } from "./firebase.js";
import { changeStatus } from "./firebase.js";
import { sendComplaintUpdate } from "./utils/sendEmail.js";
// Verifying the user
authenticate();


// Get details of the user logged in
const data = JSON.parse(sessionStorage.getItem('loggeduserdata'));

if (!data) {
    console.error("No user data found in session storage.");
    alert("User data not found. Please log in again.");
}

document.querySelector('.user-details .side-elements').innerHTML +=
    `
        <p> ${data.email}</p>`;

document.querySelector('.user-details .user-role').innerHTML +=
    `
            <p>${data.role}</p>`;

document.querySelector('.authority-type').innerHTML = data.role;

//Logout button
const logoutbutton = document.querySelector('.logout');
logoutbutton.addEventListener(('click'), () => {
    sessionStorage.removeItem('loggeduserdata');
    window.location.reload();
});

document.addEventListener('DOMContentLoaded', async () => {
    const complaintHeading = document.querySelector('.complaint-heading');
    const rows = document.querySelector(".complaint-list .main-table .body");
    complaintHeading.innerHTML = 'All Complaints';
    let retrievedComplaints = await readAllComplaints();
    let newrows = '';
    retrievedComplaints.forEach((doc) => {
        const each = doc.data();
        let newRow = ` <tr> 
            <td>${each.complaintID}</td> 
            <td>${each.userEmail}</td> 
            <td>${each.date}</td> 
            <td>${each.category}</td> 
            <td>${each.title}</td> 
            <td><button class="view-details">View</button></td>
            </tr>`;
        newrows += newRow;
    });
    rows.innerHTML += newrows;
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
            <div class='send-discard-btn'>
                <button class='green-btn'>Send Authority</button>
                <button class='red-btn'>Discard</button>
            </div>
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
        // const user = await getUserWithEmail(data.userEmail);
        const greenBtn = document.querySelector('.send-discard-btn .green-btn');

        // **Disable button if status is already "Pending"**
        if (complaintInfo.status === "Pending" || complaintInfo.status==='Resolved') {
            greenBtn.disabled = true;
            greenBtn.innerHTML = 'Sent to Authority';
            greenBtn.style.opacity = '0.8';
            greenBtn.style.cursor = 'not-allowed';
        } else {
            greenBtn.addEventListener('click', async () => {
                if (data.role === 'Admin') {
                    await changeStatus(cid, 'Pending');
                    sendComplaintUpdate(complaintInfo.userEmail, complaintInfo.status, cid, complaintInfo.category);
                    // Update the UI
                    document.querySelector('.status-change').innerHTML = 'Pending';
                    greenBtn.innerHTML = 'Sent to Authority';
                    greenBtn.disabled = true;
                    greenBtn.style.opacity = '0.8';
                    greenBtn.style.cursor = 'not-allowed';
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


//all complaints 
document.querySelector('#all-complaints').addEventListener('click', async () => {
    const complaintHeading = document.querySelector('.complaint-heading');
    const rows = document.querySelector(".complaint-list .main-table .body");
    complaintHeading.innerHTML = 'All Complaints';
    let retrievedComplaints = await readAllComplaints();
    let newrows = '';
    retrievedComplaints.forEach((doc) => {
        const each = doc.data();
        let newRow = ` <tr> 
            <td>${each.complaintID}</td> 
            <td>${each.userEmail}</td> 
            <td>${each.date}</td> 
            <td>${each.category}</td> 
            <td>${each.title}</td> 
            <td><button class="view-details">View</button></td>
            </tr>`;
        newrows += newRow;
    });
    rows.innerHTML += newrows;
});

//for pending complaints
document.querySelector('#pending-complaints').addEventListener('click', async () => {
    const complaintHeading = document.querySelector('.complaint-heading');
    const rows = document.querySelector(".complaint-list .main-table .body");
    complaintHeading.innerHTML = 'Pending Complaints';
    let retrievedComplaints = await readAllComplaints();
    let newrows = '';
    rows.innerHTML = '';
    retrievedComplaints.forEach((doc) => {
        const each = doc.data();
        if (each.status === 'Pending') {
            let newRow = ` <tr> 
            <td>${each.complaintID}</td> 
            <td>${each.userEmail}</td> 
            <td>${each.date}</td> 
            <td>${each.category}</td> 
            <td>${each.title}</td> 
            <td><button class="view-details">View</button></td>
            </tr>`;
        newrows += newRow;
        }
        
    });
    rows.innerHTML = newrows;
});

//for resolved complaints
document.querySelector('#resolved-complaints').addEventListener('click', async () => {
    const complaintHeading = document.querySelector('.complaint-heading');
    const rows = document.querySelector(".complaint-list .main-table .body");
    complaintHeading.innerHTML = 'Resolved Complaints';
    let retrievedComplaints = await readAllComplaints();
    let newrows = '';
    rows.innerHTML = '';
    retrievedComplaints.forEach((doc) => {
        const each = doc.data();
        if (each.status === 'Resolved') {
            let newRow = ` <tr> 
            <td>${each.complaintID}</td> 
            <td>${each.userEmail}</td> 
            <td>${each.date}</td> 
            <td>${each.category}</td> 
            <td>${each.title}</td> 
            <td><button class="view-details">View</button></td>
            </tr>`;
        newrows += newRow;
        }
        
    });
    rows.innerHTML = newrows;
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




