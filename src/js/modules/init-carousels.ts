import Swiper from 'swiper'
import { Navigation } from 'swiper/modules'
import { hasManySlides } from '../helpers/swiper-helpers'
import { MEDIA } from '../data/vars'

export const initCarousels = () => {
  const carousels: NodeListOf<HTMLElement> = document.querySelectorAll('[data-carousel]')

  carousels.forEach((item: HTMLElement) => {
    if (!hasManySlides(item) || item.classList.contains('swiper-initialized')) {
      return
    }

    let swiper
    const name = item.dataset.carousel
    const defaultOptions = {
      allowTouchMove: true,
      grabCursor: true,
      navigation: {
        prevEl: `[data-swiper-prev="${name}"]`,
        nextEl: `[data-swiper-next="${name}"]`,
        disabledClass: 'is-disabled'
      }
    }

    switch (name) {
      case 'default-slider':
        swiper = new Swiper(item, {
          modules: [Navigation],
          ...defaultOptions,
          slidesPerView: 1.25,
          spaceBetween: 16,
          breakpoints: {
            [MEDIA.tablet[1]]: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
            [MEDIA.desktop[1]]: {
              slidesPerView: 3,
            },
          }
        })
        break
      default:
        swiper = new Swiper(item, {
          modules: [Navigation],
          ...defaultOptions,
          slidesPerView: 1.2
        })
    }

    (item as HTMLElement & { swiperApi?: Swiper }).swiperApi = swiper
  })
}
