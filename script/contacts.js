let currentLetter = '';
let currentLetterId = '';

async function getContactsData() {
  contacts = [];
  let loadItem = await loadData('contacts');
  await setContactsArray(loadItem);
  sessionStorage.setItem("contacts", JSON.stringify(contacts));
}

async function setContactsArray(loadItem) {
  for (let i = 0; i < loadItem.length; i++) {
    const element = loadItem[i];
    contacts.push({
      id: i,
      name: element.name,
      email: element.mail,
      phone: element.number,
      profilePic: element.profilePic ? element.profilePic : await generateSvgCircleWithInitials(element.name, 120, 120),
      isUser: element.isUser
    });
  }
}

function setContactsData() {

}

async function initContacts() {
  init();
  await getContactsData();
  renderContactsGeneral();
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

function renderContactsDetails(id) {
  let details = document.getElementById('contactsDetail');
  details.innerHTML = htmlRenderContactDetails(id);
}

function editContacts() {

}

function deleteContacts() {

}

function addContacts() {

}

async function generateSvgCircleWithInitials(name, width, height) {
  const colors = ['#0038FF', '#00BEE8', '#1FD7C1', '#6E52FF', '#9327FF', '#C3FF2B', '#FC71FF', '#FF4646', '#FF5EB3', '#FF745E', '#FF7A00', '#FFA35E', '#FFBB2B', '#FFC701', '#FFE62B'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const initials = name.split(' ').map(word => word[0]).join('').toUpperCase();
  return svgProfilePic(randomColor, initials, height, width);
}
