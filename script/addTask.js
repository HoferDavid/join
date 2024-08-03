let assignedContacts = [];


/**
 * Asynchronously pushes a new task to the server and handles the task form submission.
 * 
 * @param {Event} event - The form submission event.
 * @returns {Promise<void>}
 */
async function pushNewTask(event) {
  event.preventDefault();
  await postData("tasks", createNewtask());
  closeAddTaskModal();
  setActiveTab('.menuBtn[href="../html/board.html"]');
}


/**
 * Creates a new task object with the form data.
 * 
 * @returns {Object} The new task object.
 */
function createNewtask() {
  return {
    title: getId('taskTitle'),
    description: getId('taskDescription'),
    date: getId('dateInput'),
    prio: currentPrio,
    status: sessionStorage.getItem('taskCategory'),
    subtasks: getSubtasks(),
    assignedTo: assignedContacts,
    category: document.getElementById('categoryInput').value,
  };
}


/**
 * Sets the priority for a task.
 * 
 * @param {HTMLElement} element - The element that triggered the priority setting.
 */
function setPrio(element) {
  const prio = element.getAttribute('data-prio');
  currentPrio = prio;
  updatePrioActiveBtn(prio);
}


/**
 * Clears the add task form fields.
 */
function clearAddTaskForm() {
  document.getElementById('taskTitle').value = '';
  document.getElementById('taskDescription').value = '';
  document.getElementById('dateInput').value = '';
  updatePrioActiveBtn('');
  document.getElementById('subtaskInput').value = '';
  clearSubtaskList();
}


/**
 * Validates the form inputs.
 * 
 * @returns {boolean} True if all required inputs are valid, false otherwise.
 */
function formValidation() {
  const inputs = document.querySelectorAll('.singleInputContainer input[required]');
  let isValid = true;
  inputs.forEach(input => {
    const validationText = input.nextElementSibling;
    if (input.value.trim() === '') {
      formValidationTrue(input, validationText);
    } else {
      formValidationFalse(input, validationText);
    }
    formValidationListener(input, validationText);
  });
  return isValid;
}


/**
 * Displays validation error for an input.
 * 
 * @param {HTMLInputElement} input - The input element to validate.
 * @param {HTMLElement} validationText - The validation message element.
 */
function formValidationTrue(input, validationText) {
  validationText.style.display = 'block';
  input.classList.add('formValidationInputBorder');
  isValid = false;
}


/**
 * Hides validation error for an input.
 * 
 * @param {HTMLInputElement} input - The input element to validate.
 * @param {HTMLElement} validationText - The validation message element.
 */
function formValidationFalse(input, validationText) {
  validationText.style.display = 'none';
  input.classList.remove('formValidationInputBorder');
}


/**
 * Adds an input event listener to handle real-time validation.
 * 
 * @param {HTMLInputElement} input - The input element to validate.
 * @param {HTMLElement} validationText - The validation message element.
 */
function formValidationListener(input, validationText) {
  input.addEventListener('input', function () {
    if (input.value.trim() !== '') {
      validationText.style.display = 'none';
      input.classList.remove('formValidationInputBorder');
    } else {
      validationText.style.display = 'block';
      input.classList.add('formValidationInputBorder');
    }
  });
}


/**
 * Shows the task added animation and redirects to the board page.
 */
function showTaskAddedAnimation() {
  if (window.location.href.endsWith('addtask.html')) {
    toggleClass('taskAddedBtn', 'd-None', 'show');
    setTimeout(() => {
      return window.location.href = "../html/board.html";
    }, 2000);
  } else {
    showTaskAddedAnimationModal();
  }
}


/**
 * Shows the task added animation in a modal.
 */
function showTaskAddedAnimationModal() {
  toggleClass('taskAddedBtn', 'd-None', 'show');
  setTimeout(() => {
    closeModal();
  }, 2000);
}


/**
 * Closes the add task modal and handles the task submission animation.
 * 
 * @returns {Promise<void>}
 */
async function closeAddTaskModal() {
  if (activeTab == 'add task') {
    showTaskAddedAnimation();
    tasks = [];
    await pushDataToArray();
  } else {
    showTaskAddedAnimation();
    tasks = [];
    await pushDataToArray();
    updateAllTaskCategories();
    initDragDrop();
  }
}


