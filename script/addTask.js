async function pushNewTask(event) {
  event.preventDefault();
  await postData("tasks", {
    "title": getId('taskTitle'),
    "description": getId('taskDescription'),
    "date": getId('dateInput'),
    "prio": currentPrio,
    "status": taskStatus,

    "assignedTo": [
      "dummy"
    ],
    "category": "Technical Task",
    "subtasks": [
      {
        "status": "unchecked",
        "text": "Identify root cause"
      },
      {
        "status": "unchecked",
        "text": "Implement fix"
      },
      {
        "status": "unchecked",
        "text": "Test on multiple devices"
      }
    ],
  });
  closeAddTaskModal();
  setActiveTabToBoard();
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
    const taskAddedBtn = document.getElementById('taskAddedBtn');
    taskAddedBtn.classList.remove('dNone');
    taskAddedBtn.classList.add('show');
    setTimeout(() => {
      taskAddedBtn.classList.add('fade-out');
      return window.location.href = "../html/board.html";
    }, 2000);
  } else {
    showTaskAddedAnimationModal(taskAddedBtn);
  }
}


function showTaskAddedAnimationModal(taskAddedBtn) {
  taskAddedBtn.classList.remove('dNone');
  taskAddedBtn.classList.add('show');
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

function toggleDropdown() {
  document.getElementById('assignDropdown').classList.toggle('open');
  document.getElementById('assignSearch').classList.contains('contactsAssignStandard') ? activateAssignSearch() : deactivateAssignSearch();
  toggleClass('assignSearch', 'contactsAssignStandard', 'contactsAssignOpen');
}

function activateAssignSearch() {

}

function deactivateAssignSearch() {

}