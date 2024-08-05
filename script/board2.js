/**
 * Opens the add task overlay and sets up the necessary content.
 * 
 * @async @function
 */
async function openAddTaskOverlay() {
    let addTaskOverlay = document.getElementById("addTaskOverlay");
    assignedContacts = [];
    addTaskOverlay.innerHTML = await fetchAddTaskTemplate();
    addTaskOverlay.style.display = "block";
  }
  
  
  /**
   * Opens the overlay with the content for the task with the given ID.
   * 
   * @param {string} elementId - The ID of the task to open.
   */
  function openOverlay(elementId) {
    let element = tasks.find((task) => task.id === elementId);
    let overlay = document.getElementById("overlay");
    overlay.innerHTML = generateOpenOverlayHTML(element);
    overlay.style.display = "block";
  }
  
  
  /**
   * Closes the modal by hiding the overlay and add task overlay elements.
   */
  function closeModal() {
    const overlay = document.getElementById("overlay");
    const addTaskOverlay = document.getElementById("addTaskOverlay");
    if (overlay || addTaskOverlay) {
      overlay.style.display = "none";
      addTaskOverlay.style.display = "none";
    }
    document.body.classList.remove("modalOpen");
  }
  
  
  /**
   * Updates the status of a subtask and updates the corresponding task.
   * 
   * @async
   * @param {string} taskId - The ID of the task.
   * @param {number} subtaskIndex - The index of the subtask to update.
   */
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
  
  
  /**
   * Enables editing of a task by populating the edit modal with the task's data.
   * 
   * @param {string} taskId - The ID of the task to edit.
   */
  function enableTaskEdit(taskId) {
    let modalContainer = document.getElementById("modalContainer");
    modalContainer.innerHTML = generateTaskEditHTML(taskId);
    let task = tasks.find((task) => task.id === taskId);
    assignedContacts = task.assignedTo ? task.assignedTo : [];
    currentTaskStatus = task.status;
    document.getElementById("editTaskTitle").value = task.title;
    document.getElementById("editTaskDescription").value = task.description;
    document.getElementById("editDateInput").value = task.date;
    updatePrioActiveBtn(task.prio);
    renderAssignedContacts();
  }
  
  
  /**
   * Creates an edited task object from the form inputs and original task data.
   * 
   * @param {string} taskId - The ID of the task to edit.
   * @returns {Object} The edited task object.
   */
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
  
  
  /**
   * Helper function to create the edited task object.
   * 
   * @param {Object[]} subtasks - The updated subtasks.
   * @param {Object} originalTask - The original task object.
   * @returns {Object} The edited task object.
   */
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
  
  
  /**
   * Saves the edited task and updates the board accordingly.
   * 
   * @async
   * @param {Event} event - The form submission event.
   * @param {string} taskId - The ID of the task to save.
   */
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
  
  
  /**
   * Closes the modal if outside the overlay or add task overlay is clicked.
   * 
   * @param {MouseEvent} event - The mouse click event.
   */
  window.onclick = function (event) {
    const overlay = document.getElementById("overlay");
    const addTaskOverlay = document.getElementById("addTaskOverlay");
    if (event.target === overlay || event.target === addTaskOverlay) {
      closeModal();
    }
  };
  
  
  /**
   * Removes the task category from local storage if it exists.
   */
  document.addEventListener('DOMContentLoaded', () => {
    const category = localStorage.getItem('taskCategory');
    if (category) {
      localStorage.removeItem('taskCategory');
    }
  });
  