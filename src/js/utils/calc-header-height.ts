export const calcHeaderHeight = () => {
	const doc: HTMLElement = document.documentElement;
	const header = document.querySelector('.main-header') as HTMLElement;

	if (header)
		doc.style.setProperty('--main-header-height', `${header.offsetHeight}px`);
}
