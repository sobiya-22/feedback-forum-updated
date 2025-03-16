
const SERVICE_ID = 'service_xvtk2fh';
const SIGNUP_TEMPLATE_ID = 'template_8wp6bnl';
const COMPLAINT_REGISTERED_TEMPLATE_ID = 'template_5ff7c0g';
const COMPLAINT_UPDATE_TEMPLATE_ID = 'template_3prr8jf';
const COMPLAINT_RESOLVED_TEMPLATE_ID = 'template_apt45ai';
// const PUBLIC_KEY = 'F15q0yMkQaLVhA3s9';
export async function sendSignUpEmail(email, name) {
    var templateParams = {
        email: email,
        name: name,
      };
      emailjs.send(SERVICE_ID, SIGNUP_TEMPLATE_ID, templateParams).then(
        (response) => {
          console.log('SignUp Successful!', response.status, response.text);
        },
        (error) => {
          console.log('Error sending signup mail', error);
        },
      );
}


export async function sendComplaintAddedEmail(name, email,complaintData) {
    var templateParams = {
        email: email,
        name: name,
        cid: complaintData.complaintID,
        authority: complaintData.category,
        title:complaintData.title,
        status: complaintData.status,
      };
      emailjs.send(SERVICE_ID, COMPLAINT_REGISTERED_TEMPLATE_ID, templateParams).then(
        (response) => {
          console.log('SignUp Successful!', response.status, response.text);
        },
        (error) => {
          console.log('Error sending signup mail', error);
        },
      );
}

export async function sendComplaintUpdate(email, status,cid,authority) {
    var templateParams = {
        email: email,
        status: status,
        cid: cid,
        authority: authority,
    };
    const SERVICE_ID2 = 'service_k65tvde';
      emailjs.send(SERVICE_ID2, COMPLAINT_UPDATE_TEMPLATE_ID, templateParams).then(
        (response) => {
          console.log('User notified with Pending status', response.status, response.text);
        },
        (error) => {
          console.log('Error sending notifying mail', error);
        },
      );
}
export async function resolvedComplaintUpdate(email, cid,authority) {
    var templateParams = {
        email: email,
        cid: cid,
        authority: authority,
    };
    const SERVICE_ID2 = 'service_k65tvde';
      emailjs.send(SERVICE_ID2, COMPLAINT_RESOLVED_TEMPLATE_ID, templateParams).then(
        (response) => {
          console.log('User notified with complaint resolution', response.status, response.text);
        },
        (error) => {
          console.log('Error sending notifying mail', error);
        },
      );
}


