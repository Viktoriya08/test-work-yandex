export default class Dropdown {
	constructor(selector) {
		this.dropdowns = document.querySelectorAll(`${selector}`)
		this.init()
	}
	init() {
		this.dropdowns.forEach(item => {
			const [title, content] = item.children
			title.addEventListener('click', ()=> {
				this.toggle(item, content)
			})
		})
	}
	toggle(item, content) {
		if (item.classList.contains("active")) {
			item.classList.remove("active")
			content.style.height = '0px'
		} else {
			item.classList.add("active")
			content.style.height = `${content.scrollHeight}px`
		}
	}
}
