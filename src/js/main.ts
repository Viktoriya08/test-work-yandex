// import { setScrollWidth } from './utils/scroll-width'
import { iosFixes } from './utils/ios-fixes'
// import { initModals } from './modules/init-modals'
// import { initTheme } from './modules/init-theme'
import { calcHeaderHeight } from "./utils/calc-header-height"
import initAnimations from "./modules/init-animations"
// import initMenu from "./modules/init-menu"
import Dropdown from "./modules/init-dropdown"
import { initMask } from "./modules/init-mask";
import { initCarousels } from './modules/init-carousels'
import { initFormsNew } from "./modules/init-forms";
import initTeamSlider from "./modules/init-team-slider";
import initStagesSlider from "./modules/init-stages-slider"

// DOM loaded
window.addEventListener('DOMContentLoaded', () => {
  // setScrollWidth()
  iosFixes()
  // initTheme()
  calcHeaderHeight()
  initAnimations()
  // initMenu(".js-menu", ".header__submenu")
  new Dropdown('[data-dropdown]')
  initMask()
  initCarousels()
  initFormsNew()
  initTeamSlider()
  initStagesSlider()

})

// All resources loaded
window.addEventListener('load', () => {
  // initModals()
})
