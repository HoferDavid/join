let tasks = [];
let currentDraggedElement;
let currentSearchInput = "";


// Function only for Testing
async function pushToFirebaseTest() {
  await postDataToFirebase("tasks", {
    "assignedTo": [
      "Laura Hoffmann",
      "Max Mustermann",
      "Erika Musterfrau",
      "Hans Meier",
    ],
    "category": "Technical Task",
    "description": "Planen und starten Sie die neue Marketingkampagne.",
    "date": "10/08/2024",
    "prio": "urgent",
    "subtasks": [
      "Strategie entwickeln",
      "Materialien erstellen",
      "Kampagne starten",
    ],
    "title": "Marketingkampagne",
    "status": "toDo",
  });
}


async function initBoard() {
  init();
  try {
    await getDataFromFirebase();
    /*FIXME - Delete?    // pushToFirebaseTest();*/
    await pushDataToArray();
    updateAllTaskCategories();
    applyCurrentSearchFilter();
    /*FIXME -     //  dragDrop();*/
  } catch (error) {
    console.error("dh Initialisation error:", error);
  }
}


function initDragDrop() {
  updateAllTaskCategories();
  applyCurrentSearchFilter();
  /*FIXME - Delete?  // dragDrop();*/
}


async function getDataFromFirebase(path = "") {
  try {
    let response = await fetch(BASE_URL + path + ".json");
    let responseAsJson = await response.json();
    return responseAsJson;
  } catch (error) {
    console.error("dh Error fetching data:", error);
  }
}


async function pushDataToArray() {
  try {
    let tasksData = await getDataFromFirebase("tasks");
    console.log('tasks Firebase: ', tasksData);
    for (const key in tasksData) {
      const singleTask = tasksData[key];
      let task = {
        "id": key,
        "assignedTo": singleTask.assignedTo,
        "category": singleTask.category,
        "date": singleTask.date,
        "description": singleTask.description,
        "prio": singleTask.prio,
        "status": singleTask.status,
        "subtasks": singleTask.subtasks,
        "title": singleTask.title,
      };
      tasks.push(task);
    }
  } catch (error) {
    console.error("dh Error pushing tasks to array:", error);
  }
  console.log("tasks Array: ", tasks);
}


// async function postDataToFirebase(path = "", data = {}) {
//   try {
//     let response = await fetch(BASE_URL + path + ".json", {
//       method: "POST",
//       header: {
//         "Content-Type": " application/json",
//       },
//       body: JSON.stringify(data),
//     });
//     return await response.json();
//   } catch (error) {
//     console.error("dh Error posting data:", error);
//   }
// }


async function updateTaskInFirebase(id, updatedTask) {
  try {
    let response = await fetch(`${BASE_URL}tasks/${id}.json`, {
      method: "PUT",
      header: {
        "Content-Type": " application/json",
      },
      body: JSON.stringify(updatedTask),
    });
    return await response.json();
  } catch (error) {
    console.error("dh Error putting data:", error);
  }
}


async function deleteTask(id) {
  await deleteData(`tasks/${id}`);
  tasks = tasks.filter(task => task.id !== id);
  closeModal();
  initDragDrop();
}


function toggleVisibility(id) {
  document.getElementById(id).classList.toggle('dNone');
  return document.getElementById(id);
}


// function dragDrop() {
//   document.querySelectorAll(".todoContainer").forEach((todoContainer) => {
//     todoContainer.addEventListener("dragstart", event => startDragging(event));
//     todoContainer.addEventListener("dragend", event => endDragging(event));
//   });
//   document.querySelectorAll(".taskDragArea").forEach((zone) => {
//     zone.addEventListener("dragover", event => overDragging(event));
//     zone.addEventListener('dragleave', event => leaveDragging(event));
//     zone.addEventListener("drop", event => dropDragging(event));
//   });
//   document.querySelectorAll(".todoContainer").forEach((todoContainer) => {
//     todoContainer.removeEventListener("dragstart", event => startDragging(event));
//     todoContainer.removeEventListener("dragend", event => endDragging(event));
//   });
//   document.querySelectorAll('.taskDragArea').forEach((zone) => {
//     zone.removeEventListener("dragover", event => overDragging(event));
//     zone.removeEventListener('dragleave', event => leaveDragging(event));
//     zone.removeEventListener("drop", event => dropDragging(event));
//   });
// }


function startDragging(e) {
  let vw = window.innerWidth || document.documentElement.clientWidth;
  let maxVw = 1200;
  e.target.classList.add("tilted");
  currentDraggedElement = e.target.id;
  if (vw < maxVw) {
    document.querySelectorAll('.todoContainer, .headerSection, .noTaskPlaceholder').forEach(todo => todo.style.display = 'none');

    document.querySelectorAll('.taskDragArea').forEach(zone => zone.classList.add('dropZoneHighlight'));
  }
};


