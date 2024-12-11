export function generateRandomNumber() { 
    let randomNumber = Math.floor(Math.random() * 10000000000); 
    let randomString = randomNumber.toString(); 
    while (randomString.length < 10) { 
        randomString = '0' + randomString; 
    } 
    return 'C' + randomString;
}