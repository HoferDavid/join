import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getDatabase, ref, child, get } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";

const auth = getAuth();
const database = getDatabase();

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

    displayGreeting();
});

document.getElementById('loginButton').addEventListener('click', async (event) => {
    event.preventDefault();

    const email = document.getElementById('emailInput').value.trim();
    const password = document.getElementById('passwordInput').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userSnapshot = await get(child(ref(database), `contacts`));
        let userName = "User"; 

        if (userSnapshot.exists()) {
            const users = userSnapshot.val();
            for (const key in users) {
                if (users[key].mail === email && users[key].isUser) {
                    userName = users[key].name || "User";
                    break;
                }
            }
        }

        const currentUser = { email: user.email, displayName: userName };

        if (rememberMe) {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            localStorage.setItem('rememberMe', 'true');
        } else {
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
            localStorage.removeItem('rememberMe');
        }

        localStorage.setItem('userName', userName);
        localStorage.setItem('showGreetings', 'true');

        window.location.href = './html/summary.html';
    } catch (error) {
        console.error('Login failed:', error);
        showError('Ups, falsche E-Mail-Adresse oder Passwort! Versuchen Sie es erneut.');
    }
});

document.getElementById('guestLogin').addEventListener('click', handleGuestLogin);

function handleGuestLogin() {
    const guestUser = { name: "Guest", firstLetters: "G" };
    sessionStorage.setItem('currentUser', JSON.stringify(guestUser));
    localStorage.clear();
    localStorage.setItem('userName', guestUser.name);
    localStorage.setItem('showGreetings', 'true');
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

function displayGreeting() {
    if (localStorage.getItem('showGreetings') === 'true') {
        console.log('Displaying greeting');
        greetingSummary();
        localStorage.setItem('showGreetings', 'false'); 
    } else {
        console.log('showGreetings is not true');
    }
}

function greetingSummary() {
    let isMobileView = window.matchMedia("(max-width: 1200px)").matches;
    let isDesktopView = window.matchMedia("(min-width: 1300px)").matches;
    
    if (isMobileView) {
        console.log('Mobile view detected');
        let greetingMobile = document.getElementById('greetingSummaryMobile');
        let summaryMain = document.getElementById('summaryMain');
        let greetingTime = greeting();
        let greetingName = displayGreetingWithName();

        greetingMobile.innerHTML = greetingMobileHTML(greetingTime, greetingName);
        console.log('Greeting Mobile HTML:', greetingMobile.innerHTML);

        greetingMobile.style.display = 'flex';

        setTimeout(() => {
            summaryMain.style.opacity = '0';
            setTimeout(() => {
                greetingMobile.classList.add('hide');
                setTimeout(() => {
                    greetingMobile.style.display = 'none';
                    summaryMain.style.opacity = '1';
                    summaryMain.style.transition = 'opacity 0.9s ease';
                }, 900);
            }, 2000);
        }, 0);
    }

    if (isDesktopView) {
        console.log('Desktop view detected');
        let greetingDesktop = document.getElementById('greetingSummDesktop');
        let greetingNameDesktop = document.getElementById('greetingNameDesktop');
        let greetingTime = greeting();
        let greetingName = displayGreetingWithName();

        greetingDesktop.innerText = greetingTime;
        greetingNameDesktop.innerText = greetingName;
    }
}

function greetingMobileHTML(greetingTime, greetingName) {
    return `
      <div class="summ-greeting-mobile">
        <h3 class="summ-day-greeting">${greetingTime}</h3>
        <span class="summ-person-greeting">${greetingName}</span>
      </div>
    `;
}

function greeting() {
    let now = new Date();
    let hours = now.getHours();
    if (hours < 12) {
        return "Good Morning,";
    } else if (hours < 18) {
        return "Good Afternoon,";
    } else {
        return "Good Evening,";
    }
}

function displayGreetingWithName() {
    let userName = localStorage.getItem('userName') || 'Guest';
    return userName;
}