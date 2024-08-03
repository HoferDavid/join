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
 * Returns HTML for rendering a general contact entry.
 * 
 * @param {Object} contact - The contact object.
 * @returns {string} - HTML string for the contact entry.
 */
function htmlRenderGeneral(contact) {
  return /*html*/`
    <li id="contact${contact.id}" onclick="toggleClass('contactsDetail', 'tt0', 'ttx100'); renderContactsDetails(${contact.id})">
      <div class="contactSmall">
        ${contact.profilePic}
      </div>
      <div>
        <p class="fs20">${contact.name}</p>
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
    <div class="moreIcon" onclick="toggleClass('editMenu', 'ts0', 'ts1')">
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
        <div id="editMenu" class="editMenu ts0" onmouseleave="toggleClass('editMenu', 'ts0', 'ts1')">
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