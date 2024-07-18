let currentPrio = '';


function setActualDate() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('dateInput').setAttribute('min', today);
  document.getElementById('update-date') && document.getElementById('update-date').setAttribute('min', today);
}


async function pushNewTask(event) {
  event.preventDefault();
  await postData("tasks", {
    "title": getId('taskTitle'),
    "description": getId('taskDescription'),
    "date": getId('dateInput'),
    "prio": currentPrio,


    "assignedTo": [
      "dummy"
    ],
    "category": "Technical Task",
    "subtasks": [
      "Strategie entwickeln",
      "Materialien erstellen",
      "Kampagne starten",
    ],
    "status": "toDo",
  });
}


function setPrio(element) {
    const prio = element.getAttribute('data-prio');
    currentPrio = prio;
    updatePrioActiveBtn(prio);
}

function updatePrioActiveBtn(prio) {
  // Reset all buttons and images
  const buttons = document.querySelectorAll('.prioBtn');
  buttons.forEach(button => {
      button.classList.remove('prioBtnUrgentActive', 'prioBtnMediumActive', 'prioBtnLowActive');
      const imgs = button.querySelectorAll('img');
      imgs.forEach(img => {
          img.classList.add('hidden');
      });
  });

  // Add the active class to the clicked button
  const activeButton = document.querySelector(`.prioBtn[data-prio="${prio}"]`);
  if (activeButton) {
      switch(prio) {
          case 'urgent':
              activeButton.classList.add('prioBtnUrgentActive');
              activeButton.querySelector('.priourgentsmallWhite').classList.remove('hidden');
              break;
          case 'medium':
              activeButton.classList.add('prioBtnMediumActive');
              activeButton.querySelector('.priomediumsmallWhite').classList.remove('hidden');
              break;
          case 'low':
              activeButton.classList.add('prioBtnLowActive');
              activeButton.querySelector('.priolowsmallWhite').classList.remove('hidden');
              break;
      }
  }
}