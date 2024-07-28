import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";

const auth = getAuth();
const database = getDatabase();

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('signupForm').addEventListener('submit', submitData);
    setupPasswordFieldToggle("password");
    setupPasswordFieldToggle("confirmPassword");
});

async function submitData(event) {
    event.preventDefault();

    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    hideErrorMessages();

    if (!await validateForm(password, confirmPassword, email)) {
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const contact = await createContact(false, name, email, 'Please add phone number', false, true);
        await updateData(`${BASE_URL}contacts/${contact.id}.json`, contact);
        contacts.push(pushToContacts(contact));
        sessionStorage.setItem("contacts", JSON.stringify(contacts));

        showSuccessPopup();

        setTimeout(() => {
            window.location.href = "/index.html";
        }, 2000);
    } catch (error) {
        console.error("Error creating user:", error);
        if (error.code === 'auth/email-already-in-use') {
            showError("emailExistsMessage");
        } else {
            showError("errorMessage");
        }
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
        criteriaMessage.style.display = 'block';
        return false;
    }
    if (password !== confirmPassword) {
        errorMessage.style.display = 'block';
        return false;
    }
    if (await emailExists(email)) {
        emailExistsMessage.style.display = 'block';
        return false;
    }
    return true;
}

async function emailExists(email) {
    try {
        const userSnapshot = await get(ref(database, 'contacts/'));
        const users = userSnapshot.val() || {};
        return Object.values(users).some(user => ((user.email === email) && (user.isUser === true)));
    } catch (error) {
        console.error("Error checking email existence:", error);
        return false;
    }
}

function setupPasswordFieldToggle(inputFieldId) {
    const passwordInputField = document.getElementById(inputFieldId);
    let clickCount = 0;

    passwordInputField.addEventListener("mousedown", event => {
        event.preventDefault();
        const cursorPosition = passwordInputField.selectionStart;
        const isPasswordVisible = clickCount % 2 === 1;
        passwordInputField.type = isPasswordVisible ? "text" : "password";
        updateBackgroundImage(passwordInputField, isPasswordVisible);
        passwordInputField.setSelectionRange(cursorPosition, cursorPosition);
        passwordInputField.focus();
        clickCount++;
    });

    passwordInputField.addEventListener("focus", () => updateBackgroundImage(passwordInputField, passwordInputField.type === "text"));
    passwordInputField.addEventListener("blur", () => { resetState(passwordInputField); clickCount = 0; });
}

function updateBackgroundImage(field, isVisible) {
    const image = isVisible ? "visibility.png" : "password_off.png";
    field.style.backgroundImage = `url('../assets/icons/${image}')`;
}

function resetState(field) {
    field.type = "password";
    field.style.backgroundImage = "url('../assets/icons/password_input.png')";
}

function isValidPassword(password) {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,:])[A-Za-z\d@$!%*?&.,:]{8,}$/;
    return regex.test(password);
}


function showSuccessPopup() {
    const popup = document.getElementById('successPopup');
    popup.style.display = 'block';
    popup.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}

function showError(messageId) {
    document.getElementById(messageId).style.display = 'block';
}