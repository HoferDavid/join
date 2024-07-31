import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getDatabase, ref, child, get } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";

const auth = getAuth();
const database = getDatabase();
const passwordInput = document.getElementById('passwordInput');
let isPasswordVisible = false;
let clickCount = -1;


function initLogin() {
    if (document.getElementById('login-form')) {
        let rememberMe = localStorage.getItem('rememberMe') === 'true';
        if (rememberMe) {
            document.getElementById('emailInput').value = localStorage.getItem('email');
            document.getElementById('passwordInput').value = localStorage.getItem('password');
            document.getElementById('checkbox').src = rememberMe ? '../assets/icons/checkboxchecked.svg' : '../assets/icons/checkbox.svg';
            document.getElementById('rememberMe').checked = rememberMe;
        }
        setupPasswordToggle();
    }
}


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
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    if (rememberMe) {
        localStorage.setItem('email', document.getElementById('emailInput').value);
        localStorage.setItem('password', document.getElementById('passwordInput').value);
        localStorage.setItem('rememberMe', 'true');
    } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('email');
        localStorage.removeItem('password');
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

function checkBoxClicked() {
    const checkedState = document.getElementById('rememberMe').checked;
    const checkboxImg = document.getElementById('checkbox');
    checkboxImg.src = checkedState ? '../assets/icons/checkboxchecked.svg' : '../assets/icons/checkbox.svg';
}

document.getElementById('rememberMe').addEventListener('click', checkBoxClicked);
document.getElementById('loginButton').addEventListener('click', loginButtonClick);
document.getElementById('guestLogin').addEventListener('click', handleGuestLogin);
document.addEventListener("DOMContentLoaded", initLogin);