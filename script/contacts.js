async function getContactsData() {
  let loadItem = await loadData('contacts');
  await setContactsArray(loadItem);
  sessionStorage.setItem("contacts", contacts);
}

async function setContactsArray(loadItem) {
  for (let i = 0; i < loadItem.length; i++) {
    const element = loadItem[i];
    contacts.push({
      id: i,
      name: element.name,
      email: element.email,
      phone: element.phone,
      profilePic: await generateSvgCircleWithInitials(element.name, 120, 120),
      isUser: element.isUser
    });
  }
}

function setContactsData() {

}

function renderContactsGeneral() {

}

function renderContactsDetails() {

}

function editContacts() {

}

function deleteContacts() {

}

function addContacts() {

}
/**
 * This function generates an SVG circle with a white border and a random background color from a predefined array.
 * It also displays the initials of a name in white.
 *
 * @param {string} name The full name for which initials will be displayed.
 * @param {number} width The width of the SVG circle.
 * @param {number} height The height of the SVG circle.
 * @returns {string} The SVG markup for the circle with initials.
 */
async function generateSvgCircleWithInitials(name, width, height) {
  const colors = ['#FF6347', '#FFA500', '#FFFF00', '#008000', '#0000FF', '#800080', '#FF00FF', '#808000', '#800000', '#C0C0C0', '#00FFFF', '#F0F8FF', '#ADD8E6', '#E0FFFF', '#F0FFF0']; // Predefined array of colors
  const randomColor = colors[Math.floor(Math.random() * colors.length)]; // Random background color from the array
  const initials = name.split(' ').map(word => word[0]).join('').toUpperCase(); // Initials from name

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${width / 2}" cy="${height / 2}" r="${Math.min(width, height) / 2 - 5}" stroke="white" stroke-width="2" fill="${randomColor}"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="18px">${initials}</text>
    </svg>
  `;
}

// Example usage:
const svgMarkup = generateSvgCircleWithInitials('John Doe', 100, 100);
console.log(svgMarkup);
