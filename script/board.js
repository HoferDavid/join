let currentDraggedElement;
let currentSearchInput = "";


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
    console.log("tasks Firebase: ", tasksData);
    for (const key in tasksData) {
      const singleTask = tasksData[key];
      let task = await createTask(key, singleTask);
      tasks.push(task);
    }
    console.log("tasks Array: ", tasks);
  } catch (error) {
    console.error("dh Error pushing tasks to array:", error);
  }
}


async function createTask(key, singleTask) {
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


function toggleVisibility(id) {
  document.getElementById(id).classList.toggle("dNone");
  return document.getElementById(id);
}


function dragDrop() {
  document.querySelectorAll(".todoContainer").forEach((todoContainer) => {
    todoContainer.addEventListener("dragstart", (e) => { e.target.classList.add("tilted");
      startDragging(e.target.id); });
    todoContainer.addEventListener("dragend", (e) => { e.target.classList.remove("tilted"); });
  });
  document.querySelectorAll(".dropzone").forEach((zone) => { zone.addEventListener("dragover", allowDrop);
    zone.addEventListener("drop", (e) => { e.preventDefault();
      moveTo(zone.id);
    });
  });
}


function updateTaskCategories(status, categoryId, noTaskMessage) {
  let taskForSection = tasks.filter((task) => task.status === status);
  let categoryElement = document.getElementById(categoryId);
  categoryElement.innerHTML = '';

  if (taskForSection.length > 0) {
    taskForSection.forEach((element) => { categoryElement.innerHTML += generateTodoHTML(element); 
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
    await updateTaskInFirebase(task.id, task);
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
  const overlay = document.getElementById('overlay');
  const addTaskOverlay = document.getElementById('addTaskOverlay');
  if (event.target === overlay || event.target === addTaskOverlay) {
      closeModal();
  }
};


function closeModal() {
  const overlay = document.getElementById('overlay');
  const addTaskOverlay = document.getElementById('addTaskOverlay');
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
  if (screenWidth < 992) {
    changeActive(activeTab);
    return window.location.href = "../html/addtask.html";
  } else {
    openAddTaskOverlay();
  }
}


async function updateSubtaskStatus(taskId, subtaskIndex) {
  let task = tasks.find((task) => task.id === taskId);
  if (task) {
      let subtask = task.subtasks[subtaskIndex];
      if (subtask) {
          subtask.status = subtask.status === 'checked' ? 'unchecked' : 'checked';
          let subtaskCheckbox = document.getElementById(`subtaskCheckbox${subtaskIndex}`);
          if (subtaskCheckbox) {
              subtaskCheckbox.src = subtask.status === 'checked' ? '../assets/icons/checkboxchecked.svg' : '../assets/icons/checkbox.svg';
          }
          updateSubtasksProgressBar(task.subtasks, taskId);
          await updateTaskInFirebase(taskId, task);
      }
  }
}


function updateSubtasksProgressBar(subtasks, taskId) {
  let checkedAmt = subtasks.filter(subtask => subtask.status === 'checked').length;
  let percent = Math.round((checkedAmt / subtasks.length) * 100);
  document.getElementById(`subtasksProgressbarProgress${taskId}`).style.width = `${percent}%`;
  document.getElementById(`subtasksProgressbarText${taskId}`).innerHTML = `${checkedAmt}/${subtasks.length} Subtasks`;
}


function enableTaskEdit(id) {
  let modalContainer = document.getElementById('modalContainer');
  modalContainer.innerHTML = generateTaskEditHTML(id);
}



// in progress
function generateTaskEditHTML(id) {
  return /*html*/ `
    <div class="modalToDoContent">

      <div class="modalCategoryContainer">
        <img class="modalCloseIcon" onclick="closeModal()" src="../assets/icons/clearIcon.svg" alt="">
      </div>
      <div class="modalScrollbarWrapper">
        <div class="modalHeader"></div>
        <div class="modalDescription" id="modalDescription"></div>
        <div class="modalDateContainer">
          <div class="modalDateText">Due date:</div>
          <div></div>
        </div>
        <div class="modalPrioContainer">
          <div class="modalPrioText">Priority:</div>
          <div class="modalPrioIconContainer">
            <div></div>
            <img src="../assets/icons/priolowsmall.svg">
          </div>
        </div>
        <div class="modalAssignedToContainer">
          <div class="modalAssignedToText">Assigned To:</div>
          <div class="modalAssignedToContainer"></div>
        </div>
        <div>
          <div class="modalSubtasksText">Subtasks</div>
          <div class="modalSubtasksContainer"></div>
        </div>
      </div>

      <div class="editBottomContainer">
      <div class="saveTaskEditBtn" onclick="">
          <div>Ok</div>
          <img src="../assets/icons/check.svg">
      </div>
    </div>
      </div>
    </div>
  `;
  
}