function endDragging(e) {
  let vw = window.innerWidth || document.documentElement.clientWidth;
  let maxVw = 1200;
  e.target.classList.remove("tilted");
  if (vw < maxVw) {
    document.querySelectorAll('.todoContainer, .headerSection, .noTaskPlaceholder').forEach(todo => todo.style.display = '');
    document.querySelectorAll('.taskDragArea').forEach(zone => zone.classList.remove('dropZoneHighlight'));
  }
}


function overDragging(e) {
  let vw = window.innerWidth || document.documentElement.clientWidth;
  let maxVw = 1200;
  e.preventDefault();
  if (vw < maxVw) {
    e.currentTarget.classList.add('dropZoneHighlightAbove');
  }
}


function leaveDragging(e) {
  let vw = window.innerWidth || document.documentElement.clientWidth;
  let maxVw = 1200;
  if (vw < maxVw) {
    e.currentTarget.classList.remove('dropZoneHighlightAbove');
  }
}


function dropDragging(e) {
  let vw = window.innerWidth || document.documentElement.clientWidth;
  let maxVw = 1200;
  e.preventDefault();
  moveTo(e.target.title);
  if (vw < maxVw) {
    e.currentTarget.classList.remove("dropZoneHighlightAbove");
  }
}


function updateTaskCategories(status, categoryId, noTaskMessage) {
  let taskForSection = tasks.filter((t) => t["status"] === status);
  let categoryElement = document.getElementById(categoryId);
  categoryElement.innerHTML = "";
  if (taskForSection.length > 0) {
    taskForSection.forEach((element) => {
      categoryElement.innerHTML += generateTodoHTML(element);
    });
  } else {
    categoryElement.innerHTML = `<div class="noTaskPlaceholder">${noTaskMessage}</div>`;
  }
}


function updateAllTaskCategories() {
  updateTaskCategories("toDo", "toDo", "No tasks to do");
  updateTaskCategories("inProgress", "inProgress", "No tasks in progress");
  updateTaskCategories("awaitFeedback", "awaitFeedback", "No tasks await feedback");
  updateTaskCategories("done", "done", "No tasks done");
}

async function moveTo(status) {
  let task = tasks.find((task) => task.id == currentDraggedElement);
  if (task && status != '') {
    task.status = status;
    await updateTaskInFirebase(task.id, task);
    initDragDrop();
  }
}


function searchTasks(inputValue) {
  emptyDragAreaWhileSearching();
  currentSearchInput = inputValue.toLowerCase();
  const taskCards = document.querySelectorAll(".todoContainer");
  taskCards.forEach((taskCard) => {
    const titleElement = taskCard.querySelector(".toDoHeader");
    const descriptionElement = taskCard.querySelector(".toDoDescription");
    if (titleElement || descriptionElement) {
      const title = titleElement.textContent.trim().toLowerCase();
      const description = descriptionElement.textContent.trim().toLowerCase();
      const isVisible =
        title.includes(currentSearchInput) ||
        description.includes(currentSearchInput);
      taskCard.style.display = isVisible ? "flex" : "none";
    }
  });
}


function applyCurrentSearchFilter() {
  if (currentSearchInput) {
    searchTasks(currentSearchInput);
  }
}


function emptyDragAreaWhileSearching() {
  let dragAreas = document.querySelectorAll(".noTaskPlaceholder");
  dragAreas.forEach((dragArea) => {
    if (dragArea.classList.contains("noTaskPlaceholder")) {
      dragArea.classList.remove("noTaskPlaceholder");
      dragArea.innerHTML = "";
    }
  });
}


// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == overlay || event.target == addTaskOverlay) {
    overlay.style.display = "none";
    addTaskOverlay.style.display = "none";
    document.body.classList.remove("modalOpen");
  }
};


function closeModal() {
  overlay.style.display = "none";
  addTaskOverlay.style.display = "none";
  document.body.classList.remove("modalOpen");
}


function openOverlay(elementId) {
  let element = tasks.find((task) => task.id === elementId);
  let overlay = document.getElementById("overlay");
  overlay.innerHTML = generateOpenOverlayHTML(element);
  overlay.style.display = "block";
}


async function openAddTaskOverlay() {
  let addTaskOverlay = document.getElementById("addTaskOverlay");
  addTaskOverlay.innerHTML = await fetchAddTaskTemplate();
  addTaskOverlay.style.display = "block";
}


async function fetchAddTaskTemplate() {
  let response = await fetch('../assets/templates/html/addtasktemplate.html');
  let html = await response.text();
  return `
      <div class="addTaskModalContainer">
        ${html}
      </div>
    `;
}
