import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";


const auth = window.firebaseAuth;


document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById('login-form')) {
        const emailInput = document.getElementById('emailInput');
        const passwordInput = document.getElementById('passwordInput');
        const rememberMeCheckbox = document.querySelector("#rememberMe");

        
        if (localStorage.getItem('rememberMe') === 'true') {
            emailInput.value = localStorage.getItem('email');
            passwordInput.value = localStorage.getItem('password');
            rememberMeCheckbox.checked = true;
        }

        
        setupPasswordToggle(passwordInput);
    }
});


document.getElementById('loginButton').addEventListener('click', async (event) => {
    event.preventDefault(); 

    const email = document.getElementById('emailInput').value.trim();
    const password = document.getElementById('passwordInput').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        handleLoginSuccess(rememberMe);
    } catch (error) {
        console.error('Login fehlgeschlagen:', error);
        showError('Ups, falsche E-Mail-Adresse oder Passwort! Versuchen Sie es erneut.');
    }
});


document.getElementById('guestLogin').addEventListener('click', () => {
    handleGuestLogin();
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

function handleGuestLogin() {
    const guestUser = { name: "Guest" };
    sessionStorage.setItem('currentUser', JSON.stringify(guestUser));
    localStorage.clear(); 
    window.location.href = './html/summary.html'; 
}

function showError(message) {
    const errorMessageElement = document.getElementById('error-message');
    errorMessageElement.textContent = message;
    errorMessageElement.style.display = 'block';
}


function setupPasswordToggle(passwordInputField) {
    let isPasswordVisible = false;
    let clickCount = 0;

    passwordInputField.addEventListener("mousedown", (event) => {
        event.preventDefault();
        clickCount += 1;
        const cursorPosition = passwordInputField.selectionStart;

        if (clickCount === 1) {
            updateBackgroundImage();
        } else if (clickCount === 2) {
            togglePasswordVisibility();
        } else if (clickCount === 3) {
            togglePasswordVisibility();
            resetClickCount();
        }

        passwordInputField.setSelectionRange(cursorPosition, cursorPosition);
        passwordInputField.focus();
    });

    passwordInputField.addEventListener("focus", () => {
        if (!isPasswordVisible) {
            updateBackgroundImage();
        }
    });

    passwordInputField.addEventListener("blur", () => {
        if (!isPasswordVisible) {
            passwordInputField.style.backgroundImage = "url('../assets/icons/password_input.png')";
            resetClickCount();
        }
    });

    function togglePasswordVisibility() {
        isPasswordVisible = !isPasswordVisible;
        passwordInputField.type = isPasswordVisible ? "text" : "password";
        updateBackgroundImage();
    }

    function resetClickCount() {
        clickCount = 0;
    }

    function updateBackgroundImage() {
        const image = isPasswordVisible ? "password_off.png" : "password_off.png";
        passwordInputField.style.backgroundImage = `url('../assets/icons/${image}')`;
    }
}