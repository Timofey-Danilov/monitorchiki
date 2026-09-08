const track = document.querySelector('.slider-track');
const btnPrev = document.querySelector('.slider-btn--prev');
const btnNext = document.querySelector('.slider-btn--next');

let slideWidth;
let isAnimating = false;

function updateSlideWidth() {
const firstSlide = track.querySelector('.slide');
if (firstSlide) {
    slideWidth = firstSlide.getBoundingClientRect().width;
}
}

updateSlideWidth();
window.addEventListener('resize', updateSlideWidth);

function moveNext() {
if (isAnimating) return;
isAnimating = true;
updateSlideWidth();

track.style.transition = 'transform 0.3s ease';
track.style.transform = `translateX(-${slideWidth}px)`;

const onTransitionEnd = () => {
    track.removeEventListener('transitionend', onTransitionEnd);

    track.appendChild(track.firstElementChild);

    track.style.transition = 'none';
    track.style.transform = 'translateX(0)';

    requestAnimationFrame(() => {
    isAnimating = false;
    });
};

track.addEventListener('transitionend', onTransitionEnd);
}

function movePrev() {
if (isAnimating) return;
isAnimating = true;
updateSlideWidth();

track.style.transition = 'none';
track.insertBefore(track.lastElementChild, track.firstElementChild);

track.style.transform = `translateX(-${slideWidth}px)`;

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
