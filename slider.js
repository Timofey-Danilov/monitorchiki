const track = document.querySelector('.slider-track');
const btnPrev = document.querySelector('.slider-btn--prev');
const btnNext = document.querySelector('.slider-btn--next');

let slideWidth;       // ширина одного слайда
let isAnimating = false;

function updateSlideWidth() {
const firstSlide = track.querySelector('.slide');
if (firstSlide) {
    slideWidth = firstSlide.getBoundingClientRect().width;
}
}

// посчитаем ширину при загрузке
updateSlideWidth();
// и при ресайзе
window.addEventListener('resize', updateSlideWidth);

// Движение вперёд
function moveNext() {
if (isAnimating) return;
isAnimating = true;
updateSlideWidth();

track.style.transition = 'transform 0.3s ease';
track.style.transform = `translateX(-${slideWidth}px)`;

const onTransitionEnd = () => {
    // убираем слушатель, чтобы не плодить
    track.removeEventListener('transitionend', onTransitionEnd);

    // переносим первый слайд в конец
    track.appendChild(track.firstElementChild);

    // отключаем анимацию, возвращаемся в 0
    track.style.transition = 'none';
    track.style.transform = 'translateX(0)';

    // чтобы следующий сдвиг анимировался
    requestAnimationFrame(() => {
    isAnimating = false;
    });
};

track.addEventListener('transitionend', onTransitionEnd);
}

// Движение назад
function movePrev() {
if (isAnimating) return;
isAnimating = true;
updateSlideWidth();

// моментально переносим последний слайд в начало
track.style.transition = 'none';
track.insertBefore(track.lastElementChild, track.firstElementChild);

// сдвигаем ленту влево на ширину одного слайда
track.style.transform = `translateX(-${slideWidth}px)`;

// следующий кадр — включаем анимацию и едем обратно в 0
requestAnimationFrame(() => {
    track.style.transition = 'transform 0.3s ease';
    track.style.transform = 'translateX(0)';

    const onTransitionEnd = () => {
    track.removeEventListener('transitionend', onTransitionEnd);
    track.style.transition = 'none';
    isAnimating = false;
    };

    track.addEventListener('transitionend', onTransitionEnd);
});
}

btnNext.addEventListener('click', moveNext);
btnPrev.addEventListener('click', movePrev);
