function addTask() {
    console.log('addTask() form');
}


/**
 * Updates the minimum date in the 'Due date' input field
 * 
 */
document.addEventListener("DOMContentLoaded", function() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    document.getElementById("dateInput").setAttribute("min", today);
});