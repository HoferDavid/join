import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getDatabase, ref, child, get } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";

const auth = getAuth();
const database = getDatabase();
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const rememberMeCheckbox = document.querySelector("#rememberMe");
let isPasswordVisible = false;
let clickCount = -1;

function initLogin() {
    if (document.getElementById('login-form')) {
        if (localStorage.getItem('rememberMe') === 'true') {
            emailInput.value = localStorage.getItem('email');
            passwordInput.value = localStorage.getItem('password');
            rememberMeCheckbox.checked = true;
        }
        setupPasswordToggle();
    }
};

function setupPasswordToggle() {
    passwordInput.addEventListener("click", changeVisibility);
    passwordInput.addEventListener("focus", () => { clickCount++; });
    passwordInput.addEventListener("blur", resetState);
}


function changeVisibility(e) {
    e.preventDefault();
    const cursorPosition = passwordInput.selectionStart;
    if (clickCount === 0) {
        togglePasswordVisibility();
        clickCount++;
    } else if (clickCount === 1) {
        togglePasswordVisibility();
        clickCount--;
    }
    passwordInput.setSelectionRange(cursorPosition, cursorPosition);
}

function resetState() {
    passwordInput.type = "password";
    passwordInput.style.backgroundImage = "url('../assets/icons/password_input.png')";
    clickCount = -1;
    isPasswordVisible = false;
}

function togglePasswordVisibility() {
    passwordInput.type = isPasswordVisible ? "text" : "password";
    const image = isPasswordVisible ? "visibility.png" : "password_off.png";
    passwordInput.style.backgroundImage = `url('../assets/icons/${image}')`;
    isPasswordVisible = !isPasswordVisible;
}

async function loginButtonClick(event) {
    event.preventDefault();
    const email = document.getElementById('emailInput').value.trim().toLowerCase();
    const password = document.getElementById('passwordInput').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await setCurrentUser(email);
        handleRememberMe(rememberMe);
        continueToSummary();
    } catch (error) {
        showError('Oops, wrong email address or password! Try it again.');
    }
}

async function setCurrentUser(email) {
    const userSnapshot = await get(child(ref(database), `contacts`));
    if (userSnapshot.exists()) {
        const users = userSnapshot.val();
        for (const key in users) {
            if (!users[key]) {
                continue;
            }
            if (users[key].mail.toLowerCase() === email && users[key].isUser) {
                currentUser = users[key];
                break;
            }
        }
    }
}

function handleRememberMe(rememberMe) {
    if (rememberMe) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        localStorage.setItem('rememberMe', 'true');
    } else {
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        localStorage.removeItem('rememberMe');
    }
}

function continueToSummary() {
    sessionStorage.setItem('activeTab', 'summary');
    window.location.href = './html/summary.html';
}

function showError(message) {
    const errorMessageElement = document.getElementById('error-message');
    errorMessageElement.textContent = message;
    errorMessageElement.style.display = 'block';
}

function handleGuestLogin() {
    const guestUser = { name: "Guest", firstLetters: "G" };
    sessionStorage.setItem('currentUser', JSON.stringify(guestUser));
    localStorage.clear();
    continueToSummary();
}


document.getElementById('loginButton').addEventListener('click', loginButtonClick);
document.getElementById('guestLogin').addEventListener('click', handleGuestLogin);
document.addEventListener("DOMContentLoaded", initLogin);