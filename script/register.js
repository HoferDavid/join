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

        const userData = createUserData(name, email);
        const contact = createContactData(name, email);
        await saveUserData(user.uid, userData);
        await saveContactData(user.uid, contact);

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

function createUserData(name, email) {
    return {
        name,
        email,
        password,  
        bgNameColor: toAssignColorNameLogo(),
        firstLetters: filterFirstLetters(name)
    };
}

function createContactData(name, email) {
    return {
        name,
        email,
        phone: "Telefon/Mobilnummer",
        bgNameColor: toAssignColorNameLogo(),
        firstLetters: filterFirstLetters(name)
    };
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
        const userSnapshot = await get(ref(database, 'users/'));
        const users = userSnapshot.val() || {};
        return Object.values(users).some(user => user.email === email);
    } catch (error) {
        console.error("Error checking email existence:", error);
        return false;
    }
}

async function saveUserData(userId, userData) {
    try {
        await set(ref(database, 'users/' + userId), userData);
    } catch (error) {
        console.error("Error saving user data:", error);
    }
}

async function saveContactData(userId, contact) {
    try {
        await set(ref(database, 'contacts/' + userId), contact);
    } catch (error) {
        console.error("Error saving contact data:", error);
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
    passwordInputField.addEventListener("blur", () => resetState(passwordInputField));
}

function updateBackgroundImage(field, isVisible) {
    const image = isVisible ? "password_input.png" : "password_off.png";
    field.style.backgroundImage = `url('../assets/icons/${image}')`;
}

function resetState(field) {
    field.type = "password";
    updateBackgroundImage(field, false);
}

function isValidPassword(password) {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,:])[A-Za-z\d@$!%*?&.,:]{8,}$/;
    return regex.test(password);
}

function filterFirstLetters(name) {
    return name.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
}

function toAssignColorNameLogo() {
    const userNameColor = ["#FF5733", "#33FF57", "#3357FF"]; 
    return userNameColor[Math.floor(Math.random() * userNameColor.length)];
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