let assignedContacts = [];


async function pushNewTask(event) {
  event.preventDefault();
  await postData("tasks", createNewtask());
  closeAddTaskModal();
  setActiveTab('.menuBtn[href="../html/board.html"]');
}


function createNewtask() {
  return {
    title: getId('taskTitle'),
    description: getId('taskDescription'),
    date: getId('dateInput'),
    prio: currentPrio,
    status: taskStatus,
    subtasks: getSubtasks(),
    assignedTo: assignedContacts,
    category: document.getElementById('categoryInput').value,
  };
}


function setPrio(element) {
  const prio = element.getAttribute('data-prio');
  currentPrio = prio;
  updatePrioActiveBtn(prio);
}


function clearAddTaskForm() {
  document.getElementById('taskTitle').value = '';
  document.getElementById('taskDescription').value = '';
  document.getElementById('dateInput').value = '';
  updatePrioActiveBtn('');
  document.getElementById('subtaskInput').value = '';
  clearSubtaskList();
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
    toggleClass('taskAddedBtn', 'd-None', 'show');
    setTimeout(() => {
      return window.location.href = "../html/board.html";
    }, 2000);
  } else {
    showTaskAddedAnimationModal();
  }
}


function showTaskAddedAnimationModal() {
  toggleClass('taskAddedBtn', 'd-None', 'show');
  setTimeout(() => {
    closeModal();
  }, 2000);
}


async function closeAddTaskModal() {
  if (activeTab == 'Add Task') {
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


function addNewSubtask() {
  let input = document.getElementById('subtaskInput').value.length;
  if (input > -1) {
    document.getElementById('subtaskIconContainer').classList.remove('dNone');
    document.getElementById('subtaskPlusIcon').classList.add('dNone');
  } else {
    document.getElementById('subtaskIconContainer').classList.add('dNone');
    document.getElementById('subtaskPlusIcon').classList.remove('dNone');
  }
}


function clearSubtaskInput() {
  document.getElementById('subtaskInput').value = '';
}


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


document.addEventListener('click', function(event) {
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


function editSubtask(editIcon) {
  let subtaskItem = editIcon.closest('.subtaskEditList');
  let subtaskText = subtaskItem.querySelector('.subtaskItemText');
  let editInput = subtaskItem.querySelector('.editSubtaskInput');
  subtaskText.classList.add('dNone');
  editInput.classList.remove('dNone');
  editInput.focus();
  editInput.addEventListener('blur', function () { saveEditedSubtask(subtaskItem, subtaskText, editInput); });
}


function saveEditedSubtask(subtaskItem, subtaskText, editInput) {
  subtaskText.textContent = editInput.value.trim();
  subtaskText.classList.remove('dNone');
  editInput.classList.add('dNone');
}


function clearSubtaskList() {
  document.getElementById('subtaskList').innerHTML = '';
}


function deleteSubtask(deleteIcon) {
  let subtaskItem = deleteIcon.closest('.subtaskEditList');
  subtaskItem.remove();
}


function getSubtasks() {
  const subtaskItems = document.querySelectorAll('.subtaskList .subtaskItemText');
  let subtasks = [];
  subtaskItems.forEach(item => { subtasks.push({ status: "unchecked", text: item.innerText }); });
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


async function toggleDropdown() {
  document.getElementById('assignDropdown').classList.toggle('open');
  document.getElementById('assignSearch').classList.contains('contactsAssignStandard') ? await openAssignDropdown() : closeAssignDropdown();
  toggleClass('assignSearch', 'contactsAssignStandard', 'contactsAssignOpen');
}


function toggleCategoryDropdown(e, value) {
  e.stopPropagation();
  let input = document.getElementById('categoryInput');
  let wrapper = document.getElementById('selectWrapper');
  let arrow = document.getElementById('categoryDropArrow');
  input.value = wrapper.classList.contains('select-wrapperOpen') ? value : '';
  document.getElementById('selectWrapper').classList.toggle('select-wrapperOpen');
  wrapper.classList.contains('select-wrapperOpen') ? arrow.style.transform = 'rotate(180deg)' : arrow.style.transform = 'rotate(0deg)';
}


function checkOutsideAssign(event) {
  let assignMenu = document.getElementById('assignDropdown');
  if (assignMenu.classList.contains('open') && !assignMenu.contains(event.target)) {
    toggleDropdown();
  };
}


function renderAssignedContacts() {
  let assignedContactsContainer = document.getElementById('contactsAssigned');
  assignedContactsContainer.innerHTML = '';
  assignedContacts.forEach(c => assignedContactsContainer.innerHTML += c.profilePic);
}


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


async function assignSearchInput() {
  let searchInput = document.getElementById('assignSearch');
  let contactsContainer = document.getElementById('contactsToAssign');
  let searchText = searchInput.value.toLowerCase();
  contactsContainer.innerHTML = '';
  let contactSorted = contacts.length == 0 ? await getContactsData().then(c => [...c]) : [...contacts];
  contactSorted.sort((a, b) => a.name.localeCompare(b.name));
  contactSorted.filter(c => c.name.toLowerCase().includes(searchText)).forEach(c => contactsContainer.innerHTML += htmlRenderContactsAssign(c));
}


