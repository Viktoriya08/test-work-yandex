export default function initStagesSlider(burgerClass, menuClass) {
  const track = document.querySelector('.stages-slider__track');
  const slides = Array.from(document.querySelectorAll('.stages-slider__track > *'));
  const btnPrev = document.querySelector('.stages-slider__btn--prev');
  const btnNext = document.querySelector('.stages-slider__btn--next');
  const dotsContainer = document.querySelector('.stages-slider__dots');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  const totalSlides = slides.length;
  let isMobile = window.innerWidth <= 960;

  // 1. Автоматическая генерация точек пагинации
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('span');
      dot.classList.add('stages-slider__dot');
      if (i === 0) dot.classList.add('stages-slider__dot--active');

      dot.addEventListener('click', () => {
        if (!isMobile) return;
        goToSlide(i);
      });
      dotsContainer.appendChild(dot);
    }
  }

  const dots = Array.from(document.querySelectorAll('.stages-slider__dot'));

  // 2. Функция переключения на конкретный слайд с точным расчетом сдвига
  function goToSlide(index) {
    if (index < 0 || index >= totalSlides) return;

    currentIndex = index;

    if (currentIndex === 0) {
      // На первом слайде смещение всегда нулевое
      track.style.transform = 'translateX(0px)';
    } else {
      // ИСПРАВЛЕНИЕ: Берем точную ширину одного слайда в пикселях
      const slideWidth = slides[0].getBoundingClientRect().width;

      // ИСПРАВЛЕНИЕ: Получаем размер отступа gap из CSS-стилей трека
      const trackStyles = window.getComputedStyle(track);
      const gap = parseFloat(trackStyles.gap) || 0;

      // Точная формула сдвига: (ширина слайда + отступ) * текущий индекс
      const amountToMove = (slideWidth + gap) * currentIndex;
      track.style.transform = `translateX(-${amountToMove}px)`;
    }

    updateControls();
  }

  // 3. Обновление состояния кнопок и активной точки
  function updateControls() {
    // ИСПРАВЛЕНИЕ: Чистим и правильно переключаем активный класс у точек
    dots.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.classList.add('stages-slider__dot--active');
      } else {
        dot.classList.remove('stages-slider__dot--active');
      }
    });

    if (btnPrev) btnPrev.disabled = currentIndex === 0;
    if (btnNext) btnNext.disabled = currentIndex === totalSlides - 1;
  }

  // 4. Обработчики для кнопок-стрелок
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (!isMobile) return;
      goToSlide(currentIndex + 1);
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (!isMobile) return;
      goToSlide(currentIndex - 1);
    });
  }

  // 5. Контроль изменения размеров экрана (Breakpoint Control)
  function handleResize() {
    const wasMobile = isMobile;
    isMobile = window.innerWidth <= 960;

    if (!isMobile && wasMobile) {
      track.style.transform = 'none';
      currentIndex = 0;
      updateControls();
    }
    else if (isMobile) {
      // Пересчитываем положение слайда в пикселях при ресайзе
      goToSlide(currentIndex);
    }
  }

  window.addEventListener('resize', handleResize);

  // Первичная инициализация состояния кнопок
  updateControls();
}
