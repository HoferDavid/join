function htmlRenderContactsAssign(contact) {
  return /*html*/`
    <label for="contact${contact.id}" ${assignedContacts.findIndex(c => c.name == contact.name) != -1 ? 'class= "contactsToAssignCheck"' : ''}>
      ${contact.profilePic} 
      <p>${contact.name}</p>
      <input type="checkbox" onclick="contactAssign(${contact.id}, event)" id="contact${contact.id}" name="assignToProject" value="${contact.id}" ${assignedContacts.findIndex(c => c.name == contact.name) != -1 ? 'checked' : ''}>
      <span class="checkMark"></span>
    </label>
    `;
}


function generateSaveSubtaskHTML(inputText) {
  return /*html*/ `
    <li class="subtaskItemText">${inputText}</li>
    <input type="text" class="editSubtaskInput dNone" value="${inputText}">
    <div class="addedTaskIconContainer">
        <img class="icon" src="../assets/icons/pencilDarkBlue.svg" onclick="editSubtask(this)">
        <div class="subtaskInputSeperator"></div>
        <img class="icon" src="../assets/icons/delete.svg" onclick="deleteSubtask(this)">
    </div>
  `;
}