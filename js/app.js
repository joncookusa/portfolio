function openMenu() {
    var hamburger = document.querySelector('.hamburger-menu');
    if (hamburger.classList.contains('hide-element')) {
        hamburger.classList.remove('hide-element');
        hamburger.classList.add('show-element');
    } else {
        hamburger.classList.remove('show-element');
        hamburger.classList.add('hide-element');
    }
}
