document.addEventListener("DOMContentLoaded", function() {
    // Finde die aktuelle URL der Seite
    let currentPage = window.location.href;

    // Überprüfe, welche Seite geöffnet ist und setze die entsprechende Klasse
    if (currentPage.includes("summary.html")) {
      document.getElementById("menuSingleTabSummary").classList.add("menuSingleTabActive");
    } else if (currentPage.includes("addtask.html")) {
      document.getElementById("menuSingleTabAddTask").classList.add("menuSingleTabActive");
    } else if (currentPage.includes("board.html")) {
      document.getElementById("menuSingleTabBoard").classList.add("menuSingleTabActive");
    } else if (currentPage.includes("contacts.html")) {
      document.getElementById("menuSingleTabContacts").classList.add("menuSingleTabActive");
    }
  });
