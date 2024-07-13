function toggleHeader() {
    const headerContainerMobile = document.getElementById('headerContainerMobile');
    const headerContainerDesktop = document.getElementById('headerContainerDesktop');

    if (window.innerWidth >= 992) {
        switchHeaderToDesktop(headerContainerDesktop, headerContainerMobile);
    } else {
        switchHeaderToMobile(headerContainerDesktop, headerContainerMobile);
    }
}


function switchHeaderToDesktop(headerContainerDesktop, headerContainerMobile) {
    headerContainerMobile.style.display = 'none';
    headerContainerDesktop.style.display = 'flex';
}


function switchHeaderToMobile(headerContainerDesktop, headerContainerMobile) {
    headerContainerMobile.style.display = 'flex';
    headerContainerDesktop.style.display = 'none';
}


window.addEventListener('load', toggleHeader);
window.addEventListener('resize', toggleHeader);