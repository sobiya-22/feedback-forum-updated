import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs,doc,updateDoc  } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js';
import {query, where} from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js';
// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBoVCcjL3OjhPGJ39DWrucGiCUeV_QRWDo",
    authDomain: "feedback-forum-database.firebaseapp.com",
    projectId: "feedback-forum-database",
    storageBucket: "feedback-forum-database.firebaseapp.com",
    messagingSenderId: "10446481840",
    appId: "1:10446481840:web:acb4cb1c6e167829df0e75",
    measurementId: "G-3FJKSZK4VB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to add users
export async function addUsers(user) {
    try {
        const docRef = await addDoc(collection(db, 'users'), {
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role,
            authorityType: user.authority,
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

// Function to verify users while logging in
export async function verifyUser(user) {
    const querySnapshot = await getDocs(collection(db, 'users'));
    for (const doc of querySnapshot.docs) {
        const data = doc.data();
        if (user.email === data.email && user.password === data.password) {
            return data;
        }
    }
    return null;
}

// Function to add complaint
export async function addComplaint(complaintData) {
    try {
        const docRef = await addDoc(collection(db, 'complaints'), {
            complaintID: complaintData.complaintID,
            category: complaintData.category,
            title: complaintData.title,
            description: complaintData.description,
            anonymity: complaintData.anonymous,
            userEmail:complaintData.userEmail,
            imageURL: complaintData.attachmentURL,
            date: complaintData.date,
            status: complaintData.status,
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

// Function to read all complaints
export async function readAllComplaints() {
    const querySnapshot = await getDocs(collection(db, 'complaints'));
    return querySnapshot.docs;
}

//get complaint details
export async function getComplaintDetails(cid) {
    const querySnapshot = await getDocs(collection(db, 'complaints'));
    for (const doc of querySnapshot.docs) {
        const data = doc.data();
        if (cid === data.complaintID) {
            return data;
        }
    }
    return null;
}

//send authroity
// Function to update the status of a complaint by CID
export async function changeStatus(cid, status) {
    const q = query(collection(db, 'complaints'), where('cid', '==', cid));

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        querySnapshot.forEach(async (document) => {
            const complaintRef = doc(db, 'complaints', document.id);
            try {
                await updateDoc(complaintRef, { status: status });
                console.log(`Status updated successfully for complaint with CID: ${cid}`);
            } catch (error) {
                console.error(`Error updating status for complaint with CID: ${cid}`, error);
            }
        });
    } else {
        console.error(`No complaints found with CID: ${cid}`);
    }
}