/**
 * Handles the addition of a new subtask.
 * 
 * @param {Event} event - The event triggered by adding a subtask.
 */
function addNewSubtask(event) {
  handleKeyDown(event);
  let input = document.getElementById('subtaskInput').value.length;
  if (input > -1) {
    document.getElementById('subtaskIconContainer').classList.remove('dNone');
    document.getElementById('subtaskPlusIcon').classList.add('dNone');
  } else {
    document.getElementById('subtaskIconContainer').classList.add('dNone');
    document.getElementById('subtaskPlusIcon').classList.remove('dNone');
  }
}


/**
 * Handles the 'Enter' key event for saving a subtask.
 * 
 * @param {KeyboardEvent} event - The keyboard event.
 */
function handleKeyDown(event) {
  if (event.key === 'Enter') {
      event.preventDefault();
      saveSubtask();
  }
}


/**
 * Clears the subtask input field.
 */
function clearSubtaskInput() {
  document.getElementById('subtaskInput').value = '';
}


/**
 * Saves a subtask to the subtask list.
 */
function saveSubtask() {
  let subtaskList = document.getElementById('subtaskList');
  let inputText = document.getElementById('subtaskInput').value.trim();
  if (inputText === '') { return; }
  let index = subtaskList.children.length;
  let subtaskHTML = generateSaveSubtaskHTML(inputText, index);
  let subtaskItem = document.createElement('div');
  subtaskItem.innerHTML = subtaskHTML;
  subtaskList.appendChild(subtaskItem.firstElementChild);
  document.getElementById('subtaskInput').value = '';
  document.getElementById('subtaskIconContainer').classList.add('dNone');
  document.getElementById('subtaskPlusIcon').classList.remove('dNone');
}


/**
 * Toggles the visibility of the subtask icons based on click events outside the subtask input.
 */
document.addEventListener('click', function (event) {
  const input = document.getElementById('subtaskInput');
  const iconContainer = document.getElementById('subtaskIconContainer');
  const plusIcon = document.getElementById('subtaskPlusIcon');
  if (input && iconContainer && plusIcon) {
    if (!input.contains(event.target) && !iconContainer.contains(event.target) && !plusIcon.contains(event.target)) {
      iconContainer.classList.add('dNone');
      plusIcon.classList.remove('dNone');
    }
  }
});


/**
 * Enables the editing of a subtask.
 * 
 * @param {HTMLElement} editIcon - The edit icon element that was clicked.
 */
function editSubtask(editIcon) {
  let subtaskItem = editIcon.closest('.subtaskEditList');
  let subtaskText = subtaskItem.querySelector('.subtaskItemText');
  let editInput = subtaskItem.querySelector('.editSubtaskInput');
  subtaskText.classList.add('dNone');
  editInput.classList.remove('dNone');
  editInput.focus();
  editInput.addEventListener('blur', function () { saveEditedSubtask(subtaskText, editInput); });
}


/**
 * Saves the edited subtask.
 * 
 * @param {HTMLElement} subtaskText - The subtask text element.
 * @param {HTMLInputElement} editInput - The edit input element.
 */
function saveEditedSubtask(subtaskText, editInput) {
  subtaskText.textContent = editInput.value.trim();
  subtaskText.classList.remove('dNone');
  editInput.classList.add('dNone');
}


/**
 * Clears the subtask list.
 */
function clearSubtaskList() {
  document.getElementById('subtaskList').innerHTML = '';
}


/**
 * Deletes a subtask.
 * 
 * @param {HTMLElement} deleteIcon - The delete icon element that was clicked.
 */
function deleteSubtask(deleteIcon) {
  let subtaskItem = deleteIcon.closest('.subtaskEditList');
  subtaskItem.remove();
}


/**
 * Gets the subtasks from the subtask list.
 * 
 * @returns {Array<Object>} An array of subtask objects.
 */
function getSubtasks() {
  const subtaskItems = document.querySelectorAll('.subtaskList .subtaskItemText');
  let subtasks = [];
  subtaskItems.forEach(item => { subtasks.push({ status: "unchecked", text: item.innerText }); });
  return subtasks;
}


/**
 * Assigns or unassigns a contact to/from a task.
 * 
 * @param {number} id - The contact ID.
 * @param {Event} event - The click event.
 */
