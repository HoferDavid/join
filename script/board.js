let currentDraggedElement;
let currentSearchInput = "";
let currentTaskStatus;


async function initBoard() {
  init();
  try {
    await loadData();
    await pushDataToArray();
    updateAllTaskCategories();
    initDragDrop();
    applyCurrentSearchFilter();
  } catch (error) {
    console.error("dh Initialisation error:", error);
  }
}


function initDragDrop() {
  updateAllTaskCategories();
  dragDrop();
}


async function pushDataToArray() {
  try {
    let tasksData = await loadData("tasks");
    for (const key in tasksData) {
      const singleTask = tasksData[key];
      if (!singleTask) {
        continue;
      }
      let task = await createTaskArray(key, singleTask);
      tasks.push(task);
    }
  } catch (error) {
    console.error("dh Error pushing tasks to array:", error);
  }
}


async function createTaskArray(key, singleTask) {
  return {
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
}


function toggleVisibility(id) {
  document.getElementById(id).classList.toggle("dNone");
  return document.getElementById(id);
}


function dragDrop() {
  document.querySelectorAll(".todoContainer").forEach((todoContainer) => {
    todoContainer.addEventListener("dragstart", (e) => {
      e.target.classList.add("tilted");
      startDragging(e.target.id);
    });
    todoContainer.addEventListener("dragend", (e) => {
      e.target.classList.remove("tilted");
    });
  });
  document.querySelectorAll(".dropzone").forEach((zone) => {
    zone.addEventListener("dragover", allowDrop);
    zone.addEventListener("drop", (e) => {
      e.preventDefault();
      moveTo(zone.id);
    });
  });
}


function updateTaskCategories(status, categoryId, noTaskMessage) {
  let taskForSection = tasks.filter((task) => task.status === status);
  let categoryElement = document.getElementById(categoryId);
  categoryElement.innerHTML = "";
  if (taskForSection.length > 0) {
    taskForSection.forEach((element) => {
      categoryElement.innerHTML += generateTodoHTML(element);
      if (element.subtasks && element.subtasks.length > 0) {
        updateSubtasksProgressBar(element.subtasks, element.id);
      }
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


function startDragging(id) {
  currentDraggedElement = id;
}


function allowDrop(ev) {
  ev.preventDefault();
}


async function moveTo(status) {
  let task = tasks.find((task) => task.id == currentDraggedElement);
  if (task && status != "") {
    task.status = status;
    initDragDrop();
    applyCurrentSearchFilter();
    await updateData(`${BASE_URL}tasks/${task.id}.json`, task);
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
      const isVisible = title.includes(currentSearchInput) || description.includes(currentSearchInput);
      taskCard.style.display = isVisible ? "block" : "none";
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
  const overlay = document.getElementById("overlay");
  const addTaskOverlay = document.getElementById("addTaskOverlay");
  if (event.target === overlay || event.target === addTaskOverlay) {
    closeModal();
  }
};


function closeModal() {
  const overlay = document.getElementById("overlay");
  const addTaskOverlay = document.getElementById("addTaskOverlay");
  if (overlay || addTaskOverlay) {
    overlay.style.display = "none";
    addTaskOverlay.style.display = "none";
  }
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


function checkScreenWidth(category) {
  const screenWidth = window.innerWidth;
  activeTab = document.querySelector('.menuBtn[href="../html/addtask.html"]');
  taskStatus = category;
  localStorage.setItem('taskCategory', category);
  if (screenWidth < 992) {
    changeActive(activeTab);
    return (window.location.href = "../html/addtask.html");
  } else {
    openAddTaskOverlay();
  }
}


document.addEventListener('DOMContentLoaded', () => {
  const category = localStorage.getItem('taskCategory');
  if (category) {
    console.log(`Category: ${category}`);
    localStorage.removeItem('taskCategory');
  }
});



async function updateSubtaskStatus(taskId, subtaskIndex) {
  let task = tasks.find((task) => task.id === taskId);
  if (task) {
    let subtask = task.subtasks[subtaskIndex];
    if (subtask) {
      subtask.status = subtask.status === "checked" ? "unchecked" : "checked";
      let subtaskCheckbox = document.getElementById(`subtaskCheckbox${subtaskIndex}`);
      if (subtaskCheckbox) {
        subtaskCheckbox.src =
          subtask.status === "checked" ? "../assets/icons/checkboxchecked.svg" : "../assets/icons/checkbox.svg";
      }
      updateSubtasksProgressBar(task.subtasks, taskId);
      await updateData(`${BASE_URL}tasks/${taskId}.json`, task);
    }
  }
}


function updateSubtasksProgressBar(subtasks, taskId) {
  let checkedAmt = subtasks.filter(
    (subtask) => subtask.status === "checked"
  ).length;
  let percent = Math.round((checkedAmt / subtasks.length) * 100);
  document.getElementById(
    `subtasksProgressbarProgress${taskId}`
  ).style.width = `${percent}%`;
  document.getElementById(
    `subtasksProgressbarText${taskId}`
  ).innerHTML = `${checkedAmt}/${subtasks.length} Subtasks`;
}


function enableTaskEdit(taskId) {
  let modalContainer = document.getElementById("modalContainer");
  modalContainer.innerHTML = generateTaskEditHTML(taskId);
  let task = tasks.find((task) => task.id === taskId);
  currentTaskStatus = task.status;
  document.getElementById("editTaskTitle").value = task.title;
  document.getElementById("editTaskDescription").value = task.description;
  document.getElementById("editDateInput").value = task.date;
  updatePrioActiveBtn(task.prio);
  renderAssignedContacts();
}


async function saveEditedTask(event, taskId) {
  event.preventDefault();
  await updateData(`${BASE_URL}tasks/${taskId}.json`, createEditedTask(taskId));
  tasks = [];
  await pushDataToArray();
  openOverlay(taskId);
  updateAllTaskCategories();
  initDragDrop();
  applyCurrentSearchFilter();
}


function createEditedTask(taskId) {
  let originalTask = tasks.find(task => task.id === taskId);
  if (!originalTask) { return; }
  let subtasks = [];
  document.querySelectorAll('#subtaskList .subtaskItem').forEach((subtaskItem, index) => {
    const subtaskText = subtaskItem.querySelector('span').innerText;
    let status = 'unchecked';
    if (originalTask.subtasks && originalTask.subtasks[index]) {
      status = originalTask.subtasks[index].status ? originalTask.subtasks[index].status : 'unchecked';
    }
    subtasks.push({ text: subtaskText, status: status });
  });
  return createEditedTaskReturn(subtasks, originalTask);
}


function createEditedTaskReturn(subtasks, originalTask) {
  return {
    title: document.getElementById('editTaskTitle').value,
    description: document.getElementById('editTaskDescription').value,
    date: document.getElementById('editDateInput').value,
    prio: currentPrio,
    status: currentTaskStatus,
    subtasks: subtasks,
    assignedTo: assignedContacts ? assignedContacts : [],
    category: originalTask.category,
  };
}
