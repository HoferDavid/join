function toggleDisplay() {
    const mobileHeader = document.getElementById('boardHeaderMobile');
    const mobileSearchContainer = document.getElementById('boardSearchContainerMobile');
    const desktopHeader = document.getElementById('boardHeaderDesktop');
    const desktopSearchContainer = document.getElementById('boardSearchContainerDesktop');

    if (window.innerWidth >= 768) {
        mobileHeader.style.display = 'none';
        mobileSearchContainer.style.display = 'none';
        desktopHeader.style.display = 'flex';
        desktopSearchContainer.style.display = 'flex';
    } else {
        mobileHeader.style.display = 'flex';
        mobileSearchContainer.style.display = 'flex';
        desktopHeader.style.display = 'none';
        desktopSearchContainer.style.display = 'none';
    }
}

// Event Listener für das Laden der Seite und die Größenänderung des Fensters
window.addEventListener('load', toggleDisplay);
window.addEventListener('resize', toggleDisplay);