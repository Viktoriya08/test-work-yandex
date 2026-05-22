(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const calcHeaderHeight = () => {
  const doc = document.documentElement;
  const header = document.querySelector(".main-header");
  if (header)
    doc.style.setProperty("--main-header-height", `${header.offsetHeight}px`);
};
function initAnimations() {
  function animation(targets, options) {
    const animateTargets = document.querySelectorAll(`.${targets}`);
    const animateClass = options.animationClass || "animate";
    const treshold = options.treshold || 0.45;
    const isReturnable = options.isReturnable || false;
    const delayStart = Number.isNaN(options.delayStart) ? 0.25 : options.delayStart;
    const delayShift = Number.isNaN(options.delayShift) ? 0.1 : options.delayShift;
    const observeParams = {
      rootMargin: "0px",
      threshold: treshold
    };
    if (window.matchMedia("(max-width: 768px)").matches) {
      observeParams.threshold = +treshold - 0.1;
    }
    if (animateTargets) {
      const observerCallback = (entries) => {
        let delay = Number.isNaN(delayStart) ? 0.25 : delayStart;
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.classList.contains(targets)) {
            if (delayShift && delayShift !== 0) {
              entry.target.setAttribute(
                "style",
                `animation-delay: ${delay}s;`
              );
              delay += delayShift;
            }
            entry.target.classList.add(animateClass);
            entry.target.addEventListener(
              "animationend",
              (e) => {
                e.stopImmediatePropagation();
                entry.target.classList.remove(
                  targets,
                  animateClass
                );
                entry.target.removeAttribute("style");
              },
              { once: true }
            );
          } else if (isReturnable) {
            entry.target.classList.add(targets);
          }
        });
      };
      const animateObserver = new IntersectionObserver(
        observerCallback,
        observeParams
      );
      animateTargets.forEach((target) => {
        animateObserver.observe(target);
      });
    }
  }
  animation("fadeInUp", {
    animationClass: "js-visible"
  });
  animation("fadeInLeft", {
    animationClass: "js-visible"
  });
  animation("fadeInRight", {
    animationClass: "js-visible"
  });
  animation("fadeInBottom", {
    animationClass: "js-visible"
  });
}
function initTeamSlider(burgerClass, menuClass) {
  const track = document.querySelector(".team-section__track");
  const slides = Array.from(document.querySelectorAll(".team-section__slide"));
  const btnPrev = document.querySelector(".team-section__btn--prev");
  const btnNext = document.querySelector(".team-section__btn--next");
  const countCurrent = document.querySelector(".team-section__count-current");
  const countTotal = document.querySelector(".team-section__count-total");
  if (!track || slides.length === 0) return;
  const totalOriginalSlides = slides.length;
  const maxSlidesPerView = 3;
  let slidesPerView = 3;
  let currentIndex = maxSlidesPerView;
  let autoPlayTimer = null;
  let isTransitioning = false;
  if (countTotal) countTotal.textContent = totalOriginalSlides;
  for (let i = 0; i < maxSlidesPerView; i++) {
    track.appendChild(slides[i].cloneNode(true));
  }
  for (let i = totalOriginalSlides - 1; i >= totalOriginalSlides - maxSlidesPerView; i--) {
    track.insertBefore(slides[i].cloneNode(true), track.firstChild);
  }
  const allSlides = document.querySelectorAll(".team-section__slide");
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
    if (oldSlidesPerView !== slidesPerView) {
      track.style.transition = "none";
      const slideWidth = 100 / slidesPerView;
      track.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
      updateCounter();
    }
  }
  updateBreakpoints();
  window.addEventListener("resize", updateBreakpoints);
  function moveSlider(index) {
    if (isTransitioning) return;
    isTransitioning = true;
    const slideWidth = 100 / slidesPerView;
    track.style.transition = "transform 0.5s ease-in-out";
    track.style.transform = `translateX(-${index * slideWidth}%)`;
    currentIndex = index;
    updateCounter();
  }
  function updateCounter() {
    if (!countCurrent) return;
    let virtualIndex = (currentIndex - maxSlidesPerView) % totalOriginalSlides;
    if (virtualIndex < 0) virtualIndex += totalOriginalSlides;
    let currentActiveNumber = virtualIndex + slidesPerView;
    if (currentActiveNumber > totalOriginalSlides) {
      currentActiveNumber = currentActiveNumber - totalOriginalSlides;
    }
    countCurrent.textContent = currentActiveNumber;
  }
  track.addEventListener("transitionend", () => {
    isTransitioning = false;
    const slideWidth = 100 / slidesPerView;
    if (currentIndex >= allSlides.length - maxSlidesPerView) {
      track.style.transition = "none";
      currentIndex = maxSlidesPerView;
      track.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
    }
    if (currentIndex <= maxSlidesPerView - slidesPerView) {
      track.style.transition = "none";
      currentIndex = allSlides.length - maxSlidesPerView - slidesPerView;
      track.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
    }
  });
  if (btnNext) {
    btnNext.addEventListener("click", () => {
      if (isTransitioning) return;
      moveSlider(currentIndex + 1);
      startAutoPlay();
    });
  }
  if (btnPrev) {
    btnPrev.addEventListener("click", () => {
      if (isTransitioning) return;
      moveSlider(currentIndex - 1);
      startAutoPlay();
    });
  }
  function startAutoPlay() {
    stopAutoPlay();
    autoPlayTimer = setInterval(() => {
      moveSlider(currentIndex + 1);
    }, 4e3);
  }
  function stopAutoPlay() {
    if (autoPlayTimer) clearInterval(autoPlayTimer);
  }
  startAutoPlay();
  const viewport = document.querySelector(".team-section__viewport");
  if (viewport) {
    viewport.addEventListener("mouseenter", stopAutoPlay);
    viewport.addEventListener("mouseleave", startAutoPlay);
  }
}
function initStagesSlider(burgerClass, menuClass) {
  const track = document.querySelector(".stages-slider__track");
  const slides = Array.from(document.querySelectorAll(".stages-slider__track > *"));
  const btnPrev = document.querySelector(".stages-slider__btn--prev");
  const btnNext = document.querySelector(".stages-slider__btn--next");
  const dotsContainer = document.querySelector(".stages-slider__dots");
  if (!track || slides.length === 0) return;
  let currentIndex = 0;
  const totalSlides = slides.length;
  let isMobile = window.innerWidth <= 960;
  if (dotsContainer) {
    dotsContainer.innerHTML = "";
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement("span");
      dot.classList.add("stages-slider__dot");
      if (i === 0) dot.classList.add("stages-slider__dot--active");
      dot.addEventListener("click", () => {
        if (!isMobile) return;
        goToSlide(i);
      });
      dotsContainer.appendChild(dot);
    }
  }
  const dots = Array.from(document.querySelectorAll(".stages-slider__dot"));
  function goToSlide(index) {
    if (index < 0 || index >= totalSlides) return;
    currentIndex = index;
    if (currentIndex === 0) {
      track.style.transform = "translateX(0px)";
    } else {
      const slideWidth = slides[0].getBoundingClientRect().width;
      const trackStyles = window.getComputedStyle(track);
      const gap = parseFloat(trackStyles.gap) || 0;
      const amountToMove = (slideWidth + gap) * currentIndex;
      track.style.transform = `translateX(-${amountToMove}px)`;
    }
    updateControls();
  }
  function updateControls() {
    dots.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.classList.add("stages-slider__dot--active");
      } else {
        dot.classList.remove("stages-slider__dot--active");
      }
    });
    if (btnPrev) btnPrev.disabled = currentIndex === 0;
    if (btnNext) btnNext.disabled = currentIndex === totalSlides - 1;
  }
  if (btnNext) {
    btnNext.addEventListener("click", () => {
      if (!isMobile) return;
      goToSlide(currentIndex + 1);
    });
  }
  if (btnPrev) {
    btnPrev.addEventListener("click", () => {
      if (!isMobile) return;
      goToSlide(currentIndex - 1);
    });
  }
  function handleResize() {
    const wasMobile = isMobile;
    isMobile = window.innerWidth <= 960;
    if (!isMobile && wasMobile) {
      track.style.transform = "none";
      currentIndex = 0;
      updateControls();
    } else if (isMobile) {
      goToSlide(currentIndex);
    }
  }
  window.addEventListener("resize", handleResize);
  updateControls();
}
window.addEventListener("DOMContentLoaded", () => {
  calcHeaderHeight();
  initAnimations();
  initTeamSlider();
  initStagesSlider();
});
//# sourceMappingURL=main.js.map
