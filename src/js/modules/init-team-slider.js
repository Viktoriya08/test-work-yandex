export default function initTeamSlider(burgerClass, menuClass) {
  const track = document.querySelector('.team-section__track');
  const slides = Array.from(document.querySelectorAll('.team-section__slide'));
  const btnPrev = document.querySelector('.team-section__btn--prev');
  const btnNext = document.querySelector('.team-section__btn--next');
  const countCurrent = document.querySelector('.team-section__count-current');
  const countTotal = document.querySelector('.team-section__count-total');

  if (!track || slides.length === 0) return;

  const totalOriginalSlides = slides.length;
  let slidesPerView = getSlidesPerView();
  let clonesCount = slidesPerView;
  let currentIndex = clonesCount;
  let autoPlayTimer = null;
  let isTransitioning = false;
  let allSlides = [];

  if (countTotal) countTotal.textContent = totalOriginalSlides;

  function getSlidesPerView() {
    const width = window.innerWidth;
    if (width <= 768) return 1;
    if (width <= 960) return 2;
    return 3;
  }

  function rebuildSlider() {
    // Очищаем трек
    while (track.firstChild) {
      track.removeChild(track.firstChild);
    }

    // Добавляем оригинальные слайды
    slides.forEach(slide => track.appendChild(slide.cloneNode(true)));

    // Получаем свежие ссылки
    const freshSlides = document.querySelectorAll('.team-section__slide');
    const totalFresh = freshSlides.length;

    // Добавляем клоны справа
    for (let i = 0; i < clonesCount; i++) {
      const clone = freshSlides[i % totalFresh].cloneNode(true);
      track.appendChild(clone);
    }

    // Добавляем клоны слева
    for (let i = 0; i < clonesCount; i++) {
      const cloneIndex = (totalFresh - 1 - (i % totalFresh) + totalFresh) % totalFresh;
      const clone = freshSlides[cloneIndex].cloneNode(true);
      track.insertBefore(clone, track.firstChild);
    }

    // Обновляем allSlides
    allSlides = document.querySelectorAll('.team-section__slide');

    // Ставим на правильную позицию (первый оригинальный слайд)
    const slideWidth = 100 / slidesPerView;
    currentIndex = clonesCount;
    track.style.transition = 'none';
    track.style.transform = `translateX(-${currentIndex * slideWidth}%)`;

    updateCounter();
  }

  function updateBreakpoints() {
    const newSlidesPerView = getSlidesPerView();

    if (newSlidesPerView !== slidesPerView) {
      slidesPerView = newSlidesPerView;
      clonesCount = slidesPerView;
      rebuildSlider(); // Пересобираем слайдер с новыми параметрами
    }
  }

  function moveSlider(index) {
    if (isTransitioning) return;
    isTransitioning = true;

    const slideWidth = 100 / slidesPerView;
    track.style.transition = 'transform 0.5s ease-in-out';
    track.style.transform = `translateX(-${index * slideWidth}%)`;
    currentIndex = index;

    updateCounter();
  }

  function updateCounter() {
    if (!countCurrent) return;

    let virtualIndex = (currentIndex - clonesCount) % totalOriginalSlides;
    if (virtualIndex < 0) virtualIndex += totalOriginalSlides;

    let currentActiveNumber = virtualIndex + slidesPerView;
    if (currentActiveNumber > totalOriginalSlides) {
      currentActiveNumber = currentActiveNumber - totalOriginalSlides;
    }

    countCurrent.textContent = currentActiveNumber;
  }

  function handleTransitionEnd() {
    isTransitioning = false;
    const slideWidth = 100 / slidesPerView;
    const totalWithClones = allSlides.length;

    // Правый край
    if (currentIndex >= totalWithClones - clonesCount) {
      track.style.transition = 'none';
      currentIndex = clonesCount;
      track.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
    }

    // Левый край
    if (currentIndex <= clonesCount - slidesPerView) {
      track.style.transition = 'none';
      currentIndex = totalWithClones - clonesCount - slidesPerView;
      track.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
    }
  }

  function startAutoPlay() {
    stopAutoPlay();
    autoPlayTimer = setInterval(() => {
      if (!isTransitioning) moveSlider(currentIndex + 1);
    }, 4000);
  }

  function stopAutoPlay() {
    if (autoPlayTimer) clearInterval(autoPlayTimer);
  }

  // Инициализация
  rebuildSlider();

  window.addEventListener('resize', () => {
    updateBreakpoints();
  });

  track.addEventListener('transitionend', handleTransitionEnd);

  if (btnNext) btnNext.addEventListener('click', () => moveSlider(currentIndex + 1));
  if (btnPrev) btnPrev.addEventListener('click', () => moveSlider(currentIndex - 1));

  startAutoPlay();

  const viewport = document.querySelector('.team-section__viewport');
  if (viewport) {
    viewport.addEventListener('mouseenter', stopAutoPlay);
    viewport.addEventListener('mouseleave', startAutoPlay);
  }
}
