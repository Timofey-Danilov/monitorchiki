const burger = document.querySelector('.burger');
const navigation = document.querySelector('.navigation');
const mobileNavigation = window.matchMedia('(max-width: 1275px)');
const dropdownTriggers = [];

const closeDropdowns = () => {
    dropdownTriggers.forEach(({ dropdown, trigger }) => {
        dropdown.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
    });
};

document.querySelectorAll('.navigation .dropdown').forEach((dropdown) => {
    const trigger = dropdown.querySelector('.spesical');

    if (!trigger) {
        return;
    }

    trigger.setAttribute('role', 'button');
    trigger.setAttribute('tabindex', '0');
    trigger.setAttribute('aria-expanded', 'false');
    dropdownTriggers.push({ dropdown, trigger });

    const toggleDropdown = () => {
        const isOpen = dropdown.classList.toggle('is-open');
        trigger.setAttribute('aria-expanded', String(isOpen));
    };

    trigger.addEventListener('click', () => {
        if (mobileNavigation.matches) {
            toggleDropdown();
        }
    });

    trigger.addEventListener('keydown', (event) => {
        if (mobileNavigation.matches && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            toggleDropdown();
        }
    });
});

if (burger && navigation) {
    burger.addEventListener('click', function () {
        const isOpen = navigation.classList.toggle('open');
        this.classList.toggle('active', isOpen);

        if (!isOpen) {
            closeDropdowns();
        }
    });

    document.querySelectorAll('.navigation a').forEach((item) => {
        item.addEventListener('click', () => {
            burger.classList.remove('active');
            navigation.classList.remove('open');
            closeDropdowns();
        });
    });
}

mobileNavigation.addEventListener('change', closeDropdowns);

document.querySelectorAll('dialog[id^="modal"]').forEach((modal) => {
    const number = modal.id.replace('modal', '');
    const openButton = document.getElementById(`openModalBtn${number}`);
    const closeButton = document.getElementById(`closeModalBtn${number}`);
    const previousButton = document.getElementById(`prevBtn${number}`);
    const nextButton = document.getElementById(`nextBtn${number}`);
    const slider = document.getElementById(`slider${number}`);
    const slides = slider ? Array.from(slider.children) : [];

    if (!openButton || !closeButton || !previousButton || !nextButton || !slider || !slides.length) {
        return;
    }

    let currentIndex = 0;

    const updateSlider = () => {
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    };

    openButton.addEventListener('click', () => {
        modal.showModal();
        updateSlider();
    });

    closeButton.addEventListener('click', () => {
        modal.close();
    });

    previousButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlider();
    });

    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlider();
    });
});
