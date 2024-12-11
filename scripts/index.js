//Feedback Forum typing
document.addEventListener('DOMContentLoaded', () => {
    const textElement = document.getElementById('title');
    const text = textElement.textContent;
    let index = 0;
    let isDeleting = false;

    function typeAndDelete() {
        if (!isDeleting) {
            if (index < text.length) {
                textElement.textContent = text.substring(0, index + 1);
                index++;
                setTimeout(typeAndDelete, 200); 
            } else {
                setTimeout(() => { isDeleting = true; typeAndDelete(); }, 1000); 
            }
        } else {
            if (index > 0) {
                textElement.textContent = text.substring(0, index - 1);
                index--;
                setTimeout(typeAndDelete, 200); 
            } else {
                isDeleting = false;
                setTimeout(typeAndDelete, 700); 
            }
        }
    }
    textElement.textContent = ''; 
    typeAndDelete(); 
});

//Navbar directions
const signUpOpen = document.querySelector('#signUpOpen');
const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
signUpOpen.addEventListener('click',()=>{
    step1.style.display = "none";
    step2.style.display = "block";
});