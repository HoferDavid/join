let numberOfBoard = [];
let numberOfTodos = 0;
let numberOfInProgress = 0;
let numberOfAwaitFeedback = 0;
let numberOfDone = 0;
let urgentTasks = [];
let counts = {
  toDo: 0,
  inProgress: 0,
  awaitFeedback: 0,
  done: 0
};

async function initSummary() {
  greetingSummary();
  init();
  await loadCategory();
  taskAssignment();
  showUrgentTask();
}

function greetingSummary() {
  let greetingTime = greeting();
  let greetingName = currentUser.name;

  if (window.matchMedia("(max-width: 1200px)").matches) {
    let greetingMobile = document.getElementById('greetingSummaryMobile');
    let summaryMain = document.getElementById('summaryMain');
    greetingMobile.innerHTML = greetingMobileHTML(greetingTime, greetingName);
    animationGreeting(greetingMobile, summaryMain);
    updateGreetingDesktop(greetingTime, greetingName);
  } else {
    updateGreetingDesktop(greetingTime, greetingName);
  }
}

function greeting() {
  let now = new Date();
  let hours = now.getHours();
  if (hours < 12) {
    return "Good Morning,";
  } else if (hours < 18) {
    return "Good Afternoon,";
  } else {
    return "Good Evening,";
  }
}

function animationGreeting(greetingMobile, summaryMain) {
  greetingMobile.style.display = 'flex';
  setTimeout(() => {
    summaryMain.style.opacity = '0';
    setTimeout(() => {
      greetingMobile.classList.add('hide');
      setTimeout(() => {
        greetingMobile.style.display = 'none';
        summaryMain.style.opacity = '1';
        summaryMain.style.transition = 'opacity 0.9s ease';
      }, 900);
    }, 1000);
  });
}

function updateGreetingDesktop(time, name) {
  let greetingDesktop = document.getElementById('greetingSumm');
  let greetingNameDesktop = document.getElementById('greetingNameDesktop');
  greetingDesktop.innerText = time;
  greetingNameDesktop.innerText = name;
}

async function loadCategory() {
  let tasksData = await loadData("tasks");
  for (const key in tasksData) {
    const task = tasksData[key];
    if (!task) {
      continue;
    }
    numberOfBoard.push(objectTemplateNumberOfBoard(key, task));
    if (task.prio === 'urgent') {
      urgentTasks.push(task);
    }
  }
}

function taskAssignment() {
  getTaskCounts();
  updateElement('howManyTodos', counts.toDo);
  updateElement('howManyInProgress', counts.inProgress);
  updateElement('howManyAwaitFeedback', counts.awaitFeedback);
  updateElement('howManyDone', counts.done);
  updateElement('howManyTaskInBoard', numberOfBoard.length);
}

function getTaskCounts() {
  counts = numberOfBoard.reduce((acc, task) => {
    acc[task.status]++;
    return acc;
  }, counts);
}

function updateElement(id, value) {
  const el = document.getElementById(id);
  if (el) {
    el.innerHTML = value;
  }
};

function showUrgentTask() {
  if (urgentTasks && urgentTasks.length > 0) {
    urgentTasks.sort((a, b) => new Date(a.date) - new Date(b.date));
    updateElement('howManyUrgent', urgentTasks.length);
    let date = new Date(urgentTasks[0].date);
    let options = { year: 'numeric', month: 'long', day: 'numeric' };
    let formattedDate = date.toLocaleDateString('de-DE', options);
    updateElement('summUrgentDate', formattedDate);
  } else {
    updateElement('howManyUrgent', 0);
    updateElement('summUrgentDate', '');
  }
}

function nextPage() {
  window.location.href = 'board.html';
  sessionStorage.setItem('activeTab', 'board');
}