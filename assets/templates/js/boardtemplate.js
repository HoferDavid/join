const badgeColors = ['rgb(255, 121, 0)', 'rgb(29, 215, 193)', 'rgb(71, 47, 138)', 'rgb(255, 187, 43)', 'rgb(252, 113, 255)', 'rgb(110, 82, 255)', 'rgb(148, 38, 255)', 'rgb(255, 69, 70)'];


function generateTodoHTML(element) {
  let categoryHTML = generateCategoryHTML(element.category);
  let titleHTML = generateTitleHTML(element.title);
  let descriptionHTML = generateDescriptionHTML(element.description);
  let subtasksHTML = generateSubtasksHTML(element.subtasks);
  let assignedToHTML = generateAssignedToHTML(element.assignedTo);
  let prioHTML = generatePrioHTML(element.prio);

  return /*html*/ `
        <div draggable="true" id="${element.id}" class="todoContainer">
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


function getRandomColor(badgeColors) {
    return badgeColors[Math.floor(Math.random() * badgeColors.length)];
}




