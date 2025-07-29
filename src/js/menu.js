document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.header__toggle');
    const navMenu = document.querySelector('.header__menu');
    const body = document.body;
    
    const navLinks = document.querySelectorAll('.header__link');

    const focusableElements = Array.from(navLinks);

    const toggleMenu = () => {
        navToggle.classList.toggle('is-active');
        navMenu.classList.toggle('is-active');
        body.classList.toggle('no-scroll');
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
        if (navMenu.classList.contains('is-active')) {
            if(focusableElements.length > 0) {
                focusableElements[0].focus();
            }
        }
    };

    if (navToggle) {
        navToggle.addEventListener('click', toggleMenu);
    }
    
    const closeMenu = () => {
        if (navMenu.classList.contains('is-active')) {
            navToggle.classList.remove('is-active');
            navMenu.classList.remove('is-active');
            body.classList.remove('no-scroll');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.focus();
        }
    };
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('is-active')) {
            closeMenu();
        }
    });

    navMenu.addEventListener('keydown', (e) => {
        if (!navMenu.classList.contains('is-active')) return;
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            const activeIndex = focusableElements.indexOf(document.activeElement);
            let nextIndex = 0;
            if (e.key === 'ArrowDown') {
                nextIndex = (activeIndex + 1) % focusableElements.length;
            } else if (e.key === 'ArrowUp') {
                nextIndex = (activeIndex - 1 + focusableElements.length) % focusableElements.length;
            }
            focusableElements[nextIndex].focus();
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('is-active')) {
                closeMenu();
            }
        });
    });
});