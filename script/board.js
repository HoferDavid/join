let BASE_URL = 'https://join-273-default-rtdb.europe-west1.firebasedatabase.app/';
let tasks = [];
let currentDraggedElement;
let currentSearchInput = '';


// Function only for Testing
async function pushToFirebaseTest() {
    await postDataToFirebase('tasks', {
        "assignedTo": ["Laura Hoffmann", "Max Mustermann", "Erika Musterfrau", "Hans Meier"],
        "category": "Technical Task",
        "description": "Planen und starten Sie die neue Marketingkampagne.",
        "date": "10/08/2024",
        "prio": "urgent",
        "subtasks": [
            "Strategie entwickeln",
            "Materialien erstellen",
            "Kampagne starten"
        ],
        "title": "Marketingkampagne",
        "status": "toDo"
    });
}


async function initBoard() {
    init();
    try {
        await getDataFromFirebase();
        // pushToFirebaseTest();
        await pushDataToArray();
        updateAllTaskCategories();
        initDragDrop();
        applyCurrentSearchFilter();
    } catch (error) {
        console.error('dh Initialisation error:', error);
    }
}

function initDragDrop() {
    updateAllTaskCategories();
    dragDrop();
}


async function getDataFromFirebase(path = '') {
    try {
        let response = await fetch(BASE_URL + path + '.json');
        let responseAsJson = await response.json();
        return responseAsJson;
    } catch (error) {
        console.error('dh Error fetching data:', error);
    }
}


async function pushDataToArray() {
    try {
        let tasksData = await getDataFromFirebase('tasks');
        // console.log('notes Firebase: ', tasksData);
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
                "title": singleTask.title
            };
            tasks.push(task);
        }
    } catch (error) {
        console.error('dh Error pushing tasks to array:', error);
    }
    console.log('tasks Array: ', tasks);
}


async function postDataToFirebase(path = '', data = {}) {
    try {
        let response = await fetch(BASE_URL + path + '.json', {
            method: 'POST',
            header: {
                'Content-Type': ' application/json',
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error('dh Error posting data:', error);
    }
}


async function updateTaskInFirebase(id, updatedTask) {
    try {
        let response = await fetch(`${BASE_URL}tasks/${id}.json`, {
            method: 'PUT',
            header: {
                'Content-Type': ' application/json',
            },
            body: JSON.stringify(updatedTask)
        });
        return await response.json();
    } catch (error) {
        console.error('dh Error putting data:', error);
    }
}


function dragDrop() {
    document.querySelectorAll('.todoContainer').forEach(todoContainer => {
        todoContainer.addEventListener('dragstart', (e) => {
            e.target.classList.add('tilted');
            startDragging(e.target.id);
        });
        todoContainer.addEventListener('dragend', (e) => {
            e.target.classList.remove('tilted');
        });
    });
    document.querySelectorAll('.dropzone').forEach(zone => {
        zone.addEventListener('dragover', allowDrop);
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            moveTo(zone.id);
        });
    });
}


function updateTaskCategories(status, categoryId, noTaskMessage) {
    let taskForSection = tasks.filter(t => t['status'] === status);
    let categoryElement = document.getElementById(categoryId);
    categoryElement.innerHTML = '';
    if (taskForSection.length > 0) {
        taskForSection.forEach(element => {
            categoryElement.innerHTML += generateTodoHTML(element);
        });
    } else {
        categoryElement.innerHTML = `<div class="noTaskPlaceholder">${noTaskMessage}</div>`;
    }
}


function updateAllTaskCategories() {
    updateTaskCategories('toDo', 'toDo', 'No tasks To do');
    updateTaskCategories('inProgress', 'inProgress', 'No tasks in progress');
    updateTaskCategories('awaitFeedback', 'awaitFeedback', 'No tasks await Feedback');
    updateTaskCategories('done', 'done', 'No tasks Done');
}


function startDragging(id) {
    currentDraggedElement = id;
}


function allowDrop(ev) {
    ev.preventDefault();
}


async function moveTo(status) {
    let task = tasks.find(task => task.id == currentDraggedElement);
    if (task) {
        task.status = status;
        initDragDrop();
        applyCurrentSearchFilter();
        await updateTaskInFirebase(task.id, task);
    }
}


function searchTasks(inputValue) {
    emptyDragAreaWhileSearching();
    currentSearchInput = inputValue.toLowerCase();
    const taskCards = document.querySelectorAll('.todoContainer');
    taskCards.forEach(taskCard => {
        const titleElement = taskCard.querySelector('.toDoHeader');
        const descriptionElement = taskCard.querySelector('.toDoDescription');
        if (titleElement || descriptionElement) {
            const title = titleElement.textContent.trim().toLowerCase();
            const description = descriptionElement.textContent.trim().toLowerCase();
            const isVisible = title.includes(currentSearchInput) || description.includes(currentSearchInput);
            taskCard.style.display = isVisible ? 'block' : 'none';
        }
    });
}


function applyCurrentSearchFilter() {
    if (currentSearchInput) {
        searchTasks(currentSearchInput);
    }
}


function emptyDragAreaWhileSearching() {
    let dragAreas = document.querySelectorAll('.noTaskPlaceholder');
    dragAreas.forEach(dragArea => {
        if (dragArea.classList.contains('noTaskPlaceholder')) {
            dragArea.classList.remove('noTaskPlaceholder');
            dragArea.innerHTML = '';
        } 
    });
}