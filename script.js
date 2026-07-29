document.querySelector('.burger').addEventListener('click', function () {
    this.classList.toggle('active');
    document.querySelector('.navigation').classList.toggle('open');
});

document.querySelectorAll('.navigation a').forEach((item) => {
    item.addEventListener('click', () => {
        document.querySelector('.burger').classList.remove('active');
        document.querySelector('.navigation').classList.remove('open');
    });
});

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
