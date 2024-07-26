import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

const auth = window.firebaseAuth;

// Handle form submission for login
document.getElementById('loginButton').addEventListener('click', async (event) => {
    event.preventDefault(); 

    const email = document.getElementById('emailInput').value.trim();
    const password = document.getElementById('passwordInput').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        handleLoginSuccess(rememberMe);
    } catch (error) {
        console.error('Login failed:', error);
        alert('Login failed: ' + error.message);
    }
});

function handleLoginSuccess(rememberMe) {
    const currentUser = { email: document.getElementById('emailInput').value };
    if (rememberMe) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    window.location.href = './html/summary.html'; 
}

document.getElementById('guestLogin').addEventListener('click', () => {
    const guestUser = { name: "Guest" };
    sessionStorage.setItem('currentUser', JSON.stringify(guestUser));
    localStorage.clear(); 
    window.location.href = './html/summary.html'; 
});