let currentPrio = '';
let taskStatus = '';


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





document.addEventListener('DOMContentLoaded', function() {
  const input = document.getElementById('customInput');
  const initialSvg = document.querySelector('.initial-svg');
  const focusSvgs = document.querySelectorAll('.focus-svg');

  input.addEventListener('focus', function() {
      initialSvg.classList.add('hidden');
      focusSvgs.forEach(svg => svg.classList.remove('hidden'));
  });

  input.addEventListener('blur', function() {
      initialSvg.classList.remove('hidden');
      focusSvgs.forEach(svg => svg.classList.add('hidden'));
  });
});