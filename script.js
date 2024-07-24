let BASE_URL = 'https://join-273-default-rtdb.europe-west1.firebasedatabase.app/';
let activeTab = sessionStorage.getItem('activeTab') || '';
let contacts = JSON.parse(sessionStorage.getItem('contact')) || [];
let tasks = [];
let currentPrio = 'medium';
let taskStatus = 'toDo';


async function init() {
  await includeHTML();
  setActive();
}


function setActualDate() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('dateInput').setAttribute('min', today);
  document.getElementById('update-date') && document.getElementById('update-date').setAttribute('min', today);
}


async function includeHTML() {
  let includeElements = document.querySelectorAll('[w3-include-html]');
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html"); // "includes/nav.html"
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = 'Page not found';
    }
  }
}


function changeActive(link) {
  let linkBtn = document.querySelectorAll(".menuBtn");
  linkBtn.forEach(btn => btn.classList.remove("menuBtnActive"));
  activeTab = link.innerText;
  sessionStorage.setItem("activeTab", activeTab);
}


function setActive() {
  let linkBtn = document.querySelectorAll(".menuBtn");
  linkBtn.forEach(btn => {
    if (btn.innerText === activeTab) {
      btn.classList.add("menuBtnActive");
    }
  });
}


function toggleClass(menu, className1, className2) {
  let edit = document.getElementById(menu);
  edit.classList.toggle(className1);
  edit.classList.toggle(className2);
}


function getId(id) {
  return document.getElementById(id).value;
}


async function loadData(path = '') {
  try {
    let response = await fetch(BASE_URL + path + ".json");
    let responseAsJson = await response.json();
    return responseAsJson;
  } catch (error) {
    console.error("dh Error fetching data:", error);
  }
}


async function deleteData(path = '') {
  let response = await fetch(BASE_URL + path + '.json', {
    method: 'DELETE',
  });
  return responseToJson = await response.json();
}


async function postData(path = "", data = {}) {
  try {
    let response = await fetch(BASE_URL + path + ".json", {
      method: "POST",
      header: { "Content-Type": " application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("dh Error posting data:", error);
  }
}


// Maybe combine the following 2 Functions and delete 1 of them
async function putData(path = "", data = {}) {
  try {
    let response = await fetch(BASE_URL + path + ".json", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error("Error posting data:", error);
  }
}


async function updateData(url, data) {
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const updatedData = await response.json();
    return updatedData;
  } catch (error) {
    console.error('Error updating data:', error);
  }
}


async function deleteTask(id) {
  await deleteData(`tasks/${id}`);
  tasks = tasks.filter((task) => task.id !== id);
  closeModal();
  initDragDrop();
}


function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


document.addEventListener('DOMContentLoaded', () => {
  const guestLoginButton = document.getElementById('guestLogin');
  if (guestLoginButton) {
    guestLoginButton.addEventListener('click', () => {
      console.log('Guest login geklickt');
      localStorage.setItem('showGreetings', 'true');
      window.location.href = 'html/summary.html'; // Weiterleiten zu summary.html
    });
  }
});