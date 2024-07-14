const badgeColors = ['rgb(255, 121, 0)', 'rgb(29, 215, 193)', 'rgb(71, 47, 138)', 'rgb(255, 187, 43)', 'rgb(252, 113, 255)', 'rgb(110, 82, 255)', 'rgb(148, 38, 255)', 'rgb(255, 69, 70)'];


function generateTodoHTML(element) {
  let categoryHTML = generateCategoryHTML(element.category);
  let subtasksHTML = generateSubtasksHTML(element.subtasks);
  let assignedToHTML = generateAssignedToHTML(element.assignedTo);
  let prioHTML = generatePrioHTML(element.prio);

  return /*html*/ `
        <div draggable="true" id="${element.id}" class="todoContainer">
            <div class="toDoContent">
                ${categoryHTML}
                <div class="toDoHeader">${element.title}</div>
                <div>${element.description}</div>
                ${subtasksHTML}
                <div class="toDoContentBottomContainer">
                    <div class="assignedToBadgeContainer">${assignedToHTML}</div>
                    ${prioHTML}
                </div>
            </div>
        </div>`;
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


function generateCategoryHTML(category) {
    let categoryHTML = '';
    if (category == 'User Story') {
        categoryHTML = `<div class="userStoryBadge">User Story</div>`;
    } else {
        categoryHTML = `<div class="technicalTaskBadge">Technical Task</div>`;
    }
    return categoryHTML;
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
    for (let i = 0; i < assignedTo.length; i++) {
        const color = getRandomColor(badgeColors);
        assignedToHTML += `
            <div class="assignedToBadge" style="background-color: ${color};">${assignedTo[i].match(/(\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase()}</div>`;
    }
    return assignedToHTML;
}


function getRandomColor(badgeColors) {
    return badgeColors[Math.floor(Math.random() * badgeColors.length)];
}
