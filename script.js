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
    const closeNavigation = () => {
        burger.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-label', 'Открыть меню');
        navigation.classList.remove('open');
        document.body.classList.remove('menu-open');
        closeDropdowns();
    };

    burger.addEventListener('click', function () {
        const isOpen = navigation.classList.toggle('open');
        this.classList.toggle('active', isOpen);
        this.setAttribute('aria-expanded', String(isOpen));
        this.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
        document.body.classList.toggle('menu-open', isOpen);

        if (!isOpen) {
            closeDropdowns();
        }
    });

    document.querySelectorAll('.navigation a').forEach((item) => {
        item.addEventListener('click', closeNavigation);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navigation.classList.contains('open')) {
            closeNavigation();
            burger.focus();
        }
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

document.querySelectorAll('[data-filter-grid]').forEach((grid) => {
    const cards = Array.from(grid.querySelectorAll('[data-tags]'));
    const section = grid.closest('.catalog-section');
    const filters = section ? Array.from(section.querySelectorAll('[data-filter]')) : [];
    const count = section?.querySelector('[data-visible-count]');
    const emptyState = section?.querySelector('[data-filter-empty]');

    if (!cards.length || !filters.length) {
        return;
    }

    filters.forEach((filterButton) => {
        filterButton.addEventListener('click', () => {
            const selectedFilter = filterButton.dataset.filter;
            let visibleCount = 0;

            filters.forEach((button) => {
                const isActive = button === filterButton;
                button.classList.toggle('is-active', isActive);
                button.setAttribute('aria-pressed', String(isActive));
            });

            cards.forEach((card) => {
                const tags = (card.dataset.tags || '').split(/\s+/);
                const isVisible = selectedFilter === 'all' || tags.includes(selectedFilter);
                card.hidden = !isVisible;

                if (isVisible) {
                    visibleCount += 1;
                }
            });

            if (count) {
                count.textContent = String(visibleCount);
            }

            if (emptyState) {
                emptyState.hidden = visibleCount !== 0;
            }
        });
    });

    filters.forEach((button) => {
        button.setAttribute('aria-pressed', String(button.classList.contains('is-active')));
    });
});

const articleMatch = window.location.pathname.match(/^\/(forkids|forParents)\/material-\d+\.html$/i);

if (articleMatch) {
    const isForParents = articleMatch[1].toLowerCase() === 'forparents';
    const audienceLabel = isForParents ? 'Для родителей' : 'Для детей';
    const catalogHref = isForParents ? '../forParents.html' : '../materials.html';
    const main = document.querySelector('main');
    const article = main?.querySelector(':scope > section');

    document.body.classList.add('article-page', isForParents ? 'article-page--parents' : 'article-page--kids');

    if (!document.querySelector('link[rel="icon"]')) {
        const favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.href = '../img/favicon.svg';
        favicon.type = 'image/svg+xml';
        document.head.append(favicon);
    }

    const progress = document.createElement('div');
    progress.className = 'reading-progress';
    progress.setAttribute('aria-hidden', 'true');
    progress.innerHTML = '<span></span>';
    document.body.prepend(progress);

    const updateReadingProgress = () => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const percent = scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0;
        progress.firstElementChild.style.width = `${percent}%`;
    };

    window.addEventListener('scroll', updateReadingProgress, { passive: true });
    window.addEventListener('resize', updateReadingProgress);
    updateReadingProgress();

    if (main && article) {
        const title = article.querySelector('h1');
        const words = article.textContent.trim().split(/\s+/).length;
        const readingTime = Math.max(2, Math.ceil(words / 180));

        const breadcrumbs = document.createElement('nav');
        breadcrumbs.className = 'article-breadcrumbs';
        breadcrumbs.setAttribute('aria-label', 'Хлебные крошки');
        breadcrumbs.innerHTML = `<a href="../index.html">Главная</a><span aria-hidden="true">/</span><a href="${catalogHref}">${audienceLabel}</a><span aria-hidden="true">/</span><span aria-current="page">Статья</span>`;
        main.insertBefore(breadcrumbs, main.firstElementChild);

        const meta = document.createElement('div');
        meta.className = 'article-meta';
        meta.innerHTML = `<span>${audienceLabel}</span><span>${readingTime} мин чтения</span><span>Интернет-безопасность</span>`;
        article.insertBefore(meta, article.firstElementChild);

        if (title && !title.id) {
            title.id = 'article-title';
            article.setAttribute('aria-labelledby', title.id);
        }
    }
}
