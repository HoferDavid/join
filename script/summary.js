let numberOfBoard = [];
let numberOfTodos = 0;
let numberOfInProgress = 0;
let numberOfAwaitFeedback = 0;
let numberOfDone = 0;
let urgentTasks = [];

async function loadCategory() {
  try {
    let tasksData = await loadData("tasks");
    numberOfBoard = [];
    urgentTasks = [];
    for (const key in tasksData) {
      const task = tasksData[key];
      if (!task) {
        continue;
      }
      numberOfBoard.push({
        "id": key,
        "assignedTo": task.assignedTo,
        "category": task.category,
        "date": task.date,
        "description": task.description,
        "prio": task.prio,
        "status": task.status,
        "subtasks": task.subtasks,
        "title": task.title,
      });
      if (task.prio === 'urgent') {
        urgentTasks.push(task);
      }
    }
    console.log("Laden der Kategorien abgeschlossen:");
    console.log("numberOfBoard:", numberOfBoard);
    console.log("urgentTasks:", urgentTasks);
  } catch (error) {
    console.error("Fehler beim Laden der Kategorien:", error);
  }
}

function getTaskCounts() {
  let counts = {
    toDo: 0,
    inProgress: 0,
    awaitFeedback: 0,
    done: 0
  };

  numberOfBoard.forEach(task => {
    switch (task.status) {
      case 'toDo':
        counts.toDo++;
        break;
      case 'inProgress':
        counts.inProgress++;
        break;
      case 'awaitFeedback':
        counts.awaitFeedback++;
        break;
      case 'done':
        counts.done++;
        break;
    }
  });

  console.log("Anzahl Aufgaben:");
  console.log("toDo:", counts.toDo);
  console.log("inProgress:", counts.inProgress);
  console.log("awaitFeedback:", counts.awaitFeedback);
  console.log("done:", counts.done);

  return counts;
}

async function taskAssignment() {
  const counts = getTaskCounts();

  const updateElement = (id, value) => {
    const el = document.getElementById(id);
    if (el) {
      el.innerHTML = value;
    } else {
      console.error(`Element mit ID ${id} nicht gefunden.`);
    }
  };

  updateElement('howManyTodos', counts.toDo);
  updateElement('howManyInProgress', counts.inProgress);
  updateElement('howManyAwaitFeedback', counts.awaitFeedback);
  updateElement('howManyDone', counts.done);
  updateElement('howManyTaskInBoard', numberOfBoard.length);

  console.log("Zusammenfassung gerendert.");
}

function showUrgentTask() {
  if (urgentTasks && urgentTasks.length > 0) {
    urgentTasks.sort((a, b) => new Date(a.date) - new Date(b.date));
    const updateElement = (id, value) => {
      const el = document.getElementById(id);
      if (el) {
        el.innerHTML = value;
      } else {
        console.error(`Element mit ID ${id} nicht gefunden.`);
      }
    };
    updateElement('howManyUrgent', urgentTasks.length);

    let date = new Date(urgentTasks[0].date);
    let options = { year: 'numeric', month: 'long', day: 'numeric' };
    let formattedDate = date.toLocaleDateString('de-DE', options);

    updateElement('summUrgentDate', formattedDate);
  } else {
    const updateElement = (id, value) => {
      const el = document.getElementById(id);
      if (el) {
        el.innerHTML = value;
      } else {
        console.error(`Element mit ID ${id} nicht gefunden.`);
      }
    };
    updateElement('howManyUrgent', 0);
    updateElement('summUrgentDate', '');
  }
  console.log("Dringende Aufgaben angezeigt:", urgentTasks);
}

async function initSummary() {
  if (localStorage.getItem('showGreetings') === 'true') {
    console.log('Displaying greeting');
    greetingSummary();
    // localStorage.setItem('showGreetings', 'false');
  }

  await loadCategory();
  await taskAssignment();
  showUrgentTask();
}

function displayGreeting() {
  if (localStorage.getItem('showGreetings') === 'true') {
    console.log('Displaying greeting');
    greetingSummary();
    // localStorage.setItem('showGreetings', 'false');
  } else {
    console.log('showGreetings is not true');
  }
}

function greetingSummary() {
  let greetingTime = greeting();
  let greetingName = displayGreetingWithName();


  if (window.matchMedia("(max-width: 1200px)").matches) {
    console.log('Mobile view detected');
    let greetingMobile = document.getElementById('greetingSummaryMobile');
    let summaryMain = document.getElementById('summaryMain');

    greetingMobile.innerHTML = greetingMobileHTML(greetingTime, greetingName);
    console.log('Greeting Mobile HTML:', greetingMobile.innerHTML);

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
      }, 2000);
    });
  } else {
    console.log('Desktop view detected');
    let greetingDesktop = document.getElementById('greetingSumm');
    let greetingNameDesktop = document.getElementById('greetingNameDesktop');
    greetingDesktop.innerText = greetingTime;
    greetingNameDesktop.innerText = greetingName;
  }
}

function greetingMobileHTML(greetingTime, greetingName) {
  return `
    <div class="summ-greeting-mobile">
      <h3 class="summ-day-greeting">${greetingTime}</h3>
      <span class="summ-person-greeting">${greetingName}</span>
    </div>
  `;
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

function displayGreetingWithName() {
  let userName = currentUser.name;
  return userName;
}

document.addEventListener('DOMContentLoaded', () => {
  initSummary();
});

async function initSummary() {
  await loadCategory();
  await taskAssignment();
  showUrgentTask();
  displayGreeting();
}

function nextPage() {
  window.location.href = 'board.html';
}