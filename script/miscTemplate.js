function greetingMobileHTML(greetingTime, greetingName) {
  return /*html*/`    
    <div class="summ-greeting-mobile">
      <h3 class="summ-day-greeting">${greetingTime}</h3>
      <span class="summ-person-greeting">${greetingName}</span>
    </div>
  `;
}

function objectTemplateNumberOfBoard(key, task) {
  return {
    "id": key,
    "assignedTo": task.assignedTo,
    "category": task.category,
    "date": task.date,
    "description": task.description,
    "prio": task.prio,
    "status": task.status,
    "subtasks": task.subtasks,
    "title": task.title
  };
}