let currentLetter = '';
let currentLetterId = '';
let editId = -1;


async function initContacts() {
  init();
  await getContactsData();
  renderContactsGeneral();
}


function refreshPage() {
  renderContactsGeneral();
  renderContactsDetails(editId);
}


async function getContactsData() {
  contacts = [];
  let loadItem = await loadData('contacts');
  setContactsArray(loadItem);
  sessionStorage.setItem("contacts", JSON.stringify(contacts));
  return contacts;
}


function setContactsArray(loadItem) {
  for (let i = 0; i < loadItem.length; i++) {
    const element = loadItem[i];
    !element || contacts.push(pushToContacts(element));
  }
}


function renderContactsGeneral() {
  let contactBook = document.getElementById('contactsGeneral');
  let contactSort = [...contacts];
  contactBook.innerHTML = htmlRenderAddContact();
  contactSort.sort((a, b) => a.name.localeCompare(b.name));
  for (let i = 0; i < contactSort.length; i++) {
    const contact = contactSort[i];
    renderContactsLetter(contact);
    const contactBookEntry = document.getElementById(currentLetterId);
    contactBookEntry.innerHTML += htmlRenderGeneral(contact);
  }
}


function renderContactsLetter(contact) {
  let contactBook = document.getElementById('contactsGeneral');
  let firstLetter = contact.name[0].toUpperCase();
  if (firstLetter !== currentLetter) {
    contactBook.innerHTML += htmlRenderContactLetter(firstLetter);
    currentLetter = firstLetter;
    currentLetterId = `contactLetter${currentLetter}`;
  }
}


function renderContactsDetails(id = '') {
  let details = document.getElementById('contactsDetail');
  editId = id;
  details.innerHTML = contacts.find(c => (c.id == editId)) && (editId != -1) ? htmlRenderContactDetails(editId) : htmlRenderContactDetailsEmpty();
  makeContactActive(id);
}

function makeContactActive(id = editId) {
  let contactLabel = `contact${id}`;
  let contact = document.getElementById(contactLabel);
  let activeContact = document.querySelector('.activeContact');
  activeContact ? activeContact.classList.remove('activeContact') : null;
  contact ? contact.classList.add('activeContact') : null;
}


function openEditContacts(id) {
  editId = id;
  let name = document.getElementById('editName');
  let email = document.getElementById('editMail');
  let tel = document.getElementById('editTel');
  let profilePic = document.getElementById('editProfilePic');
  name.value = contacts[contacts.findIndex(c => c.id == id)].name;
  email.value = contacts[contacts.findIndex(c => c.id == id)].email;
  tel.value = contacts[contacts.findIndex(c => c.id == id)].phone;
  profilePic.innerHTML = contacts[contacts.findIndex(c => c.id == id)].profilePic;
  toggleClass('editContact', 'tt0', 'tty100');
  activateOutsideCheck('editContact');
}


async function editContacts(id = editId) {
  let editName = document.getElementById('editName').value;
  let editEmail = document.getElementById('editMail').value;
  let editTel = document.getElementById('editTel').value;
  let nameChange = editName != contacts[contacts.findIndex(c => c.id == id)].name;
  contacts[contacts.findIndex(c => c.id == id)].name = editName;
  contacts[contacts.findIndex(c => c.id == id)].email = editEmail;
  contacts[contacts.findIndex(c => c.id == id)].phone = editTel;
  let contact = contacts[contacts.findIndex(c => c.id == id)];
  let editContact = createContact(contact.id, editName, editEmail, editTel, nameChange ? false : contact.profilePic, contact.isUser);
  contacts[contacts.findIndex(c => c.id == id)].profilePic = editContact.profilePic;
  await updateData(`${BASE_URL}contacts/${id}.json`, editContact);
  toggleClass('editContact', 'tt0', 'tty100');
  refreshPage();
}


function openDeleteContacts(id = editId) {
  editId = id;
  toggleClass('deleteResponse', 'ts0', 'ts1');
}


async function deleteContacts(id = editId) {
  contacts.splice(contacts.findIndex(c => c.id == id), 1);
  await deleteData(`contacts/${id}`);
  sessionStorage.setItem("contacts", JSON.stringify(contacts));
  toggleClass('deleteResponse', 'ts0', 'ts1');
  refreshPage();
}


function openAddContacts() {
  editId = contacts[contacts.length - 1].id + 1;
  let name = document.getElementById('addName');
  let email = document.getElementById('addMail');
  let tel = document.getElementById('addTel');
  name.value = '';
  email.value = '';
  tel.value = '';
  toggleClass('addContact', 'tt0', 'tty100');
  activateOutsideCheck('addContact');
}


async function addContacts(id = editId) {
  let addName = document.getElementById('addName').value;
  let addEmail = document.getElementById('addMail').value;
  let addTel = document.getElementById('addTel').value;
  let newContact = await createContact(id, addName, addEmail, addTel, false, false);
  if (checkAlreadyExists(newContact)) {
    await updateData(`${BASE_URL}contacts/${id}.json`, newContact);
    contacts.push(pushToContacts(newContact));
    sessionStorage.setItem("contacts", JSON.stringify(contacts));
    toggleClass('addContact', 'tt0', 'tty100');
    refreshPage();
  }
}

async function createContact(id, name, email, phone, profilePic, isUser) {
  return {
    'id': id ? id : contacts.length == 0 ? await getContactsData().then(contacts => contacts[contacts.length - 1].id + 1) : contacts[contacts.length - 1].id + 1,
    'name': name,
    'mail': email,
    'number': phone,
    'profilePic': profilePic ? profilePic : generateSvgCircleWithInitials(name, 120, 120),
    'isUser': isUser ? true : false,
    'firstLetters': filterFirstLetters(name)
  };
}


function pushToContacts(contact) {
  return {
    'id': contact.id,
    'name': contact.name,
    'email': contact.mail,
    'phone': contact.number,
    'profilePic': contact.profilePic ? contact.profilePic : generateSvgCircleWithInitials(contact.name, 120, 120),
    'isUser': contact.isUser,
    'firstLetters': filterFirstLetters(contact.name)
  };
}

function checkAlreadyExists(contact) {
  let warningMessage = document.querySelectorAll('.warning');
  warningMessage.forEach(warning => warning.classList.add('d-none'));
  if (contacts.findIndex(c => { (c.name === contact.name) && (c.id != contact.id); }) > -1 || contacts.findIndex(c => { (c.email === contact.mail) && (c.id != contact.id); })) {
    warningMessage.forEach(warning => warning.classList.remove('d-none'));
    return false;
  }
}

function filterFirstLetters(name) {
  return name.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
}


function generateSvgCircleWithInitials(name, width, height) {
  const colors = ['#0038FF', '#00BEE8', '#1FD7C1', '#6E52FF', '#9327FF', '#C3FF2B', '#FC71FF', '#FF4646', '#FF5EB3', '#FF745E', '#FF7A00', '#FFA35E', '#FFBB2B', '#FFC701', '#FFE62B'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const initials = name.split(' ').map(word => word[0]).join('').toUpperCase();
  return svgProfilePic(randomColor, initials, height, width);
}

function activateOutsideCheck(modalName) {
  document.addEventListener('mousedown', function () { checkOutsideModal(modalName); });
}

function checkOutsideModal(modalName) {
  let modal = document.getElementById(modalName);
  if (modal.classList.contains('tt0') && !modal.contains(event.target)) {
    toggleClass(modalName, 'tt0', 'tty100');
    document.removeEventListener('click', function () { checkOutsideModal(modalName); });

  };
}


/*TODO - check if mail is doubled */