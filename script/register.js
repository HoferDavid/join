import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getDatabase, ref, child, get } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";

const auth = getAuth();
const database = getDatabase();
let clickCount1 = 0;
let clickCount2 = 0;


function initRegister() {
    document.getElementById('signupForm').addEventListener('submit', submitData);
    setupPasswordFieldToggle("password");
    setupPasswordFieldToggle("confirmPassword");
}

function setupPasswordFieldToggle(inputFieldId) {
    const passwordInputField = document.getElementById(inputFieldId);
    passwordInputField.addEventListener("mousedown", (event) => togglePassword(event, passwordInputField));
    passwordInputField.addEventListener("focus", () => updateBackgroundImage(passwordInputField, false));
    passwordInputField.addEventListener("blur", () => resetState(passwordInputField));
}

function togglePassword(e, passwordInputField) {
    e.preventDefault();
    const cursorPosition = passwordInputField.selectionStart;
    const isPasswordVisible = (passwordInputField.id === "password" ? clickCount1 : clickCount2) % 2 === 1;
    passwordInputField.type = isPasswordVisible ? "text" : "password";
    updateBackgroundImage(passwordInputField, isPasswordVisible);
    passwordInputField.setSelectionRange(cursorPosition, cursorPosition);
    passwordInputField.focus();
    isPasswordVisible ? passwordInputField.id === "password" ? clickCount1-- : clickCount2-- : passwordInputField.id === "password" ? clickCount1++ : clickCount2++;
}

function updateBackgroundImage(field, isVisible) {
    const image = isVisible ? "visibility.png" : "password_off.png";
    field.style.backgroundImage = `url('../assets/icons/${image}')`;
}

function resetState(field) {
    field.type = "password";
    field.style.backgroundImage = "url('../assets/icons/password_input.png')";
    field.id === "password" ? clickCount1 = 0 : clickCount2 = 0;
}

async function submitData(event) {
    event.preventDefault();
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    hideErrorMessages();
    if (!await validateForm(password, confirmPassword, email)) return;
    try {
        await signUp(name, email, password);
    } catch (error) {
        submitDataErrorHandling(error);
    }
}

function hideErrorMessages() {
    document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('criteriaMessage').style.display = 'none';
    document.getElementById('emailExistsMessage').style.display = 'none';
}

async function validateForm(password, confirmPassword, email) {
    const criteriaMessage = document.getElementById('criteriaMessage');
    const errorMessage = document.getElementById('errorMessage');
    const emailExistsMessage = document.getElementById('emailExistsMessage');
    if (!isValidPassword(password)) {
        return returnLoginError(criteriaMessage);
    }
    if (password !== confirmPassword) {
        return returnLoginError(errorMessage);
    }
    if (await emailExists(email)) {
        return returnLoginError(emailExistsMessage);
    }
    return true;
}

function returnLoginError(errorWindow) {
    errorWindow.style.display = 'block';
    return false;
}

function isValidPassword(password) {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,:])[A-Za-z\d@$!%*?&.,:]{8,}$/;
    return regex.test(password);
}

async function emailExists(email) {
    try {
        const userSnapshot = await get(child(ref(database), `contacts`));
        const users = userSnapshot.val() || {};
        for (const key in users) {
            if (!users[key]) {
                continue;
            }
            if (users[key].mail.toLowerCase() === email.toLowerCase() && users[key].isUser) {
                return false;
            }
        }
    } catch (error) {
        return false;
    }
}

async function signUp(name, email, password) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await createNewContact(name, email);
    showSuccessPopup();
    setTimeout(() => window.location.href = "/index.html", 1500);
}

async function createNewContact(name, email) {
    const contact = await createContact(false, name, email, 'Please add phone number', false, true);
    await updateData(`${BASE_URL}contacts/${contact.id}.json`, contact);
    contacts.push(pushToContacts(contact));
    sessionStorage.setItem("contacts", JSON.stringify(contacts));
}

function showSuccessPopup() {
    const popup = document.getElementById('successPopup');
    popup.style.display = 'block';
    popup.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}

function submitDataErrorHandling(error) {
    if (error.code === 'auth/email-already-in-use') {
        showError("emailExistsMessage");
    } else {
        showError("errorMessage");
    }
}

function showError(messageId) {
    document.getElementById(messageId).style.display = 'block';
}

document.addEventListener('DOMContentLoaded', initRegister);