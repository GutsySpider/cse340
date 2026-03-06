const navbutton = document.querySelector('#hamburger');
const navBar = document.querySelector('#nav-bar')

//Toggle the show class off aand on
navbutton.addEventListener('click', () => {
    navbutton.classList.toggle('show');
    navBar.classList.toggle('show');
});

