
import { calcHeaderHeight } from "./utils/calc-header-height"
import initAnimations from "./modules/init-animations"
import initTeamSlider from "./modules/init-team-slider";
import initStagesSlider from "./modules/init-stages-slider"

// DOM loaded
window.addEventListener('DOMContentLoaded', () => {

  calcHeaderHeight()
  initAnimations()
  initTeamSlider()
  initStagesSlider()

})
