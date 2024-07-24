function htmlRenderContactsAssign(contact) {
  return /*html*/`
    <label for="${contact.id}">
      ${contact.profilePic} 
      <p>${contact.name}</p>
      <input type="checkbox" id="${contact.id}" name="assignToProject" value="${contact.id}">
      <span class="checkMark"></span>
    </label>
    `;
}