function contactAssign(id, event) {
  event.stopPropagation();
  let contactLabel = document.getElementById(`contact${id}`).parentElement;
  contactLabel.classList.toggle('contactsToAssignCheck');
  if (contactLabel.classList.contains('contactsToAssignCheck')) {
    assignedContacts.push(contacts[contacts.findIndex(c => c.id == id)]);
    renderAssignedContacts();
  } else {
    assignedContacts.splice(assignedContacts.findIndex(c => c.id == id), 1);
    renderAssignedContacts();
  }
}


/**
 * Toggles the assign dropdown menu.
 * 
 * @returns {Promise<void>}
 */
async function toggleDropdown() {
  document.getElementById('assignDropdown').classList.toggle('open');
  document.getElementById('assignSearch').classList.contains('contactsAssignStandard') ? await openAssignDropdown() : closeAssignDropdown();
  toggleClass('assignSearch', 'contactsAssignStandard', 'contactsAssignOpen');
}


/**
 * Toggles the category dropdown menu.
 * 
 * @param {Event} e - The click event.
 * @param {string} value - The value to set for the category input.
 */
function toggleCategoryDropdown(e, value) {
  e.stopPropagation();
  let input = document.getElementById('categoryInput');
  let wrapper = document.getElementById('selectWrapper');
  let arrow = document.getElementById('categoryDropArrow');
  input.value = wrapper.classList.contains('select-wrapperOpen') ? value : '';
  document.getElementById('selectWrapper').classList.toggle('select-wrapperOpen');
  wrapper.classList.contains('select-wrapperOpen') ? arrow.style.transform = 'rotate(180deg)' : arrow.style.transform = 'rotate(0deg)';
}


/**
 * Checks for clicks outside the assign menu to close it.
 * 
 * @param {Event} event - The click event.
 */
function checkOutsideAssign(event) {
  let assignMenu = document.getElementById('assignDropdown');
  if (assignMenu.classList.contains('open') && !assignMenu.contains(event.target)) {
    toggleDropdown();
  };
}


/**
 * Renders the assigned contacts.
 */
function renderAssignedContacts() {
  let assignedContactsContainer = document.getElementById('contactsAssigned');
  assignedContactsContainer.innerHTML = '';
  assignedContacts.forEach(c => assignedContactsContainer.innerHTML += c.profilePic);
}


/**
 * Opens the assign dropdown menu.
 * 
 * @returns {Promise<void>}
 */
async function openAssignDropdown() {
  let searchInput = document.getElementById('assignSearch');
  let contactsContainer = document.getElementById('contactsToAssign');
  let contactSorted = contacts.length == 0 ? await getContactsData().then(c => [...c]) : [...contacts];
  contactSorted.sort((a, b) => a.name.localeCompare(b.name));
  contactSorted.forEach(c => contactsContainer.innerHTML += htmlRenderContactsAssign(c));
  document.getElementById('assignDropArrow').style.transform = 'rotate(180deg)';
  searchInput.value = '';
  searchInput.removeAttribute('readonly');
  searchInput.removeAttribute('onclick');
  document.addEventListener('click', checkOutsideAssign);
}


/**
 * Closes the assign dropdown menu.
 */
function closeAssignDropdown() {
  let searchInput = document.getElementById('assignSearch');
  let contactsContainer = document.getElementById('contactsToAssign');
  contactsContainer.innerHTML = '';
  document.getElementById('assignDropArrow').style.transform = 'rotate(0deg)';
  searchInput.value = 'Select contacts to assign';
  searchInput.setAttribute('readonly', true);
  searchInput.setAttribute('onclick', 'toggleDropdown()');
  document.removeEventListener('click', checkOutsideAssign);
};


/**
 * Filters and displays contacts based on the search input.
 */
async function assignSearchInput() {
  let searchInput = document.getElementById('assignSearch');
  let contactsContainer = document.getElementById('contactsToAssign');
  let searchText = searchInput.value.toLowerCase();
  contactsContainer.innerHTML = '';
  let contactSorted = contacts.length == 0 ? await getContactsData().then(c => [...c]) : [...contacts];
  contactSorted.sort((a, b) => a.name.localeCompare(b.name));
  contactSorted.filter(c => c.name.toLowerCase().includes(searchText)).forEach(c => contactsContainer.innerHTML += htmlRenderContactsAssign(c));
}





