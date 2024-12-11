//Check for authentication on Each Page
export function authenticate() {
    if (sessionStorage.getItem('loggeduserdata') === null) {
        window.location.href = 'index.html';
    }
}