let assignedContacts = [];

async function pushNewTask(event) {
  event.preventDefault();
  await postData("tasks", createNewtask());
  closeAddTaskModal();
  setActiveTabToBoard();
}


function createNewtask() {
  return {
    title: getId('taskTitle'),
    description: getId('taskDescription'),
    date: getId('dateInput'),
    prio: currentPrio,
    status: taskStatus,
    subtasks: getSubtasks(),

    assignedTo: ["dummy"],
    category: "Technical Task",
  };
}


function setPrio(element) {
  const prio = element.getAttribute('data-prio');
  currentPrio = prio;
  updatePrioActiveBtn(prio);
}


function updatePrioActiveBtn(prio) {
  const buttons = document.querySelectorAll('.prioBtn');
  buttons.forEach(button => {
    button.classList.remove('prioBtnUrgentActive', 'prioBtnMediumActive', 'prioBtnLowActive');
    const imgs = button.querySelectorAll('img');
    imgs.forEach(img => {
      img.classList.add('hidden');
    });
  });
  changeActiveBtn(prio);
}


function changeActiveBtn(prio) {
  const activeButton = document.querySelector(`.prioBtn[data-prio="${prio}"]`);
  if (activeButton) {
    activeButton.classList.add(`prioBtn${capitalize(prio)}Active`);
    const whiteIcon = activeButton.querySelector(`.prio${prio}smallWhite`);
    if (whiteIcon) {
      whiteIcon.classList.remove('hidden');
    }
  }
}


function clearAddTaskForm() {
  document.getElementById('taskTitle').value = '';
  document.getElementById('taskDescription').value = '';
  document.getElementById('dateInput').value = '';
  updatePrioActiveBtn('');
}


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


function formValidationTrue(input, validationText) {
  validationText.style.display = 'block';
  input.classList.add('formValidationInputBorder');
  isValid = false;
}


function formValidationFalse(input, validationText) {
  validationText.style.display = 'none';
  input.classList.remove('formValidationInputBorder');
}


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


function showTaskAddedAnimation() {
  if (window.location.href.endsWith('addtask.html')) {
    toggleClass('taskAddedBtn', 'dNone', 'show');
    setTimeout(() => {
      return window.location.href = "../html/board.html";
    }, 2000);
  } else {
    showTaskAddedAnimationModal();
  }
}


function showTaskAddedAnimationModal() {
  toggleClass('taskAddedBtn', 'dNone', 'show');
  setTimeout(() => {
    closeModal();
  }, 1000);
}


async function closeAddTaskModal() {
  showTaskAddedAnimation();
  tasks = [];
  await pushDataToArray();
  updateAllTaskCategories();
  initDragDrop();
}


function setActiveTabToBoard() {
  const activeTab = document.querySelector('.menuBtn[href="../html/board.html"]');
  if (activeTab) {
    changeActive(activeTab);
  }
}


function setActiveTabToAddTask() {
  const activeTab = document.querySelector('.menuBtn[href="../html/addtask.html"]');
  changeActive(activeTab);
}


async function toggleDropdown() {
  document.getElementById('assignDropdown').classList.toggle('open');
  document.getElementById('assignSearch').classList.contains('contactsAssignStandard') ? activateAssignSearch() : deactivateAssignSearch();
  let contactsContainer = document.getElementById('contactsToAssign');
  toggleClass('assignSearch', 'contactsAssignStandard', 'contactsAssignOpen');
  if (document.getElementById('assignSearch').classList.contains('contactsAssignOpen')) {
    let contactSorted = contacts.length == 0 ? await getContactsData().then(c => [...c]) : [...contacts];
    contactSorted.sort((a, b) => a.name.localeCompare(b.name));
    contactSorted.forEach(c => contactsContainer.innerHTML += htmlRenderContactsAssign(c));
  } else if (document.getElementById('assignSearch').classList.contains('contactsAssignStandard')) {
    contactsContainer.innerHTML = '';
  }
}


function addNewSubtask() {
  toggleClass('subtaskIconContainer', 'dNone', 'showClass');
  toggleClass('subtaskPlusIcon', 'dNone', 'showClass');
  document.getElementById('subtaskInput').focus();
}


function clearSubtaskInput() {
  document.getElementById('subtaskInput').value = '';
}


function saveSubtask() {
  let subtaskList = document.getElementById('subtaskList');
  let inputText = document.getElementById('subtaskInput').value.trim();
  if (inputText === '') {
    return;
  }
  let subtaskItem = document.createElement('div');
  subtaskItem.classList.add('addedTaskContainer');
  subtaskItem.innerHTML = generateSaveSubtaskHTML(inputText);
  subtaskList.appendChild(subtaskItem);
  document.getElementById('subtaskInput').value = '';
  toggleClass('subtaskIconContainer', 'dNone', 'showClass');
  toggleClass('subtaskPlusIcon', 'dNone', 'showClass');
}


function editSubtask(editIcon) {
  let subtaskItem = editIcon.closest('.addedTaskContainer');
  let subtaskText = subtaskItem.querySelector('.subtaskItemText');
  let editInput = subtaskItem.querySelector('.editSubtaskInput');
  subtaskText.classList.add('dNone');
  editInput.classList.remove('dNone');
  editInput.focus();
  editInput.addEventListener('blur', function () { saveEditedSubtask(subtaskItem, subtaskText, editInput); });
  editInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') { saveEditedSubtask(subtaskItem, subtaskText, editInput); }
  });
}


function saveEditedSubtask(subtaskItem, subtaskText, editInput) {
  subtaskText.textContent = editInput.value.trim();
  subtaskText.classList.remove('dNone');
  editInput.classList.add('dNone');
}


function deleteSubtask(deleteIcon) {
  let subtaskItem = deleteIcon.closest('.addedTaskContainer');
  subtaskItem.remove();
}


function getSubtasks() {
  const subtaskItems = document.querySelectorAll('.addedTaskContainer .subtaskItemText');
  let subtasks = [];
  subtaskItems.forEach(item => {
    subtasks.push({ status: "unchecked", text: item.innerHTML });
  });
  return subtasks;
}

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

function renderAssignedContacts() {
  let assignedContactsContainer = document.getElementById('contactsAssigned');
  assignedContactsContainer.innerHTML = '';
  assignedContacts.forEach(c => assignedContactsContainer.innerHTML += c.profilePic);
}

function activateAssignSearch() {

}

function deactivateAssignSearch() {

}