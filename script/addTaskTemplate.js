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