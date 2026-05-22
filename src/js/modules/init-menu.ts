export default function initMenu(burgerClass, menuClass) {
	const burger = document.querySelector(burgerClass)
	if (!burger) return

	const menu = document.querySelector(menuClass)
	const body = document.querySelector("body")

	burger.addEventListener("click", () => {
		if (body?.classList.contains("menu-open")) {
			document.removeEventListener("click", outsideEvtListener)
		} else {
			setTimeout(() => {
				document.addEventListener("click", outsideEvtListener)
			})
		}
		burger.classList.toggle("opened")
		body?.classList.toggle("menu-open")
	})

	function outsideEvtListener(evt) {
		if (evt.target === menu || menu.contains(evt.target)) return
		burger.classList.toggle("opened")
		body?.classList.toggle("menu-open")
		document.removeEventListener("click", outsideEvtListener)
	}
}
