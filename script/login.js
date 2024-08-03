import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getDatabase, ref, child, get } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";


const auth = getAuth();
const database = getDatabase();
const passwordInput = document.getElementById('passwordInput');
let isPasswordVisible = false;
let clickCount = -1;


/**
 * Initializes the login form, setting up remembered user credentials and password toggle functionality.
 */
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


/**
 * Sets up the password visibility toggle functionality for the password input field.
 */
function setupPasswordToggle() {
    passwordInput.addEventListener("click", changeVisibility);
    passwordInput.addEventListener("focus", () => { clickCount++; });
    passwordInput.addEventListener("blur", resetState);
}


/**
 * Toggles the visibility of the password in the password input field.
 * 
 * @param {Event} e - The click event on the password input field.
 */
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


/**
 * Resets the password input field to its default state (hidden password) when it loses focus.
 */
function resetState() {
    passwordInput.type = "password";
    passwordInput.style.backgroundImage = "url('../assets/icons/password_input.png')";
    clickCount = -1;
    isPasswordVisible = false;
}


/**
 * Toggles the type and background image of the password input field to show or hide the password.
 */
function togglePasswordVisibility() {
    passwordInput.type = isPasswordVisible ? "text" : "password";
    const image = isPasswordVisible ? "visibility.png" : "password_off.png";
    passwordInput.style.backgroundImage = `url('../assets/icons/${image}')`;
    isPasswordVisible = !isPasswordVisible;
}


/**
 * Handles the login button click event, authenticating the user and managing the "remember me" functionality.
 * 
 * @param {Event} event - The click event on the login button.
 */
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


/**
 * Sets the current user based on the provided email by fetching user data from the database.
 * 
 * @param {string} email - The email of the user.
 */
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


/**
 * Handles the "remember me" functionality by storing or removing user credentials in localStorage.
 * 
 * @param {boolean} rememberMe - Indicates if the user wants to be remembered.
 */
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


/**
 * Redirects the user to the summary page.
 */
function continueToSummary() {
    sessionStorage.setItem('activeTab', 'summary');
    window.location.href = './html/summary.html';
}

/**
 * Displays an error message to the user.
 * 
 * @param {string} message - The error message to display.
 */
function showError(message) {
    const errorMessageElement = document.getElementById('error-message');
    errorMessageElement.textContent = message;
    errorMessageElement.style.display = 'block';
}


/**
 * Handles the guest login functionality by setting a guest user and redirecting to the summary page.
 */
function handleGuestLogin() {
    const guestUser = { name: "Guest", firstLetters: "G" };
    sessionStorage.setItem('currentUser', JSON.stringify(guestUser));
    localStorage.clear();
    continueToSummary();
}


/**
 * Handles the checkbox click event for the "remember me" functionality, updating the checkbox image accordingly.
 */
function checkBoxClicked() {
    const checkedState = document.getElementById('rememberMe').checked;
    const checkboxImg = document.getElementById('checkbox');
    checkboxImg.src = checkedState ? '../assets/icons/checkboxchecked.svg' : '../assets/icons/checkbox.svg';
}

document.getElementById('rememberMe').addEventListener('click', checkBoxClicked);
document.getElementById('loginButton').addEventListener('click', loginButtonClick);
document.getElementById('guestLogin').addEventListener('click', handleGuestLogin);
document.addEventListener("DOMContentLoaded", initLogin);