let BASE_URL = 'https://taskstest-a5c3d-default-rtdb.europe-west1.firebasedatabase.app/';
let tasks = [];
let currentDraggedElement;


async function initBoard() {
    try {
        await getDataFromFirebase();
        // await postDataToFirebase('tasks', {'description': "rewfrewfe", "title": "title",  "status": "toDo", "category": "User Story", "assignedTo": {"name": "vorname", "surname": "secname"}, "date": "05/09/24", "prio": "urgent", "subtasks": {"one": "one", "two": "two"}});
        await pushDataToArray();
        initDragDrop();
    } catch (error) {
        console.error('dh Initialisation error:', error);
    }
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
        console.log('notes Firebase: ', tasksData);
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
                'Content-Type':' application/json',
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
                'Content-Type':' application/json',
            },
            body: JSON.stringify(updatedTask)
        });
        return await response.json();
    } catch (error) {
        console.error('dh Error putting data:', error);
    }
}


function initDragDrop() {
    updateToDo();
    updateInProgress();
    updateAwaitFeedback();
    updateDone();
    dragDrop();
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


function updateToDo() {
    let toDo = tasks.filter(t => t['status'] == 'toDo');
    document.getElementById('toDo').innerHTML = '';
    if (toDo.length > 0) {
        toDo.forEach(element => {document.getElementById('toDo').innerHTML += generateTodoHTML(element);});
    } else {
        document.getElementById('toDo').innerHTML = `<div class="noTaskPlaceholder">No tasks To do</div>`;
    }
}


function updateInProgress() {
    let inProgress = tasks.filter(t => t['status'] == 'inProgress');
    document.getElementById('inProgress').innerHTML = '';
    if (inProgress.length > 0) {
        inProgress.forEach(element => {document.getElementById('inProgress').innerHTML += generateTodoHTML(element);});
    } else {
        document.getElementById('inProgress').innerHTML = `<div class="noTaskPlaceholder">No tasks To do</div>`;
    }
}


function updateAwaitFeedback() {
    let awaitFeedback = tasks.filter(t => t['status'] == 'awaitFeedback');
    document.getElementById('awaitFeedback').innerHTML = '';
    if (awaitFeedback.length > 0) {
        awaitFeedback.forEach(element => {document.getElementById('awaitFeedback').innerHTML += generateTodoHTML(element);});
    } else {
        document.getElementById('awaitFeedback').innerHTML = `<div class="noTaskPlaceholder">No tasks To do</div>`;
    }
}


function updateDone() {
    let done = tasks.filter(t => t['status'] == 'done');
    document.getElementById('done').innerHTML = '';
    if (done.length > 0) {
        done.forEach(element => {document.getElementById('done').innerHTML += generateTodoHTML(element);});
    } else {
        document.getElementById('done').innerHTML = `<div class="noTaskPlaceholder">No tasks Done</div>`;
    }
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
        await updateTaskInFirebase(task.id, task);
    }
}

function toggleDisplay() {
    const mobileHeader = document.getElementById('boardHeaderMobile');
    const mobileSearchContainer = document.getElementById('boardSearchContainerMobile');
    const desktopHeader = document.getElementById('boardHeaderDesktop');
    const desktopSearchContainer = document.getElementById('boardHeaderSearchContainerDesktop');

    if (window.innerWidth >= 768) {
        switchUiToDesktop(mobileHeader, mobileSearchContainer, desktopHeader, desktopSearchContainer);
    } else {
        switchUiToMobile(mobileHeader, mobileSearchContainer, desktopHeader, desktopSearchContainer);
    }
}

window.addEventListener('load', toggleDisplay);
window.addEventListener('resize', toggleDisplay);


