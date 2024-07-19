// Dummy Codes to visualize User Badges
function getRandomColor(badgeColors) {
    return badgeColors[Math.floor(Math.random() * badgeColors.length)];
}

const badgeColors = ['rgb(255, 121, 0)', 'rgb(29, 215, 193)', 'rgb(71, 47, 138)', 'rgb(255, 187, 43)', 'rgb(252, 113, 255)', 'rgb(110, 82, 255)', 'rgb(148, 38, 255)', 'rgb(255, 69, 70)'];
// Code above onöy for testing purposes

function generateTodoHTML(element) {
    let categoryHTML = generateCategoryHTML(element.category);
    let titleHTML = generateTitleHTML(element.title);
    let descriptionHTML = generateDescriptionHTML(element.description);
    let subtasksHTML = generateSubtasksHTML(element.subtasks);
    let assignedToHTML = generateAssignedToHTML(element.assignedTo);
    let prioHTML = generatePrioHTML(element.prio);

    return /*html*/ `
        <div draggable="true" id="${element.id}" class="todoContainer" ondragstart="startDragging(event)" ondragend="endDragging(event)" onclick="openOverlay('${element.id}')">
            <div class="toDoContent">
                ${categoryHTML}
                <div class="toDoHeaderContainer">
                    ${titleHTML}
                    ${descriptionHTML}
                </div>
                ${subtasksHTML}
                <div class="toDoContentBottomContainer">
                    <div class="assignedToBadgeContainer">${assignedToHTML}</div>
                    ${prioHTML}
                </div>
            </div>
        </div>`;
}


function generateCategoryHTML(category) {
    let categoryHTML = '';
    if (category == 'User Story') {
        categoryHTML = `<div class="userStoryBadge">User Story</div>`;
    } else {
        categoryHTML = `<div class="technicalTaskBadge">Technical Task</div>`;
    }
    return categoryHTML;
}


function generateTitleHTML(title) {
    let titleHTML = '';
    if (title.length < 20) {
        titleHTML = `<div class="toDoHeader">${title}</div>`;
    } else {
        titleHTML = `<div class="toDoHeader">${title.substring(0, 20) + '...'}</div>`;
    }
    return titleHTML;
}


function generateDescriptionHTML(description) {
    let descriptionHTML = '';
    if (description.length < 50) {
        descriptionHTML = `<div class="toDoDescription">${description}</div>`;
    } else {
        descriptionHTML = `<div class="toDoDescription">${description.substring(0, 44) + '...'}</div>`;
    }
    return descriptionHTML;
}


function generateSubtasksHTML(subtasks) {
    let subtasksHTML = "";
    if (subtasks && Object.keys(subtasks).length > 1) {
        subtasksHTML = `${Object.keys(subtasks).length} Subtasks`;
    }
    return subtasksHTML;
}


function generateAssignedToHTML(assignedTo) {
    let assignedToHTML = '';
    for (let i = 0; i < Math.min(assignedTo.length, 4); i++) {
        const color = getRandomColor(badgeColors);
        const initials = assignedTo[i].match(/(\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase();
        assignedToHTML += `<div class="assignedToBadge" style="background-color: ${color};">${initials}</div>`;
    }
    if (assignedTo.length > 4) {
        assignedToHTML += `<div class="assignedToMoreBadge">...</div>`;
    }
    return assignedToHTML;
}


function generatePrioHTML(prio) {
    let prioHTML = '';
    if (prio == 'urgent') {
        prioHTML = `<img src="../assets/icons/priourgent.png">`;
    } else if (prio == 'medium') {
        prioHTML = `<img src="../assets/icons/priomedium.png">`;
    } else {
        prioHTML = `<img src="../assets/icons/priolow.png">`;
    }
    return prioHTML;
}


function generateModalCategoryHTML(category) {
    let modalCategoryHTML = '';
    if (category == 'User Story') {
        modalCategoryHTML = `<div class="modalUserStoryBadge">User Story</div>`;
    } else {
        modalCategoryHTML = `<div class="modalTechnicalTaskBadge">Technical Task</div>`;
    }
    return modalCategoryHTML;
}


function generateModalAssignedToHTML(assignedTo) {
    let modalAssignedToHTML = '';
    for (let i = 0; i < assignedTo.length; i++) {
        const initials = assignedTo[i].match(/(\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase();
        const color = getRandomColor(badgeColors);
        modalAssignedToHTML += /*html*/ `
            <div class="modalAssignedToSingle">
                <div class="modalAssignedToBadge" style="background-color: ${color};">${initials}</div>
                <div>${assignedTo[i]}</div>
            </div>
        `;
    }
    return modalAssignedToHTML;
}


function generateModalSubtasksHTML(element) {
    let modalSubtasksHTML = "";

    for (let i = 0; i < element.subtasks.length; i++) {
        modalSubtasksHTML += /*html*/ `
            <label id="('${element.subtasks[i].key}')" class="modalSubtasksSingle">
                <img src="../assets/icons/checkbox.svg">
                <div>${element.subtasks[i]}</div>
            </label>
        `;
    }
    return modalSubtasksHTML;
}


function generateOpenOverlayHTML(element) {
    let modalCategoryHTML = generateModalCategoryHTML(element.category);
    let priority = element.prio.charAt(0).toUpperCase() + element.prio.slice(1);
    let modalAssignedToHTML = generateModalAssignedToHTML(element.assignedTo);
    let modalSubtasksHTML = generateModalSubtasksHTML(element);

    return /*html*/ `
    <div class="modalContainer">
        <div class="modalToDoContent">
            <div class="modalCategoryContainer">
                ${modalCategoryHTML}
                <img class="modalCloseIcon" onclick="closeModal()" src="../assets/icons/clearIcon.svg" alt="">
            </div>
            <div class="modalScrollbarWrapper">
                <div class="modalHeader">${element.title}</div>
                <div class="modalDescription">${element.description}</div>
                <div class="modalDateContainer">
                    <div class="modalDateText">Due date:</div>
                    <div>${element.date}</div>
                </div>
                <div class="modalPrioContainer">
                    <div class="modalPrioText">Priority:</div>
                    <div class="modalPrioIconContainer">
                        <div>${priority}</div>
                        <img src="../assets/icons/prio${element.prio}small.svg">
                    </div>
                </div>
                <div class="modalAssignedToContainer">
                    <div class="modalAssignedToText">Assigned To:</div>
                    <div class="modalAssignedToContainer">${modalAssignedToHTML}</div>
                </div>
                <div>
                    <div class="modalSubtasksText">Subtasks</div>
                    <div class="modalSubtasksContainer">${modalSubtasksHTML}</div>
                </div>
            </div>
            <div class="modalBottomContainer">
                <div class="modalBottomDeleteContainer" onclick="deleteTask('${element.id}')">
                    <img src="../assets/icons/deleteDarkBlue.svg">
                    <div>Delete</div>
                </div>
                <div class="modalBottomSeparator"></div>
                <div class="modalBottomEditContainer">
                    <img src="../assets/icons/pencilDarkBlue.svg">
                    <div>Edit</div>
                </div>
            </div>
        </div>
    </div>
    `;
}

