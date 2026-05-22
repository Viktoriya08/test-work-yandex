export default function initTeamSlider(burgerClass, menuClass) {
	const track = document.querySelector('.team-section__track');
  const slides = Array.from(document.querySelectorAll('.team-section__slide'));
  const btnPrev = document.querySelector('.team-section__btn--prev');
  const btnNext = document.querySelector('.team-section__btn--next');
  const countCurrent = document.querySelector('.team-section__count-current');
  const countTotal = document.querySelector('.team-section__count-total');

  if (!track || slides.length === 0) return;

  const totalOriginalSlides = slides.length;
  const maxSlidesPerView = 3; // Максимальное количество клонов, которое нам понадобится

  let slidesPerView = 3; // Динамическая переменная (меняется от ширины экрана)
  let currentIndex = maxSlidesPerView; // Стартуем всегда с позиции после максимальных клонов
  let autoPlayTimer = null;
  let isTransitioning = false;

  if (countTotal) countTotal.textContent = totalOriginalSlides;

  // 1. Клонируем фиксированное максимальное количество (по 3 штуки) для бесшовности
  for (let i = 0; i < maxSlidesPerView; i++) {
    track.appendChild(slides[i].cloneNode(true));
  }
  for (let i = totalOriginalSlides - 1; i >= totalOriginalSlides - maxSlidesPerView; i--) {
    track.insertBefore(slides[i].cloneNode(true), track.firstChild);
  }

  const allSlides = document.querySelectorAll('.team-section__slide');

  // 2. Функция настройки адаптива (Breakpoints)
  function updateBreakpoints() {
    const width = window.innerWidth;
    const oldSlidesPerView = slidesPerView;

    if (width <= 768) {
      slidesPerView = 1;
    } else if (width <= 960) {
      slidesPerView = 2;
    } else {
      slidesPerView = 3;
    }

    // Если разрешение изменилось, корректируем индекс, чтобы не ломать позицию
    if (oldSlidesPerView !== slidesPerView) {
      track.style.transition = 'none';
      const slideWidth = 100 / slidesPerView;
      track.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
      updateCounter();
    }
  }

  // Запускаем проверку экрана при старте
  updateBreakpoints();

  // Пересчитываем положение при изменении размера окна (с защитой от зависаний)
  window.addEventListener('resize', updateBreakpoints);

  // 3. Функция движения
  function moveSlider(index) {
    if (isTransitioning) return;
    isTransitioning = true;

    const slideWidth = 100 / slidesPerView;
    track.style.transition = 'transform 0.5s ease-in-out';
    track.style.transform = `translateX(-${index * slideWidth}%)`;
    currentIndex = index;

    updateCounter();
  }

  // 4. Логика счетчика подстраивается под текущий slidesPerView
  function updateCounter() {
    if (!countCurrent) return;

    // Привязываем текущий индекс к оригинальному массиву
    let virtualIndex = (currentIndex - maxSlidesPerView) % totalOriginalSlides;
    if (virtualIndex < 0) virtualIndex += totalOriginalSlides;

    // Считаем номер последней видимой карточки справа
    let currentActiveNumber = virtualIndex + slidesPerView;

    if (currentActiveNumber > totalOriginalSlides) {
      currentActiveNumber = currentActiveNumber - totalOriginalSlides;
    }

    countCurrent.textContent = currentActiveNumber;
  }

  // 5. Бесшовный сброс на краях
  track.addEventListener('transitionend', () => {
    isTransitioning = false;
    const slideWidth = 100 / slidesPerView;

    // Правый край (зашли на клоны)
    if (currentIndex >= allSlides.length - maxSlidesPerView) {
      track.style.transition = 'none';
      currentIndex = maxSlidesPerView;
      track.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
    }

    // Левый край (зашли на клоны)
    if (currentIndex <= maxSlidesPerView - slidesPerView) {
      track.style.transition = 'none';
      currentIndex = allSlides.length - maxSlidesPerView - slidesPerView;
      track.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
    }
  });

  // 6. Слушатели кнопок
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (isTransitioning) return;
      moveSlider(currentIndex + 1);
      startAutoPlay();
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (isTransitioning) return;
      moveSlider(currentIndex - 1);
      startAutoPlay();
    });
  }

  // 7. Автопрокрутка
  function startAutoPlay() {
    stopAutoPlay();
    autoPlayTimer = setInterval(() => {
      moveSlider(currentIndex + 1);
    }, 4000);
  }

  function stopAutoPlay() {
    if (autoPlayTimer) clearInterval(autoPlayTimer);
  }

  startAutoPlay();

  const viewport = document.querySelector('.team-section__viewport');
  if (viewport) {
    viewport.addEventListener('mouseenter', stopAutoPlay);
    viewport.addEventListener('mouseleave', startAutoPlay);
  }
}
