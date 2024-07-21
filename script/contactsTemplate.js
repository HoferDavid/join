function htmlRenderAddContact() {
  return /*html*/`
    <div class="moreIcon" onclick="openAddContacts()">
      <p>Add new contact</p>
      <img src="../assets/icons/person_add.svg" alt="person add">
    </div>
    `;
}

function htmlRenderContactLetter(letter) {
  return /*html*/`
    <div class="contactLetter">
      <p class="fs20">${letter}</p>
      <ul id="contactLetter${letter}" class="contactList">
      </ul>
    </div>
  `;
}

function htmlRenderGeneral(contact) {
  return /*html*/`
    <li onclick="toggleClass('contactsDetail', 'tt0', 'ttx100'); renderContactsDetails(${contact.id})">
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
        ${contacts[id].profilePic}
      </div>
      <div>
        <h2>${contacts[id].name}</h2>
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
    <p><a href="${contacts[id].email}">${contacts[id].email}</a></p>
    <h4>Phone</h4>
    <p><a href="${contacts[id].phone}">${contacts[id].phone}</a></p>
    `;
}

function svgProfilePic(color, initials, height, width) {
  return /*html*/`
    <svg class="profilePic" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${width / 2}" cy="${height / 2}" r="${Math.min(width, height) / 2 - 5}" stroke="white" stroke-width="3" fill="${color}"/>
      <text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="48px">${initials}</text>
    </svg>
  `;
}