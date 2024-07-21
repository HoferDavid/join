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
      "Strategie entwickeln",
      "Materialien erstellen",
      "Kampagne starten",
    ],

  });
  closeAddTaskModal();
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


function showTaskAddedAnimation() {
  if (window.location.href.endsWith('addtask.html')) {
    const taskAddedBtn = document.getElementById('taskAddedBtn');
    taskAddedBtn.classList.remove('dNone');
    taskAddedBtn.classList.add('show');
    setTimeout(() => {
        taskAddedBtn.classList.add('fade-out');
        return window.location.href = "../html/board.html";
    }, 1000);
  } else {
    showTaskAddedAnimationModal(taskAddedBtn);
  }
}


function showTaskAddedAnimationModal(taskAddedBtn) {
  taskAddedBtn.classList.remove('dNone');
  taskAddedBtn.classList.add('show');
  setTimeout(() => {
      // taskAddedBtn.classList.add('fade-out');
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
