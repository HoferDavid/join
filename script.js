let BASE_URL = 'https://join-273-default-rtdb.europe-west1.firebasedatabase.app/';
let activeTab = sessionStorage.getItem('activeTab') || '';
let contacts = JSON.parse(sessionStorage.getItem('contact')) || [];


async function init() {
  await includeHTML();
  setActive();
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


async function loadData(path = '') {
  let response = await fetch(BASE_URL + path + '.json');
  let responseToJson = await response.json();
  return responseToJson;
}


async function deleteData(path = '') {
  let response = await fetch(BASE_URL + path + '.json', {
    method: 'DELETE',
  });
  return responseToJson = await response.json();
}