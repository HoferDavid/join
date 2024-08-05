/**
 * Returns HTML for adding a new contact.
 * 
 * @returns {string} - HTML string for adding a new contact.
 */
function htmlRenderAddContact() {
  return /*html*/`
    <div class="moreIcon" onclick="openAddContacts()">
      <p>Add new contact</p>
      <img src="../assets/icons/person_add.svg" alt="person add">
    </div>
    `;
}


/**
 * Returns HTML for rendering a contact letter section.
 * 
 * @param {string} letter - The letter to render.
 * @returns {string} - HTML string for the contact letter section.
 */
function htmlRenderContactLetter(letter) {
  return /*html*/`
    <div class="contactLetter">
      <p class="fs20">${letter}</p>
      <ul id="contactLetter${letter}" class="contactList">
      </ul>
    </div>
  `;
}



/**
 * The `htmlRenderGeneral` function generates HTML markup for displaying contact information in a list
 * format.
 * @param contact - The `htmlRenderGeneral` function is a JavaScript function that generates HTML
 * markup for rendering a contact in a list. It takes a `contact` object as a parameter and uses
 * template literals to create the HTML structure.
 * @returns The function `htmlRenderGeneral` is returning an HTML template string that represents a
 * contact item. The template includes the contact's profile picture, name (with a conditional check
 * for the current user), and email address wrapped in list item (`<li>`) tags. The list item has an
 * `id` attribute based on the contact's `id` and an `onclick` event that triggers a function
 */
function htmlRenderGeneral(contact) {
  return /*html*/`
    <li id="contact${contact.id}" onclick="toggleClass('contactsDetail', 'tt0', 'ttx100'); renderContactsDetails(${contact.id})">
      <div class="contactSmall">
        ${contact.profilePic}
      </div>
      <div>
        <p class="fs20">${contact.name} ${contact.id === currentUser.id ? '(you)' : ''}</p>
        <p><a>${contact.email}</a></p>
      </div>
    </li>
  `;
}


/**
 * Returns HTML for rendering an empty contact details section.
 * 
 * @returns {string} - HTML string for the empty contact details section.
 */
function htmlRenderContactDetailsEmpty() {
  return /*html*/`
    <div id="contactsDetail" class="ttx100">
      <div class="contactsHeader">
        <h1>Contacts</h1>
        <p class="bordered fs20">Better with a Team</p>
      </div>
    </div>
    `;
}


/**
 * Returns HTML for rendering the details of a specified contact.
 * 
 * @param {number|string} id - The ID of the contact.
 * @returns {string} - HTML string for the contact details.
 */
function htmlRenderContactDetails(id) {
  return /*html*/`
    <div class="moreIcon" onclick="toggleClass('editMenu', 'ts0', 'ts1'),  activateOutsideCheck('editMenu', 'ts1', 'ts0')">
      <img src="../assets/icons/more_vert.svg" alt="3 points vert">
    </div>
    <a class="backArrow" onclick="toggleClass('contactsDetail', 'tt0', 'ttx100')">
      <img src="../assets/icons/arrow-left-line.svg" alt="arrow left line">
    </a>
    <div class="contactsHeader">
      <h1>Contacts</h1>
      <p class="bordered fs20">Better with a Team</p>
    </div>
    <div class="contactOverview">
      <div class="contactBig">
        ${contacts[contacts.findIndex(c => c.id == id)].profilePic}
      </div>
      <div>
        <h2>${contacts[contacts.findIndex(c => c.id == id)].name}</h2>
        <div id="editMenu" class="editMenu ts0">
          <div class="editMenuItem" onclick="openEditContacts(${id})">
            <img class="editMenuButton" src="../assets/icons/edit.svg" alt="pencil">
            <img class="editMenuButton hoverEffectIcon" src="../assets/icons/editBlue.svg" alt="blue pencil">
            <p>Edit</p>
          </div>
          <div class="editMenuItem" onclick="openDeleteContacts(${id})">
            <img class="editMenuButton" src="../assets/icons/delete.svg" alt="trashcan">
            <img class="editMenuButton hoverEffectIcon" src="../assets/icons/deleteBlue.svg" alt="blue trashcan">
            <p>Delete</p>
          </div>
        </div>
      </div>
    </div>
    <p class="fs20">Contact Information</p>
    <h4>Email</h4>
    <p><a href="${contacts[contacts.findIndex(c => c.id == id)].email}">${contacts[contacts.findIndex(c => c.id == id)].email}</a></p>
    <h4>Phone</h4>
    <p><a href="${contacts[contacts.findIndex(c => c.id == id)].phone}">${contacts[contacts.findIndex(c => c.id == id)].phone}</a></p>
    `;
}


/**
 * Returns an SVG string for a profile picture with the specified color and initials.
 * 
 * @param {string} color - The background color of the profile picture.
 * @param {string} initials - The initials to display in the profile picture.
 * @param {number} height - The height of the SVG.
 * @param {number} width - The width of the SVG.
 * @returns {string} - SVG string for the profile picture.
 */
function svgProfilePic(color, initials, height, width) {
  return /*html*/`
    <svg class="profilePic" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${width / 2}" cy="${height / 2}" r="${Math.min(width, height) / 2 - 5}" stroke="white" stroke-width="3" fill="${color}"/>
      <text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="48px">${initials}</text>
    </svg>
  `;
}


/**
 * Creates a contact object with the specified details.
 * 
 * @param {number|string} id - The ID of the contact.
 * @param {string} name - The name of the contact.
 * @param {string} email - The email of the contact.
 * @param {string} phone - The phone number of the contact.
 * @param {string} [profilePic] - The profile picture of the contact.
 * @param {boolean} [isUser] - Indicates if the contact is a user.
 * @returns {Object} - The created contact object.
 */
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