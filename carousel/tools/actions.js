/**
 * Move carousel type 'loop'
 * @param {object} element - Carousel object
 */
export function moveCarouselLoop(element) {
    if (element.config.type != 'loop') return
    
    let delta = 0
    let width = element.itemsContainer.offsetWidth
    let speed = getComputedStyle(
        document.documentElement
    ).getPropertyValue('--loop-speed') 
    let delay = getComputedStyle(
        document.documentElement
    ).getPropertyValue('--loop-delay')
    
    element.itemsContainerClone.style = `--left-position: ${width}px`
    
    function moveCarousel() {
        delta = Math.abs(delta) >= width ? 0 : delta - speed
        element.itemsContainer.style = `--left-position: ${delta}px`;
        element.itemsContainerClone.style = `--left-position: ${width + delta}px`;
    }

    function hover() {
        clearInterval(carouselInterval);
    }

    function unhover() {
        carouselInterval = setInterval(moveCarousel, delay);
    }

    element.loop.addEventListener("mouseenter", hover);
    element.loop.addEventListener("mouseleave", unhover);
    let carouselInterval = setInterval(moveCarousel, delay);

    window.addEventListener("resize", () => {
        width = element.itemsContainer.offsetWidth
        speed = getComputedStyle(
            document.documentElement
        ).getPropertyValue('--loop-speed') 
        delay = getComputedStyle(
            document.documentElement
        ).getPropertyValue('--loop-delay') 
    })
}
